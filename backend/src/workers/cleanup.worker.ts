import { Job as BullJob, Worker } from 'bullmq';
import { APP_CONSTANTS } from '../config/constants.js';
import { CleanupJob } from '../jobs/cleanup.job.js';
import { redisConnectionConfig } from '../queue/queue.config.js';
import { logger } from '../utils/logger.js';

export interface CleanupJobData {
  readonly jobId?: string;
  readonly cleanupAllExpired?: boolean;
}

export function createCleanupWorker(cleanupJob?: CleanupJob): Worker<CleanupJobData> {
  const worker = new Worker<CleanupJobData>(
    APP_CONSTANTS.QUEUE_NAMES.CLEANUP,
    async (bullJob: BullJob<CleanupJobData>) => {
      logger.info({ data: bullJob.data }, 'BullMQ Cleanup Worker received job event');

      if (cleanupJob) {
        // Delegate execution to CleanupJob orchestrator class
        await cleanupJob.execute({
          jobId: bullJob.data.jobId || 'cleanup_job',
          payload: {
            jobId: bullJob.data.jobId,
            purgeAllExpired: bullJob.data.cleanupAllExpired
          }
        });
      }
    },
    {
      connection: redisConnectionConfig
    }
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.data.jobId }, 'Cleanup worker task executed');
  });

  return worker;
}
