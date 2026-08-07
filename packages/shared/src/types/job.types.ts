import { JobStatus } from '../enums/job-status.js';
import { ClipInfo, SplitSegmentInput } from './clip.types.js';

export interface JobMetadata {
  readonly jobId: string;
  readonly originalFileName: string;
  readonly originalFileSizeBytes: number;
  readonly mimeType: string;
  readonly durationSeconds: number;
  readonly status: JobStatus;
  readonly progressPercentage: number;
  readonly segments: readonly SplitSegmentInput[];
  readonly clips: readonly ClipInfo[];
  readonly zipDownloadUrl?: string;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly errorMessage?: string;
}

export interface JobProgress {
  readonly jobId: string;
  readonly status: JobStatus;
  readonly progressPercentage: number;
  readonly processedClipsCount: number;
  readonly totalClipsCount: number;
  readonly currentAction: string;
}
