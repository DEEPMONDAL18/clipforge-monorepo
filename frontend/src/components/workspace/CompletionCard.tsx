import { CircleCheck, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { formatBytes, formatCountdown } from '@/utils/format';
import type { Job } from '@/types/job';

interface CompletionCardProps {
  job: Job;
  onStartNew: () => void;
}

/** Confirmation shown the moment a job becomes downloadable. */
export function CompletionCard({ job, onStartNew }: CompletionCardProps) {
  const totalBytes = job.clips.reduce((sum, clip) => sum + clip.sizeBytes, 0);

  return (
    <WorkspaceCard
      title="Processing complete"
      description={job.metadata?.filename ?? 'Your video is ready'}
      icon={CircleCheck}
      emphasis
      action={
        <Button variant="secondary" className="min-h-11 rounded-lg" onClick={onStartNew}>
          <RotateCcw className="size-4" />
          New video
        </Button>
      }
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">
            Clips created
          </dt>
          <dd className="mt-1 font-mono text-h2 tabular-nums">{job.clips.length}</dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">
            Total size
          </dt>
          <dd className="mt-1 font-mono text-h2 tabular-nums">{formatBytes(totalBytes)}</dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">
            Processing time
          </dt>
          <dd className="mt-1 font-mono text-h2 tabular-nums">
            {formatCountdown(job.elapsedSeconds)}
          </dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-subtle-foreground">Quality</dt>
          <dd className="mt-1 text-small font-medium">Original, no re-encoding</dd>
        </div>
      </dl>
    </WorkspaceCard>
  );
}
