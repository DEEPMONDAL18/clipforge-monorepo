import {
  ClipInfo,
  InitUploadRequestDTO,
  InitUploadResponseDTO,
  JobMetadata,
  JobProgress,
  JobStatus,
  SplitSegmentInput
} from '@clipforge/shared';

export interface IUploadService {
  initializeUpload(dto: InitUploadRequestDTO): Promise<InitUploadResponseDTO>;
  verifyUploadedFile(jobId: string, filePath: string): Promise<boolean>;
}

export interface IVideoService {
  createJob(dto: InitUploadRequestDTO): Promise<JobMetadata>;
  getJob(jobId: string): Promise<JobMetadata | null>;
  getJobProgress(jobId: string): Promise<JobProgress | null>;
  getJobClips(jobId: string): Promise<readonly ClipInfo[]>;
  cancelOrDeleteJob(jobId: string): Promise<boolean>;
  updateJobStatus(jobId: string, status: JobStatus, error?: string): Promise<void>;
  updateJobProgress(progress: { jobId: string; percentage: number; currentStep?: string }): Promise<void>;
}

export interface IFFmpegService {
  getVideoMetadata(
    filePath: string
  ): Promise<{ durationSeconds: number; format: string; width?: number; height?: number }>;
  splitVideoLossless(
    sourcePath: string,
    outputDir: string,
    segments: readonly SplitSegmentInput[]
  ): Promise<readonly string[]>;
}

export interface IQueueService {
  addVideoProcessingJob(jobId: string, priority?: number): Promise<void>;
  scheduleJobCleanup(jobId: string, delayMs: number): Promise<void>;
  cancelJob(jobId: string): Promise<void>;
}

export interface ICleanupService {
  deleteExpiredFiles(): Promise<number>;
  deleteJobArtifacts(jobId: string): Promise<void>;
}

export interface IZipService {
  createClipsArchive(jobId: string, clipPaths: readonly string[]): Promise<string>;
}

export interface ISupabaseService {
  saveJobRecord(job: JobMetadata): Promise<void>;
  fetchJobRecord(jobId: string): Promise<JobMetadata | null>;
  updateJobRecord(jobId: string, updates: Partial<JobMetadata>): Promise<void>;
  deleteJobRecord(jobId: string): Promise<void>;
}
