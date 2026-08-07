import { ClipInfo } from '@clipforge/shared';
import React from 'react';
import { ClipList } from '../components/clips/ClipList.js';
import { Alert } from '../components/ui/Alert.js';
import { Badge } from '../components/ui/Badge.js';
import { Card } from '../components/ui/Card.js';
import { Progress } from '../components/ui/Progress.js';

export interface JobStatusPageProps {
  jobId?: string;
}

export const JobStatusPage: React.FC<JobStatusPageProps> = ({ jobId = 'job_sample_123' }) => {
  // Placeholder mock state demonstrating completed UI layout
  const mockClips: ClipInfo[] = [
    {
      clipId: 'clip_1',
      jobId,
      title: 'Opening Segment',
      fileName: 'clip_1.mp4',
      durationSeconds: 120,
      sizeBytes: 45000000,
      downloadUrl: `/api/v1/download/${jobId}?clipId=clip_1`,
      createdAt: new Date().toISOString()
    },
    {
      clipId: 'clip_2',
      jobId,
      title: 'Action Sequence',
      fileName: 'clip_2.mp4',
      durationSeconds: 240,
      sizeBytes: 95000000,
      downloadUrl: `/api/v1/download/${jobId}?clipId=clip_2`,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-100">Job {jobId}</h2>
              <Badge variant="success">Ready</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">File: sample_podcast_video.mp4 (1.2 GB)</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
              Expires in 58 mins
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Overall Progress</span>
            <span>100%</span>
          </div>
          <Progress value={100} />
        </div>

        <Alert variant="info">
          All clips have been extracted losslessly. Click individual clip download links or export all as a ZIP file below.
        </Alert>
      </Card>

      <ClipList clips={mockClips} zipDownloadUrl={`/api/v1/download/${jobId}?archive=true`} />
    </div>
  );
};
