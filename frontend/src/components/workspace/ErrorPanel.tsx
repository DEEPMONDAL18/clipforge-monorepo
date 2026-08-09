import { RefreshCw, RotateCcw, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import type { JobError } from '@/types/job';

interface ErrorPanelProps {
  error: JobError;
  isRetrying: boolean;
  onRetry: () => void;
  onStartOver: () => void;
}

/** Human error state: what happened, why, and how to recover. */
export function ErrorPanel({ error, isRetrying, onRetry, onStartOver }: ErrorPanelProps) {
  return (
    <WorkspaceCard title={error.title} description={error.explanation} icon={TriangleAlert}>
      <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/8 p-4">
        <p className="text-small text-foreground">{error.recovery}</p>
        <p className="mt-2 font-mono text-caption uppercase tracking-wide text-subtle-foreground">
          {error.code}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {error.retryable ? (
          <Button className="min-h-11 rounded-lg" onClick={onRetry} disabled={isRetrying}>
            <RefreshCw className="size-4" />
            {isRetrying ? 'Retrying…' : 'Try again'}
          </Button>
        ) : null}
        <Button variant="secondary" className="min-h-11 rounded-lg" onClick={onStartOver}>
          <RotateCcw className="size-4" />
          Start over
        </Button>
      </div>
    </WorkspaceCard>
  );
}
