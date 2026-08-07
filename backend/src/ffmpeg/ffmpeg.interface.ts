import { SplitSegmentInput } from '@clipforge/shared';

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
