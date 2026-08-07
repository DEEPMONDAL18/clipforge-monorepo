import {
  ClipInfo,
  InitUploadRequestDTO,
  JobMetadata,
  JobProgress,
  JobStatus
} from '@clipforge/shared';
import { IVideoService } from '../types/services.types.js';

export class VideoService implements IVideoService {
  private readonly mockJobs = new Map<string, JobMetadata>();

  public async createJob(dto: InitUploadRequestDTO): Promise<JobMetadata> {
    const jobId = `job_${Date.now()}`;
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    const mockJob: JobMetadata = {
      jobId,
      originalFileName: dto.fileName,
      originalFileSizeBytes: dto.fileSizeBytes,
      mimeType: dto.mimeType,
      durationSeconds: 300,
      status: JobStatus.UPLOADING,
      progressPercentage: 0,
      segments: dto.segments,
      clips: [],
      expiresAt,
      createdAt: now,
      updatedAt: now
    };

    this.mockJobs.set(jobId, mockJob);
    return mockJob;
  }

  public async getJob(jobId: string): Promise<JobMetadata | null> {
    if (this.mockJobs.has(jobId)) {
      return this.mockJobs.get(jobId) || null;
    }

    // Default mock response for un-tracked jobId route queries
    const now = new Date().toISOString();
    return {
      jobId,
      originalFileName: 'sample_video.mp4',
      originalFileSizeBytes: 104857600,
      mimeType: 'video/mp4',
      durationSeconds: 180,
      status: JobStatus.READY,
      progressPercentage: 100,
      segments: [
        { startTimeSeconds: 0, endTimeSeconds: 60, title: 'Intro Clip' },
        { startTimeSeconds: 60, endTimeSeconds: 180, title: 'Main Highlights' }
      ],
      clips: [
        {
          clipId: `clip_${jobId}_1`,
          jobId,
          title: 'Intro Clip',
          fileName: 'clip_1.mp4',
          durationSeconds: 60,
          sizeBytes: 35000000,
          downloadUrl: `/api/v1/download/${jobId}?clipId=clip_${jobId}_1`,
          createdAt: now
        },
        {
          clipId: `clip_${jobId}_2`,
          jobId,
          title: 'Main Highlights',
          fileName: 'clip_2.mp4',
          durationSeconds: 120,
          sizeBytes: 68000000,
          downloadUrl: `/api/v1/download/${jobId}?clipId=clip_${jobId}_2`,
          createdAt: now
        }
      ],
      zipDownloadUrl: `/api/v1/download/${jobId}?archive=true`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now
    };
  }

  public async getJobProgress(jobId: string): Promise<JobProgress | null> {
    const job = await this.getJob(jobId);
    if (!job) return null;

    return {
      jobId,
      status: job.status,
      progressPercentage: job.progressPercentage || 0,
      processedClipsCount: 1,
      totalClipsCount: job.segments.length || 1,
      currentAction: `Processing status: ${job.status}`
    };
  }

  public async getJobClips(jobId: string): Promise<readonly ClipInfo[]> {
    const job = await this.getJob(jobId);
    return job?.clips || [];
  }

  public async cancelOrDeleteJob(jobId: string): Promise<boolean> {
    await this.updateJobStatus(jobId, JobStatus.CANCELLED);
    return true;
  }

  public async updateJobStatus(
    jobId: string,
    status: JobStatus,
    error?: string
  ): Promise<void> {
    const existing = this.mockJobs.get(jobId);
    const now = new Date().toISOString();

    if (existing) {
      this.mockJobs.set(jobId, {
        ...existing,
        status,
        ...(error ? { errorMessage: error } : {}),
        updatedAt: now
      });
    } else {
      this.mockJobs.set(jobId, {
        jobId,
        originalFileName: 'video.mp4',
        originalFileSizeBytes: 1024,
        mimeType: 'video/mp4',
        durationSeconds: 60,
        status,
        progressPercentage: 0,
        segments: [],
        clips: [],
        ...(error ? { errorMessage: error } : {}),
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        createdAt: now,
        updatedAt: now
      });
    }
  }

  public async updateJobProgress(progress: {
    jobId: string;
    percentage: number;
    currentStep?: string;
  }): Promise<void> {
    const existing = this.mockJobs.get(progress.jobId);
    if (existing) {
      this.mockJobs.set(progress.jobId, {
        ...existing,
        progressPercentage: progress.percentage,
        updatedAt: new Date().toISOString()
      });
    }
  }
}
