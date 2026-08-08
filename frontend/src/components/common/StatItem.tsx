import * as React from 'react';

import { cn } from '@/lib/utils';

interface StatItemProps {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}

/** Read-only label/value pair used across metadata and job detail panels. */
export function StatItem({ label, value, mono = false, className }: StatItemProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-caption uppercase tracking-wide text-subtle-foreground">{label}</dt>
      <dd
        className={cn(
          'mt-1 truncate text-small font-medium text-foreground',
          mono && 'font-mono tabular-nums'
        )}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">{children}</dl>
  );
}
