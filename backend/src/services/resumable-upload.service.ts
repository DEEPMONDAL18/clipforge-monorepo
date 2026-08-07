import {
  InitUploadRequestDTO,
  InitUploadResponseDTO,
  JobStatus,
  UploadChunkResponseDTO,
  UploadStatusResponseDTO
} from '@clipforge/shared';
import crypto from 'crypto';
import path from 'path';
import { APP_CONSTANTS } from '../config/constants.js';
import { AppEnv } from '../config/env.js';
import { IStorageProvider } from '../storage/storage-provider.interface.js';
import { IFFmpegService, IQueueService, IVideoService } from '../types/services.types.js';
import { AppError, NotFoundError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export interface InternalUploadSession {
  readonly jobId: string;
  readonly originalFileName: string;
  readonly sanitizedFileName: string;
  readonly fileSizeBytes: number;
  readonly mimeType: string;
  readonly chunkSizeBytes: number;
  readonly totalChunksCount: number;
  status: JobStatus;
  readonly expiresAt: string;
  readonly createdAt: string;
}

export class ResumableUploadService {
  private readonly sessions = new Map<string, InternalUploadSession>();
  private readonly chunkLocks = new Map<string, Promise<void>>();

  constructor(
    private readonly config: AppEnv,
    private readonly storageProvider: IStorageProvider,
    private readonly videoService: IVideoService,
    private readonly ffmpegService: IFFmpegService,
    private readonly queueService: IQueueService
  ) {}

  public async initUpload(dto: InitUploadRequestDTO): Promise<InitUploadResponseDTO> {
    // 1. File size validation
    if (dto.fileSizeBytes <= 0) {
      throw new ValidationError('File size must be greater than 0 bytes');
    }
    if (dto.fileSizeBytes > this.config.MAX_FILE_SIZE_BYTES) {
      throw new ValidationError(
        `File size (${dto.fileSizeBytes} bytes) exceeds maximum threshold (${this.config.MAX_FILE_SIZE_BYTES} bytes)`
      );
    }

    // 2. MIME type whitelist validation
    const mimeType = dto.mimeType.toLowerCase();
    const isSupportedMime = (APP_CONSTANTS.SUPPORTED_MIME_TYPES as readonly string[]).includes(
      mimeType
    );
    if (!isSupportedMime) {
      throw new ValidationError(`Unsupported media type: ${dto.mimeType}`);
    }

    // 3. Filename sanitization (Defend against path traversal and null byte injections)
    const sanitizedFileName = this.sanitizeFilename(dto.fileName);

    // 4. Generate upload ID and session expiration
    const jobId = `job_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const chunkSizeBytes = dto.chunkSizeBytes || this.config.DEFAULT_CHUNK_SIZE_BYTES;
    const totalChunksCount = Math.ceil(dto.fileSizeBytes / chunkSizeBytes);
    const expiresAt = new Date(Date.now() + this.config.JOB_TTL_SECONDS * 1000).toISOString();
    const now = new Date().toISOString();

    const session: InternalUploadSession = {
      jobId,
      originalFileName: dto.fileName,
      sanitizedFileName,
      fileSizeBytes: dto.fileSizeBytes,
      mimeType,
      chunkSizeBytes,
      totalChunksCount,
      status: JobStatus.UPLOADING,
      expiresAt,
      createdAt: now
    };

    this.sessions.set(jobId, session);

    // Register job metadata with VideoService
    await this.videoService.createJob(dto);

    logger.info(
      { jobId, fileName: sanitizedFileName, fileSizeBytes: dto.fileSizeBytes, totalChunksCount },
      'Initialized resumable upload session'
    );

    return {
      jobId,
      uploadUrl: `/api/v1/upload/${jobId}/chunk`,
      chunkSizeBytes,
      totalChunksCount,
      expiresAt
    };
  }

  public async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunkBuffer: Buffer,
    checksum: string
  ): Promise<UploadChunkResponseDTO> {
    const session = this.getValidSession(uploadId);

    // 1. Mandatory SHA-256 Checksum Validation
    if (!checksum || checksum.trim() === '') {
      throw new ValidationError("Missing required SHA-256 checksum header ('x-chunk-checksum')");
    }

    const computedHash = crypto.createHash('sha256').update(chunkBuffer).digest('hex');
    if (computedHash.toLowerCase() !== checksum.toLowerCase()) {
      throw new ValidationError(
        `Chunk SHA-256 checksum mismatch (expected: ${checksum}, computed: ${computedHash})`
      );
    }

    // 2. Validate chunk index bounds
    if (chunkIndex < 0 || chunkIndex >= session.totalChunksCount) {
      throw new ValidationError(
        `Chunk index ${chunkIndex} out of valid bounds [0, ${session.totalChunksCount - 1}]`
      );
    }

    // 3. Lightweight Chunk Write Locking Mechanism (Prevents race conditions on simultaneous duplicate chunk writes)
    const lockKey = `${uploadId}:${chunkIndex}`;
    const existingLock = this.chunkLocks.get(lockKey);
    if (existingLock) {
      await existingLock;
    }

    let resolveLock!: () => void;
    const lockPromise = new Promise<void>((res) => {
      resolveLock = res;
    });
    this.chunkLocks.set(lockKey, lockPromise);

    try {
      // Save chunk using storage provider (Idempotent operation)
      await this.storageProvider.saveChunk(uploadId, chunkIndex, chunkBuffer);
    } finally {
      this.chunkLocks.delete(lockKey);
      resolveLock();
    }

    // 4. Query uploaded chunks and check completion
    const uploadedIndices = await this.storageProvider.getUploadedChunkIndices(uploadId);
    const isComplete = uploadedIndices.length === session.totalChunksCount;

    logger.info(
      { jobId: uploadId, chunkIndex, uploadedCount: uploadedIndices.length, isComplete },
      'Received upload chunk'
    );

    // 5. Automatic Merge Detection: If all chunks land, trigger finalize & safe merge
    if (isComplete) {
      const mergedMetadata = await this.finalizeAndMergeUpload(session);
      return {
        jobId: uploadId,
        chunkIndex,
        totalChunksCount: session.totalChunksCount,
        uploadedChunksCount: uploadedIndices.length,
        bytesReceived: session.fileSizeBytes,
        isComplete: true,
        status: JobStatus.QUEUED,
        durationSeconds: mergedMetadata.durationSeconds,
        format: mergedMetadata.format,
        width: mergedMetadata.width,
        height: mergedMetadata.height
      };
    }

    return {
      jobId: uploadId,
      chunkIndex,
      totalChunksCount: session.totalChunksCount,
      uploadedChunksCount: uploadedIndices.length,
      bytesReceived: uploadedIndices.length * session.chunkSizeBytes,
      isComplete: false
    };
  }

  public async getUploadStatus(uploadId: string): Promise<UploadStatusResponseDTO> {
    const session = this.getValidSession(uploadId);
    const uploadedIndices = await this.storageProvider.getUploadedChunkIndices(uploadId);
    const uploadedSet = new Set(uploadedIndices);

    const missingIndices: number[] = [];
    for (let i = 0; i < session.totalChunksCount; i++) {
      if (!uploadedSet.has(i)) {
        missingIndices.push(i);
      }
    }

    return {
      jobId: uploadId,
      status: session.status,
      fileSizeBytes: session.fileSizeBytes,
      chunkSizeBytes: session.chunkSizeBytes,
      totalChunksCount: session.totalChunksCount,
      uploadedChunkIndices: uploadedIndices,
      missingChunkIndices: missingIndices,
      bytesReceived: uploadedIndices.length * session.chunkSizeBytes,
      expiresAt: session.expiresAt
    };
  }

  public async abortUpload(uploadId: string): Promise<void> {
    const session = this.sessions.get(uploadId);
    if (session) {
      session.status = JobStatus.DELETED;
    }

    await this.storageProvider.deleteChunkDirectory(uploadId);
    await this.videoService.updateJobStatus(uploadId, JobStatus.DELETED);
    this.sessions.delete(uploadId);

    logger.info({ jobId: uploadId }, 'Aborted upload session and purged temporary chunk files');
  }

  /**
   * Finalizes and merges chunks into the final target file.
   * Safe Cleanup Flow: Temporary chunk files are ONLY deleted after:
   * 1. all chunks are successfully stream-merged,
   * 2. FFprobe validates the container and extracts metadata,
   * 3. and the merged file is safely moved into final storage location.
   * If validation/merge fails, chunks are retained for debugging.
   */
  private async finalizeAndMergeUpload(session: InternalUploadSession): Promise<{
    durationSeconds: number;
    format: string;
    width?: number;
    height?: number;
  }> {
    const uploadId = session.jobId;
    const relativeDestPath = `uploads/${uploadId}/original_${session.sanitizedFileName}`;

    logger.info(
      { jobId: uploadId, relativeDestPath },
      'Automatic Merge Triggered: Stream-merging chunks into final video file'
    );

    try {
      // 1. Stream-merge chunks into final location
      const bytesWritten = await this.storageProvider.mergeChunks(
        uploadId,
        session.totalChunksCount,
        relativeDestPath
      );

      logger.info({ jobId: uploadId, bytesWritten }, 'Streamed chunk merge complete');

      // 2. FFprobe container & metadata validation
      const absoluteDestPath = path.resolve(this.config.STORAGE_ROOT_DIR, relativeDestPath);
      const metadata = await this.ffmpegService.getVideoMetadata(absoluteDestPath);

      // 3. SAFE CLEANUP: Delete temporary chunks ONLY after successful FFprobe validation & safe placement
      await this.storageProvider.deleteChunkDirectory(uploadId);

      // 4. Update status to QUEUED and enqueue BullMQ job
      session.status = JobStatus.QUEUED;
      await this.videoService.updateJobStatus(uploadId, JobStatus.QUEUED);
      await this.queueService.addVideoProcessingJob(uploadId);

      logger.info(
        { jobId: uploadId, metadata },
        'Upload validated, chunks safely purged, and job queued for processing'
      );

      return metadata;
    } catch (err) {
      session.status = JobStatus.FAILED;
      await this.videoService.updateJobStatus(
        uploadId,
        JobStatus.FAILED,
        err instanceof Error ? err.message : 'Upload merge/validation failed'
      );

      logger.error(
        { jobId: uploadId, err },
        'Upload merge/validation failed. Retaining temporary chunk files for debugging & recovery.'
      );

      throw new AppError(
        `Upload merge or FFprobe validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        500
      );
    }
  }

  private getValidSession(uploadId: string): InternalUploadSession {
    // Validate uploadId string format against path traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(uploadId)) {
      throw new ValidationError('Invalid upload ID format');
    }

    const session = this.sessions.get(uploadId);
    if (!session) {
      throw new NotFoundError(`Upload session '${uploadId}' not found or expired`);
    }

    if (session.status !== JobStatus.UPLOADING) {
      throw new ValidationError(`Upload session '${uploadId}' is in status '${session.status}'`);
    }

    return session;
  }

  private sanitizeFilename(filename: string): string {
    // Remove directory traversal sequences, null bytes, and non-printable characters
    const basename = path.basename(filename).replace(/\0/g, '');
    const clean = basename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return clean || 'video.mp4';
  }
}
