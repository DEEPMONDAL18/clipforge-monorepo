import { Info } from 'lucide-react';

import { StatGrid, StatItem } from '@/components/common/StatItem';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import {
  formatClipLength,
  formatDuration,
  formatResolution,
  formatTimestamp
} from '@/utils/format';
import type { Job } from '@/types/job';

/** Static technical summary of the job, useful for support requests. */
export function JobDetailsCard({ job }: { job: Job }) {
  return (
    <WorkspaceCard title="Job details" description="Technical summary of this run" icon={Info}>
      <StatGrid>
        <StatItem label="Job ID" value={job.id} mono />
        <StatItem label="Started" value={formatTimestamp(job.createdAt)} mono />
        <StatItem
          label="Clip length"
          value={job.settings ? formatClipLength(job.settings.clipLengthSeconds) : '—'}
        />
        <StatItem label="Clips" value={`${job.clips.length}`} mono />
        <StatItem
          label="Source duration"
          value={job.metadata ? formatDuration(job.metadata.durationSeconds) : '—'}
          mono
        />
        <StatItem
          label="Resolution"
          value={job.metadata ? formatResolution(job.metadata.width, job.metadata.height) : '—'}
          mono
        />
        <StatItem label="Codec" value={job.metadata?.codec ?? '—'} />
        <StatItem label="Processing time" value={formatDuration(job.elapsedSeconds)} mono />
      </StatGrid>
    </WorkspaceCard>
  );
}
