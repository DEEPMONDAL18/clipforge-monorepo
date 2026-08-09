import { Clock } from 'lucide-react';

import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { formatCountdown } from '@/utils/format';
import type { Job } from '@/types/job';

/** Explains why a job is waiting, with position and estimated wait. */
export function QueueCard({ job }: { job: Job }) {
  return (
    <WorkspaceCard
      title="Waiting in queue"
      description="Your video keeps its place even if you refresh this page."
      icon={Clock}
      emphasis
    >
      <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
        <div>
          <p className="text-caption uppercase tracking-wide text-subtle-foreground">
            Position in queue
          </p>
          <p className="mt-1 font-mono text-hero tabular-nums leading-none">
            {job.queuePosition ?? 1}
          </p>
        </div>
        <div>
          <p className="text-caption uppercase tracking-wide text-subtle-foreground">
            Estimated wait
          </p>
          <p className="mt-1 font-mono text-h2 tabular-nums">
            {formatCountdown(job.estimatedWaitSeconds ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-caption uppercase tracking-wide text-subtle-foreground">
            Clips planned
          </p>
          <p className="mt-1 font-mono text-h2 tabular-nums">{job.totalClips}</p>
        </div>
      </div>
    </WorkspaceCard>
  );
}
