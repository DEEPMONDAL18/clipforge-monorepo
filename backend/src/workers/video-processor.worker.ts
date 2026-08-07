import { Job as BullJob, Worker } from 'bullmq';
import { APP_CONSTANTS } from '../config/constants.js';
import { VideoProcessingJob } from '../jobs/video-processing.job.js';
import { redisConnectionConfig } from '../queue/queue.config.js';
import { VideoProcessingJobData } from '../queue/video-queue.js';
import { logger } from '../utils/logger.js';

export function createVideoProcessorWorker(processingJob?: VideoProcessingJob): Worker<VideoProcessingJobData> {
  const worker = new Worker<VideoProcessingJobData>(
    APP_CONSTANTS.QUEUE_NAMES.VIDEO_PROCESSING,
    async (bullJob: BullJob<VideoProcessingJobData>) => {
      logger.info({ jobId: bullJob.data.jobId }, 'BullMQ Worker received job event');

      if (processingJob) {
        // Delegate execution to Job orchestrator class
        await processingJob.execute({
          jobId: bullJob.data.jobId,
          payload: { jobId: bullJob.data.jobId }
        });
      }
    },
    {
      connection: redisConnectionConfig,
      concurrency: 2
    }
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.data.jobId }, 'Video processing worker task completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.data.jobId, err }, 'Video processing worker task failed');
  });

  return worker;
}
