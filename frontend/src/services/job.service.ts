import { ClipInfo, JobMetadata, JobProgress } from '@clipforge/shared';
import { ApiClient } from './api.client.js';

export class JobService {
  public static async getJob(jobId: string): Promise<JobMetadata> {
    return ApiClient.get<JobMetadata>(`/jobs/${jobId}`);
  }

  public static async getProgress(jobId: string): Promise<JobProgress> {
    return ApiClient.get<JobProgress>(`/jobs/${jobId}/progress`);
  }

  public static async getClips(jobId: string): Promise<readonly ClipInfo[]> {
    return ApiClient.get<readonly ClipInfo[]>(`/jobs/${jobId}/clips`);
  }

  public static async deleteJob(jobId: string): Promise<void> {
    await ApiClient.delete(`/jobs/${jobId}`);
  }
}
