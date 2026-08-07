import { JobStatus } from '@clipforge/shared';
import { cleanupQueue, videoProcessingQueue } from '../queue/video-queue.js';
import { IQueueService, IVideoService } from '../types/services.types.js';
import { logger } from '../utils/logger.js';
import { WorkerService } from './worker.service.js';

export class QueueService implements IQueueService {
  constructor(
    private readonly workerService?: WorkerService,
    private readonly videoService?: IVideoService
  ) {}

  public async addVideoProcessingJob(jobId: string, priority = 2): Promise<void> {
    logger.info({ jobId, priority }, 'Enqueueing job into BullMQ video processing queue');

    if (videoProcessingQueue) {
      await videoProcessingQueue.add(
        'process-video',
        { jobId, priority },
        {
          priority,
          jobId // Ensure unique job ID in BullMQ
        }
      );
    }
  }

  public async scheduleJobCleanup(jobId: string, delayMs: number): Promise<void> {
    logger.info({ jobId, delayMs }, 'Scheduling 1-hour job auto-cleanup');

    if (cleanupQueue) {
      await cleanupQueue.add(
        'cleanup-job',
        { jobId },
        {
          delay: delayMs,
          jobId: `cleanup_${jobId}`
        }
      );
    }
  }

  public async cancelJob(jobId: string): Promise<void> {
    logger.info({ jobId }, 'Cancelling job execution');

    // 1. Set cancellation token in WorkerService
    if (this.workerService) {
      this.workerService.cancelJob(jobId);
    }

    // 2. Remove job from BullMQ queue if waiting
    if (videoProcessingQueue) {
      const bullJob = await videoProcessingQueue.getJob(jobId);
      if (bullJob) {
        await bullJob.remove();
        logger.info({ jobId }, 'Removed queued job from BullMQ videoProcessingQueue');
      }
    }

    // 3. Update status to CANCELLED in VideoService
    if (this.videoService) {
      await this.videoService.updateJobStatus(jobId, JobStatus.CANCELLED);
    }
  }
}
