import { Queue } from 'bullmq';
import { APP_CONSTANTS } from '../config/constants.js';
import { logger } from '../utils/logger.js';
import { redisConnectionConfig } from './queue.config.js';

export interface VideoProcessingJobData {
  readonly jobId: string;
  readonly priority?: number; // 1 = Urgent/VIP, 2 = Normal, 3 = Low
}

export interface CleanupJobData {
  readonly jobId: string;
}

const isTestEnv = process.env.NODE_ENV === 'test';

export const videoProcessingQueue = isTestEnv
  ? (null as unknown as Queue<VideoProcessingJobData>)
  : new Queue<VideoProcessingJobData>(APP_CONSTANTS.QUEUE_NAMES.VIDEO_PROCESSING, {
      connection: redisConnectionConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    });

export const videoProcessingDLQ = isTestEnv
  ? (null as unknown as Queue<VideoProcessingJobData>)
  : new Queue<VideoProcessingJobData>(`${APP_CONSTANTS.QUEUE_NAMES.VIDEO_PROCESSING}-dlq`, {
      connection: redisConnectionConfig,
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false
      }
    });

export const cleanupQueue = isTestEnv
  ? (null as unknown as Queue<CleanupJobData>)
  : new Queue<CleanupJobData>(APP_CONSTANTS.QUEUE_NAMES.CLEANUP, {
      connection: redisConnectionConfig,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false
      }
    });

if (videoProcessingQueue) {
  videoProcessingQueue.on('error', (err) => {
    logger.error({ err }, 'BullMQ Video Processing Queue connection error');
  });
}

if (videoProcessingDLQ) {
  videoProcessingDLQ.on('error', (err) => {
    logger.error({ err }, 'BullMQ Video Processing DLQ connection error');
  });
}

if (cleanupQueue) {
  cleanupQueue.on('error', (err) => {
    logger.error({ err }, 'BullMQ Cleanup Queue connection error');
  });
}
