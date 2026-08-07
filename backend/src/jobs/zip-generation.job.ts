import { JobStatus } from '@clipforge/shared';
import { IVideoService, IZipService } from '../types/services.types.js';
import { logger } from '../utils/logger.js';
import { BaseJob, IJobContext } from './base.job.js';

export interface ZipGenerationJobPayload {
  readonly jobId: string;
  readonly clipPaths: readonly string[];
}

export class ZipGenerationJob extends BaseJob<ZipGenerationJobPayload, string> {
  readonly name = 'ZipGenerationJob';

  constructor(
    private readonly zipService: IZipService,
    private readonly videoService: IVideoService
  ) {
    super();
  }

  public async execute(context: IJobContext<ZipGenerationJobPayload>): Promise<string> {
    const { jobId, clipPaths } = context.payload;
    logger.info({ jobId, clipCount: clipPaths.length, jobName: this.name }, 'Job Workflow: Starting ZIP generation');

    await this.videoService.updateJobStatus(jobId, JobStatus.GENERATING_ZIP);
    const zipPath = await this.zipService.createClipsArchive(jobId, clipPaths);
    await this.videoService.updateJobStatus(jobId, JobStatus.READY);

    return zipPath;
  }
}
