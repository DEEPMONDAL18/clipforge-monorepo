/**
 * Domain types shared across the ClipForge frontend.
 * These mirror the contracts exposed by the existing backend.
 */

export type JobStage = 'upload' | 'metadata' | 'queue' | 'processing' | 'zip' | 'ready';

export type JobStatus =
  | 'uploading'
  | 'uploaded'
  | 'extracting_metadata'
  | 'awaiting_configuration'
  | 'queued'
  | 'processing'
  | 'packaging'
  | 'ready'
  | 'expired'
  | 'failed';

export type StageState = 'complete' | 'active' | 'pending';

export interface VideoMetadata {
  filename: string;
  sizeBytes: number;
  durationSeconds: number;
  width: number;
  height: number;
  codec: string;
  audioCodec: string;
  frameRate: number;
}

export interface ClipSettings {
  clipLengthSeconds: number;
}

export interface ClipArtifact {
  id: string;
  index: number;
  filename: string;
  durationSeconds: number;
  sizeBytes: number;
  width: number;
  height: number;
  downloadUrl: string;
}

export interface ArchiveArtifact {
  filename: string;
  sizeBytes: number;
  downloadUrl: string;
}

export type ActivityLevel = 'info' | 'success' | 'warning' | 'error';

export interface ActivityEvent {
  id: string;
  timestamp: number;
  message: string;
  level: ActivityLevel;
}

export type JobErrorCode =
  | 'unsupported_format'
  | 'file_too_large'
  | 'upload_failed'
  | 'processing_failed'
  | 'connection_lost'
  | 'job_expired';

export interface JobError {
  code: JobErrorCode;
  title: string;
  explanation: string;
  recovery: string;
  retryable: boolean;
}

export interface UploadProgress {
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  bytesPerSecond: number;
  etaSeconds: number;
}

export interface Job {
  id: string;
  status: JobStatus;
  stage: JobStage;
  createdAt: number;
  metadata: VideoMetadata | null;
  settings: ClipSettings | null;
  upload: UploadProgress | null;
  progressPercentage: number;
  currentClip: number;
  totalClips: number;
  elapsedSeconds: number;
  estimatedRemainingSeconds: number;
  queuePosition: number | null;
  estimatedWaitSeconds: number | null;
  clips: ClipArtifact[];
  archive: ArchiveArtifact | null;
  expiresAt: number | null;
  activity: ActivityEvent[];
  error: JobError | null;
}

export type WorkspacePhase =
  | 'idle'
  | 'uploading'
  | 'metadata'
  | 'queued'
  | 'processing'
  | 'ready'
  | 'expired'
  | 'failed';
