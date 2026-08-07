import { JobStatus } from '../enums/job-status.js';
import { SplitSegmentInput } from '../types/clip.types.js';

export interface InitUploadRequestDTO {
  readonly fileName: string;
  readonly fileSizeBytes: number;
  readonly mimeType: string;
  readonly segments: readonly SplitSegmentInput[];
  readonly chunkSizeBytes?: number;
}

export interface InitUploadResponseDTO {
  readonly jobId: string;
  readonly uploadUrl: string;
  readonly chunkSizeBytes: number;
  readonly totalChunksCount: number;
  readonly expiresAt: string;
}

export interface UploadChunkResponseDTO {
  readonly jobId: string;
  readonly chunkIndex: number;
  readonly totalChunksCount: number;
  readonly uploadedChunksCount: number;
  readonly bytesReceived: number;
  readonly isComplete: boolean;
  readonly status?: JobStatus;
  readonly durationSeconds?: number;
  readonly format?: string;
  readonly width?: number | undefined;
  readonly height?: number | undefined;
}

export interface UploadStatusResponseDTO {
  readonly jobId: string;
  readonly status: JobStatus;
  readonly fileSizeBytes: number;
  readonly chunkSizeBytes: number;
  readonly totalChunksCount: number;
  readonly uploadedChunkIndices: readonly number[];
  readonly missingChunkIndices: readonly number[];
  readonly bytesReceived: number;
  readonly expiresAt: string;
}
