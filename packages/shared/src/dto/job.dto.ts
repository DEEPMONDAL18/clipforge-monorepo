import { JobStatus } from '../enums/job-status.js';

export interface UpdateJobStatusDTO {
  readonly jobId: string;
  readonly status: JobStatus;
  readonly progressPercentage?: number;
  readonly errorMessage?: string;
}

export interface DownloadArtifactQueryDTO {
  readonly clipId?: string;
  readonly archive?: boolean;
}
