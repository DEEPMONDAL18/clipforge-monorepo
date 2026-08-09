import { useEffect, useState } from 'react';
import { TimerReset, TriangleAlert } from 'lucide-react';

import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { EXPIRY_WARNING_SECONDS, RETENTION_SECONDS } from '@/constants/app';
import { formatCountdown, formatTimestamp } from '@/utils/format';

/** Live countdown to automatic deletion of the generated clips. */
export function ExpiryCard({ expiresAt }: { expiresAt: number }) {
  const computeRemaining = () => Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  const [remainingSeconds, setRemainingSeconds] = useState(computeRemaining);

  useEffect(() => {
    setRemainingSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    const interval = setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const hasExpired = remainingSeconds <= 0;
  const isUrgent = remainingSeconds <= EXPIRY_WARNING_SECONDS;
  const percentageLeft = Math.min(100, (remainingSeconds / RETENTION_SECONDS) * 100);

  return (
    <WorkspaceCard
      title="Automatic deletion"
      description={`Files are removed at ${formatTimestamp(expiresAt)}`}
      icon={isUrgent ? TriangleAlert : TimerReset}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span
          className={cn(
            'font-mono text-h1 tabular-nums leading-none',
            isUrgent ? 'text-warning' : 'text-foreground'
          )}
        >
          {hasExpired ? '00:00' : formatCountdown(remainingSeconds)}
        </span>
        <span className="text-small text-muted-foreground">
          {hasExpired ? 'Clips have been deleted' : 'remaining'}
        </span>
      </div>

      <Progress
        value={percentageLeft}
        className={cn('mt-4 h-1.5', isUrgent && 'bg-warning/20')}
        aria-label="Time until clips are deleted"
      />

      <p className="mt-4 text-caption text-subtle-foreground">
        ClipForge stores files for one hour. Download everything you need before the timer reaches
        zero — nothing is kept afterwards.
      </p>
    </WorkspaceCard>
  );
}
