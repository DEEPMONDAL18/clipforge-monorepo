import { JobStatus, SplitSegmentInput } from '@clipforge/shared';
import path from 'path';
import { SegmentPlanner } from '../ffmpeg/segment-planner.js';
import { IStorageProvider } from '../storage/storage-provider.interface.js';
import { IFFmpegService, IVideoService, IZipService } from '../types/services.types.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { BaseJob, IJobContext } from './base.job.js';

export interface VideoProcessingJobPayload {
  readonly jobId: string;
}

export class VideoProcessingJob extends BaseJob<VideoProcessingJobPayload, void> {
  readonly name = 'VideoProcessingJob';

  constructor(
    private readonly targetJobId: string,
    private readonly videoService: IVideoService,
    private readonly ffmpegService: IFFmpegService,
    private readonly storageProvider: IStorageProvider,
    private readonly isCancelledCallback?: () => boolean,
    private readonly zipService?: IZipService
  ) {
    super();
    void this.storageProvider;
  }

  public async execute(context?: IJobContext<VideoProcessingJobPayload>): Promise<void> {
    const jobId = context?.payload?.jobId || this.targetJobId;
    logger.info({ jobId, jobName: this.name }, 'Job Workflow: Starting video processing execution');

    // 1. Transition job state to PROCESSING
    await this.videoService.updateJobStatus(jobId, JobStatus.PROCESSING);

    // 2. Query Job metadata
    const jobMetadata = await this.videoService.getJob(jobId);
    if (!jobMetadata) {
      throw new AppError(`Job metadata for '${jobId}' not found`, 404);
    }

    // Check cancellation
    this.checkCancellation(jobId);

    // 3. Locate source video file
    const outputDir = path.resolve('./storage/uploads', jobId);
    const clipsDir = path.join(outputDir, 'clips');
    const sourcePath = path.join(
      outputDir,
      `original_${jobMetadata.originalFileName || 'video.mp4'}`
    );

    logger.info({ jobId, sourcePath }, 'Step 1: Inspecting video file with FFprobe');
    const metadata = await this.ffmpegService.getVideoMetadata(sourcePath);

    // 4. Segment Planning
    this.checkCancellation(jobId);
    logger.info({ jobId }, 'Step 2: Planning segment boundaries');

    let targetSegments: readonly SplitSegmentInput[] = jobMetadata.segments;
    if (!targetSegments || targetSegments.length === 0) {
      const planned = SegmentPlanner.planFixedIntervalSegments(
        metadata.durationSeconds || 300,
        180
      );
      targetSegments = planned.map((p) => ({
        startTimeSeconds: p.startTimeSeconds,
        endTimeSeconds: p.startTimeSeconds + p.durationSeconds,
        title: p.title
      }));
    }

    await this.videoService.updateJobProgress({
      jobId,
      percentage: 25,
      currentStep: 'Segment boundaries planned. Starting FFmpeg lossless extraction.'
    });

    // 5. FFmpeg Lossless Splitting (-c copy)
    this.checkCancellation(jobId);
    logger.info(
      { jobId, segmentCount: targetSegments.length },
      'Step 3: Executing FFmpeg lossless stream copy (-c copy)'
    );

    const clipPaths = await this.ffmpegService.splitVideoLossless(
      sourcePath,
      clipsDir,
      targetSegments
    );

    await this.videoService.updateJobProgress({
      jobId,
      percentage: 75,
      currentStep: 'Clips extracted successfully. Bundling ZIP archive.'
    });

    // 6. ZIP Packaging
    this.checkCancellation(jobId);
    logger.info({ jobId, clipCount: clipPaths.length }, 'Step 4: Bundling clips into ZIP archive');

    if (this.zipService) {
      await this.zipService.createClipsArchive(jobId, clipPaths);
    }

    await this.videoService.updateJobProgress({
      jobId,
      percentage: 100,
      currentStep: 'Video processing complete.'
    });

    // 7. Transition job to COMPLETED & READY
    await this.videoService.updateJobStatus(jobId, JobStatus.COMPLETED);
    await this.videoService.updateJobStatus(jobId, JobStatus.READY);

    logger.info(
      { jobId, clipCount: clipPaths.length },
      'Job Workflow: Video processing completed successfully'
    );
  }

  private checkCancellation(jobId: string): void {
    if (this.isCancelledCallback && this.isCancelledCallback()) {
      logger.info({ jobId }, 'Job Workflow: Cancellation signal detected. Aborting execution.');
      void this.videoService.updateJobStatus(jobId, JobStatus.CANCELLED);
      throw new AppError(`Job execution '${jobId}' was cancelled by user`, 400);
    }
  }
}
