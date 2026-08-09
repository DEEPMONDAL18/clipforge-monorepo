import React from 'react';

import { Workspace } from '@/components/workspace/Workspace';
import type { Job } from '@/types/job';

export interface JobStatusPageProps {
  jobId?: string;
}

export const JobStatusPage: React.FC<JobStatusPageProps> = ({ jobId = 'job_sample_123' }) => {
  const mockJob: Job = {
    id: jobId,
    status: 'ready',
    stage: 'ready',
    createdAt: Date.now() - 120000,
    metadata: {
      filename: 'sample_podcast_video.mp4',
      sizeBytes: 1200000000,
      durationSeconds: 360,
      width: 1920,
      height: 1080,
      codec: 'h264',
      audioCodec: 'aac',
      frameRate: 30
    },
    settings: {
      clipLengthSeconds: 180
    },
    upload: null,
    progressPercentage: 100,
    currentClip: 2,
    totalClips: 2,
    elapsedSeconds: 45,
    estimatedRemainingSeconds: 0,
    queuePosition: null,
    estimatedWaitSeconds: null,
    clips: [
      {
        id: 'clip_1',
        index: 1,
        filename: `${jobId}_clip_001.mp4`,
        durationSeconds: 180,
        sizeBytes: 600000000,
        width: 1920,
        height: 1080,
        downloadUrl: `/api/v1/download/${jobId}?clipId=clip_1`
      },
      {
        id: 'clip_2',
        index: 2,
        filename: `${jobId}_clip_002.mp4`,
        durationSeconds: 180,
        sizeBytes: 600000000,
        width: 1920,
        height: 1080,
        downloadUrl: `/api/v1/download/${jobId}?clipId=clip_2`
      }
    ],
    archive: {
      filename: `${jobId}_clips.zip`,
      sizeBytes: 1200000000,
      downloadUrl: `/api/v1/download/${jobId}?archive=true`
    },
    expiresAt: Date.now() + 3480000,
    activity: [
      {
        id: 'act_1',
        timestamp: Date.now() - 120000,
        message: 'Upload completed',
        level: 'info'
      },
      {
        id: 'act_2',
        timestamp: Date.now() - 90000,
        message: 'Metadata extracted successfully',
        level: 'info'
      },
      {
        id: 'act_3',
        timestamp: Date.now() - 45000,
        message: 'Processing 2 clips without re-encoding',
        level: 'info'
      },
      {
        id: 'act_4',
        timestamp: Date.now(),
        message: 'Packaging completed — ZIP archive ready',
        level: 'success'
      }
    ],
    error: null
  };

  return (
    <div className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Workspace initialJob={mockJob} initialPhase="ready" />
    </div>
  );
};
