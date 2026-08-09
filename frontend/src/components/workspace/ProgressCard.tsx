import { Activity } from 'lucide-react';

import { Progress } from '@/components/ui/Progress';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PIPELINE_STAGES } from '@/constants/app';
import { formatCountdown, formatPercentage } from '@/utils/format';
import type { Job } from '@/types/job';

interface ProgressCardProps {
  job: Job;
}

function stageLabel(job: Job): string {
  return PIPELINE_STAGES.find((stage) => stage.id === job.stage)?.description ?? 'Working';
}

/** Dominant processing panel: percentage, stage, clip counter and ETA. */
export function ProgressCard({ job }: ProgressCardProps) {
  return (
    <WorkspaceCard
      title="Processing video"
      description={job.metadata?.filename ?? 'Source video'}
      icon={Activity}
      emphasis
      action={<StatusBadge status={job.status} />}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-hero tabular-nums leading-none">
          {formatPercentage(job.progressPercentage)}
        </span>
        <span className="max-w-[16rem] text-right text-small text-muted-foreground">
          {stageLabel(job)}
        </span>
      </div>

      <Progress
        value={job.progressPercentage}
        className="mt-6 h-2"
        aria-label="Processing progress"
      />

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">
            Clips generated
          </dt>
          <dd className="mt-1 font-mono text-small tabular-nums">
            {job.currentClip} / {job.totalClips}
          </dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">Elapsed</dt>
          <dd className="mt-1 font-mono text-small tabular-nums">
            {formatCountdown(job.elapsedSeconds)}
          </dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">
            Time remaining
          </dt>
          <dd className="mt-1 font-mono text-small tabular-nums">
            {job.estimatedRemainingSeconds > 0
              ? formatCountdown(job.estimatedRemainingSeconds)
              : 'Almost done'}
          </dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">Job ID</dt>
          <dd className="mt-1 truncate font-mono text-small" title={job.id}>
            {job.id}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-caption text-subtle-foreground">
        Progress updates automatically. Processing continues on the server even if this tab loses
        focus.
      </p>
    </WorkspaceCard>
  );
}
