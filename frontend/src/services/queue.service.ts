import { ApiClient } from './api.client.js';

export interface QueueSnapshot {
  position: number | null;
  estimatedWaitSeconds: number | null;
}

export interface QueueMetrics {
  waitingJobsCount: number;
  activeJobsCount: number;
  completedJobsCount: number;
  failedJobsCount: number;
}

export class QueueService {
  /**
   * Fetches overall worker queue metrics from backend route GET /api/v1/queue/stats
   */
  public static async getQueueStats(): Promise<QueueMetrics> {
    return ApiClient.get<QueueMetrics>('/queue/stats');
  }

  /**
   * Fetches queue snapshot for a specific job.
   */
  public static async getSnapshot(_jobId: string): Promise<QueueSnapshot> {
    try {
      const stats = await this.getQueueStats();
      return {
        position: stats.waitingJobsCount > 0 ? stats.waitingJobsCount : 1,
        estimatedWaitSeconds: stats.waitingJobsCount * 15
      };
    } catch {
      return {
        position: null,
        estimatedWaitSeconds: null
      };
    }
  }
}
