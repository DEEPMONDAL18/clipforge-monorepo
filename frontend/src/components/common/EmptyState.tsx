import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Neutral empty state that always points at the next logical action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="flex size-10 items-center justify-center rounded-lg border bg-muted text-muted-foreground"
      >
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-small font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-small text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6 min-h-11" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
