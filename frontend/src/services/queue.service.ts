import { ApiClient } from './api.client.js';

export interface QueueSnapshot {
  position: number | null;
  estimatedWaitSeconds: number | null;
}

export class QueueService {
  public static async getSnapshot(jobId: string): Promise<QueueSnapshot> {
    return ApiClient.get<QueueSnapshot>(`/jobs/${jobId}/queue`);
  }
}
