export class FFmpegCommandBuilder {
  private inputPath = '';
  private outputPath = '';
  private startTime?: number | undefined;
  private duration?: number | undefined;
  private copyStreams = false;
  private customArgs: string[] = [];

  public setInput(inputPath: string): this {
    this.inputPath = inputPath;
    return this;
  }

  public setOutput(outputPath: string): this {
    this.outputPath = outputPath;
    return this;
  }

  public setSeek(startTimeSeconds: number, durationSeconds?: number | undefined): this {
    this.startTime = startTimeSeconds;
    this.duration = durationSeconds;
    return this;
  }

  public setStreamCopy(): this {
    this.copyStreams = true;
    return this;
  }

  public addCustomArg(arg: string, value?: string): this {
    this.customArgs.push(arg);
    if (value !== undefined) {
      this.customArgs.push(value);
    }
    return this;
  }

  public buildArgs(): string[] {
    const args: string[] = ['-y', '-loglevel', 'error'];

    // Fast input seeking before input file for optimal performance
    if (this.startTime !== undefined && this.startTime > 0) {
      args.push('-ss', this.startTime.toString());
    }

    if (!this.inputPath) {
      throw new Error('FFmpegCommandBuilder error: inputPath is required');
    }
    args.push('-i', this.inputPath);

    if (this.duration !== undefined && this.duration > 0) {
      args.push('-t', this.duration.toString());
    }

    if (this.copyStreams) {
      args.push('-c', 'copy', '-avoid_negative_ts', 'make_zero');
    }

    args.push(...this.customArgs);

    if (!this.outputPath) {
      throw new Error('FFmpegCommandBuilder error: outputPath is required');
    }
    args.push(this.outputPath);

    return args;
  }
}
