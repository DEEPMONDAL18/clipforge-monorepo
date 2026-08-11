import { ClipInfo, ClipSettings, JobError, JobMetadata, JobProgress } from '@clipforge/shared';
import { ApiClient, ApiError } from './api.client.js';

export class JobService {
  /**
   * Fetches job metadata and status from backend route GET /api/v1/jobs/:id
   */
  public static async getJob(jobId: string): Promise<JobMetadata> {
    return ApiClient.get<JobMetadata>(`/jobs/${jobId}`);
  }

  /**
   * Alias for fetching job metadata from backend GET /api/v1/jobs/:id
   */
  public static async getMetadata(jobId: string): Promise<JobMetadata> {
    return ApiClient.get<JobMetadata>(`/jobs/${jobId}`);
  }

  /**
   * Fetches real-time job processing progress from backend GET /api/v1/jobs/:id/progress
   */
  public static async getProgress(jobId: string): Promise<JobProgress> {
    return ApiClient.get<JobProgress>(`/jobs/${jobId}/progress`);
  }

  /**
   * Fetches generated clip metadata list from backend GET /api/v1/jobs/:id/clips
   */
  public static async getClips(jobId: string): Promise<readonly ClipInfo[]> {
    return ApiClient.get<readonly ClipInfo[]>(`/jobs/${jobId}/clips`);
  }

  /**
   * Service abstraction for job configuration.
   * Note: Segment configuration is passed during upload init (POST /api/v1/upload).
   */
  public static async configureJob(
    _jobId: string,
    _settings: ClipSettings
  ): Promise<{ jobId: string }> {
    return { jobId: _jobId };
  }

  /**
   * Service abstraction for job retry.
   * Note: Backend queue workers handle automatic retries upon failure.
   */
  public static async retryJob(jobId: string): Promise<JobMetadata> {
    return ApiClient.get<JobMetadata>(`/jobs/${jobId}`);
  }

  /**
   * Cancels a queued job via backend route POST /api/v1/jobs/:id/cancel
   */
  public static async cancelJob(jobId: string): Promise<void> {
    await ApiClient.post(`/jobs/${jobId}/cancel`);
  }

  /**
   * Cancels or deletes video job artifacts via backend route DELETE /api/v1/jobs/:id
   */
  public static async deleteJob(jobId: string): Promise<void> {
    await ApiClient.delete(`/jobs/${jobId}`);
  }

  /**
   * Maps transport API failures to user-facing error structures.
   */
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
