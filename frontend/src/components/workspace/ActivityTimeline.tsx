import { AnimatePresence, motion } from 'motion/react';
import { History } from 'lucide-react';

import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import { formatTimestamp } from '@/utils/format';
import type { ActivityEvent, ActivityLevel } from '@/types/job';

const LEVEL_TONES: Record<ActivityLevel, string> = {
  info: 'bg-muted-foreground',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive'
};

/** Chronological log of everything the pipeline has reported. */
export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  const ordered = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <WorkspaceCard
      title="Activity"
      description="Every event reported by the pipeline"
      icon={History}
    >
      {ordered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity yet"
          description="Events appear here as your video moves through the pipeline."
        />
      ) : (
        <ol className="relative space-y-4 pl-5">
          <span aria-hidden="true" className="absolute left-1 top-1 h-full w-px bg-border" />
          <AnimatePresence initial={false}>
            {ordered.map((event) => (
              <motion.li
                key={event.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative flex items-start justify-between gap-4"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -left-[1.125rem] top-1.5 size-2 rounded-full ring-4 ring-card',
                    LEVEL_TONES[event.level]
                  )}
                />
                <p className="text-small text-foreground">{event.message}</p>
                <time
                  dateTime={new Date(event.timestamp).toISOString()}
                  className="shrink-0 font-mono text-caption tabular-nums text-subtle-foreground"
                >
                  {formatTimestamp(event.timestamp)}
                </time>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </WorkspaceCard>
  );
}
