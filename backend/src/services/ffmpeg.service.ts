import { SplitSegmentInput } from '@clipforge/shared';
import { IFFmpegService } from '../ffmpeg/ffmpeg.interface.js';
import { FFmpegService as FFmpegWrapper } from '../ffmpeg/ffmpeg.service.js';

export class FFmpegService implements IFFmpegService {
  private readonly ffmpeg: FFmpegWrapper;

  constructor() {
    this.ffmpeg = new FFmpegWrapper();
  }

  public async getVideoMetadata(filePath: string) {
    // TODO: Delegate to underlying FFmpeg/FFprobe binary execution engine
    return this.ffmpeg.getVideoMetadata(filePath);
  }

  public async splitVideoLossless(
    sourcePath: string,
    outputDir: string,
    segments: readonly SplitSegmentInput[]
  ) {
    // TODO: Perform lossless video segment extraction with stream copy (-c copy)
    return this.ffmpeg.splitVideoLossless(sourcePath, outputDir, segments);
  }
}
