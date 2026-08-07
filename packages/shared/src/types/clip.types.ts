export interface ClipInfo {
  readonly clipId: string;
  readonly jobId: string;
  readonly title: string;
  readonly fileName: string;
  readonly durationSeconds: number;
  readonly sizeBytes: number;
  readonly downloadUrl: string;
  readonly createdAt: string;
}

export interface SplitSegmentInput {
  readonly startTimeSeconds: number;
  readonly endTimeSeconds: number;
  readonly title?: string;
}
