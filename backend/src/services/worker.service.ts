import { JobStatus } from '@clipforge/shared';
import { Job, Worker } from 'bullmq';
import { APP_CONSTANTS } from '../config/constants.js';
import { AppEnv } from '../config/env.js';
import { VideoProcessingJob } from '../jobs/video-processing.job.js';
import { redisConnectionConfig } from '../queue/queue.config.js';
import {
  VideoProcessingJobData,
  cleanupQueue,
  videoProcessingDLQ,
  videoProcessingQueue
} from '../queue/video-queue.js';
import { IStorageProvider } from '../storage/storage-provider.interface.js';
import { IFFmpegService, IVideoService, IZipService } from '../types/services.types.js';
import { logger } from '../utils/logger.js';

export interface QueueMetrics {
  readonly activeWorkerCount: number;
  readonly waitingJobsCount: number;
  readonly activeJobsCount: number;
  readonly completedJobsCount: number;
  readonly failedJobsCount: number;
  readonly delayedJobsCount: number;
  readonly dlqJobsCount: number;
}

export class WorkerService {
  private worker: Worker<VideoProcessingJobData> | null = null;
  private readonly cancelledJobIds = new Set<string>();

  constructor(
    private readonly config: AppEnv,
    private readonly videoService: IVideoService,
    private readonly ffmpegService: IFFmpegService,
    private readonly storageProvider: IStorageProvider,
    private readonly zipService?: IZipService
  ) {}

  public startWorker(): void {
    if (process.env.NODE_ENV === 'test') {
      logger.info('Skipping BullMQ Worker initialization in test environment');
      return;
    }

    if (this.worker) {
      logger.warn('BullMQ Worker is already running');
      return;
    }

    logger.info(
      { concurrency: this.config.WORKER_CONCURRENCY },
      'Starting BullMQ Video Processing Worker'
    );

    this.worker = new Worker<VideoProcessingJobData>(
      APP_CONSTANTS.QUEUE_NAMES.VIDEO_PROCESSING,
      async (bullJob: Job<VideoProcessingJobData>) => {
        const { jobId } = bullJob.data;

        // Check if job was cancelled prior to worker pickup
        if (this.cancelledJobIds.has(jobId)) {
          logger.info({ jobId }, 'Job was cancelled prior to worker pickup. Skipping execution.');
          await this.videoService.updateJobStatus(jobId, JobStatus.CANCELLED);
          this.cancelledJobIds.delete(jobId);
          return;
        }

        // 1. Transition status: QUEUED -> WAITING_FOR_WORKER -> PROCESSING
        await this.videoService.updateJobStatus(jobId, JobStatus.WAITING_FOR_WORKER);
        await this.videoService.updateJobStatus(jobId, JobStatus.PROCESSING);

        logger.info(
          { jobId, attempt: bullJob.attemptsMade + 1, maxAttempts: bullJob.opts.attempts },
          'Worker processing video job'
        );

        // 2. Instantiate and execute VideoProcessingJob
        const videoJob = new VideoProcessingJob(
          jobId,
          this.videoService,
          this.ffmpegService,
          this.storageProvider,
          () => this.cancelledJobIds.has(jobId),
          this.zipService
        );

        await videoJob.execute();

        // 3. Update status on completion
        await this.videoService.updateJobStatus(jobId, JobStatus.COMPLETED);
        await this.videoService.updateJobStatus(jobId, JobStatus.READY);
        logger.info({ jobId }, 'VideoProcessingJob executed successfully');
      },
      {
        connection: redisConnectionConfig,
        concurrency: this.config.WORKER_CONCURRENCY
      }
    );

    // Event Listeners
    this.worker.on('failed', async (job, err) => {
      if (!job) return;
      const { jobId } = job.data;
      const maxRetries = job.opts.attempts || 3;

      logger.error(
        { jobId, attemptsMade: job.attemptsMade, maxRetries, err: err.message },
        'Worker job execution failed'
      );

      // Dead Letter Queue (DLQ) Routing on retry exhaustion
      if (job.attemptsMade >= maxRetries) {
        logger.error(
          { jobId },
          'Job exhausted maximum retries. Routing to Dead Letter Queue (DLQ)'
        );
        await this.videoService.updateJobStatus(jobId, JobStatus.FAILED, err.message);

        if (videoProcessingDLQ) {
          const payload: VideoProcessingJobData =
            job.data.priority !== undefined ? { jobId, priority: job.data.priority } : { jobId };
          await videoProcessingDLQ.add('dlq-failed-job', payload);
        }
      } else {
        logger.warn(
          { jobId, attemptsMade: job.attemptsMade, maxRetries },
          'Job will be retried with exponential backoff'
        );
      }
    });

    this.worker.on('error', (err) => {
      logger.error({ err }, 'BullMQ Worker error occurred');
    });
  }

  public cancelJob(jobId: string): void {
    this.cancelledJobIds.add(jobId);
    logger.info({ jobId }, 'Registered job cancellation token');
  }

  public isJobCancelled(jobId: string): boolean {
    return this.cancelledJobIds.has(jobId);
  }

  public async getQueueMetrics(): Promise<QueueMetrics> {
    if (process.env.NODE_ENV === 'test' || !videoProcessingQueue) {
      return {
        activeWorkerCount: 0,
        waitingJobsCount: 0,
        activeJobsCount: 0,
        completedJobsCount: 0,
        failedJobsCount: 0,
        delayedJobsCount: 0,
        dlqJobsCount: 0
      };
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      videoProcessingQueue.getWaitingCount(),
      videoProcessingQueue.getActiveCount(),
      videoProcessingQueue.getCompletedCount(),
      videoProcessingQueue.getFailedCount(),
      videoProcessingQueue.getDelayedCount()
    ]);

    const dlqCounts = videoProcessingDLQ
      ? await videoProcessingDLQ.getJobCounts('completed', 'failed', 'waiting')
      : null;
    const dlqCount = dlqCounts
      ? Object.values(dlqCounts).reduce((total, count) => total + count, 0)
      : 0;

    return {
      activeWorkerCount: this.worker ? this.config.WORKER_CONCURRENCY : 0,
      waitingJobsCount: waiting,
      activeJobsCount: active,
      completedJobsCount: completed,
      failedJobsCount: failed,
      delayedJobsCount: delayed,
      dlqJobsCount: dlqCount
    };
  }

  public async shutdown(): Promise<void> {
    logger.info('Initiating graceful shutdown of WorkerService...');
    if (this.worker) {
      await this.worker.close();
      this.worker = null;
      logger.info('BullMQ Worker shutdown complete');
    }

    if (videoProcessingQueue) {
      await videoProcessingQueue.close();
    }
    if (videoProcessingDLQ) {
      await videoProcessingDLQ.close();
    }
    if (cleanupQueue) {
      await cleanupQueue.close();
    }
  }
}
