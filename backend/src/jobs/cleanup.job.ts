import { JobStatus } from '@clipforge/shared';
import { ICleanupService, IVideoService } from '../types/services.types.js';
import { logger } from '../utils/logger.js';
import { BaseJob, IJobContext } from './base.job.js';

export interface CleanupJobPayload {
  readonly jobId?: string | undefined;
  readonly purgeAllExpired?: boolean | undefined;
}

export class CleanupJob extends BaseJob<CleanupJobPayload, void> {
  readonly name = 'CleanupJob';

  constructor(
    private readonly cleanupService: ICleanupService,
    private readonly videoService: IVideoService
  ) {
    super();
  }

  public async execute(context: IJobContext<CleanupJobPayload>): Promise<void> {
    const { jobId, purgeAllExpired } = context.payload;
    logger.info(
      { jobId, purgeAllExpired, jobName: this.name },
      'Job Workflow: Starting cleanup execution'
    );

    if (jobId) {
      await this.cleanupService.deleteJobArtifacts(jobId);
      await this.videoService.updateJobStatus(jobId, JobStatus.DELETED);
    } else if (purgeAllExpired) {
      const deletedCount = await this.cleanupService.deleteExpiredFiles();
      logger.info({ deletedCount }, 'Job Workflow: Purged expired files');
    }
  }
}
