import { ClipInfo, ClipSettings, Job, JobError, JobMetadata, JobProgress } from '@clipforge/shared';
import { ApiClient, ApiError } from './api.client.js';

export class JobService {
  public static async getJob(jobId: string): Promise<Job> {
    return ApiClient.get<Job>(`/jobs/${jobId}`);
  }

  public static async getMetadata(jobId: string): Promise<JobMetadata> {
    return ApiClient.get<JobMetadata>(`/jobs/${jobId}/metadata`);
  }

  public static async getProgress(jobId: string): Promise<JobProgress> {
    return ApiClient.get<JobProgress>(`/jobs/${jobId}/progress`);
  }

  public static async getClips(jobId: string): Promise<readonly ClipInfo[]> {
    return ApiClient.get<readonly ClipInfo[]>(`/jobs/${jobId}/clips`);
  }

  public static async configureJob(jobId: string, settings: ClipSettings): Promise<Job> {
    return ApiClient.post<Job, ClipSettings>(`/jobs/${jobId}/configure`, settings);
  }

  public static async retryJob(jobId: string): Promise<Job> {
    return ApiClient.post<Job>(`/jobs/${jobId}/retry`);
  }

  public static async cancelJob(jobId: string): Promise<void> {
    await ApiClient.delete(`/jobs/${jobId}`);
  }

  public static async deleteJob(jobId: string): Promise<void> {
    await ApiClient.delete(`/jobs/${jobId}`);
  }

  public static toJobError(error: unknown): JobError {
    if (error instanceof ApiError && error.code === 'connection_lost') {
      return {
        code: 'connection_lost',
        title: 'Connection lost',
        explanation: 'Could not connect to the processing server.',
        recovery: 'Check your internet connection and try again.',
        retryable: true
      };
    }
    if (error instanceof ApiError && error.status === 404) {
      return {
        code: 'job_expired',
        title: 'Job expired',
        explanation: 'The requested job or clips have expired and been cleaned up.',
        recovery: 'Upload your source video again to generate new clips.',
        retryable: false
      };
    }
    return {
      code: 'processing_failed',
      title: 'Processing error',
      explanation: error instanceof Error ? error.message : 'An unexpected error occurred.',
      recovery: 'Try re-processing the job or uploading a different file.',
      retryable: true
    };
  }
}
