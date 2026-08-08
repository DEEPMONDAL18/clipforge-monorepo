import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface WorkspaceCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  emphasis?: boolean;
}

/** Shared card shell used by every workspace panel. */
export function WorkspaceCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  emphasis = false
}: WorkspaceCardProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow-card transition-colors duration-150',
        emphasis ? 'border-primary/40' : 'hover:border-border-strong',
        className
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-start gap-3">
          {Icon ? (
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
            >
              <Icon className="size-4" />
            </span>
          ) : null}
          <div>
            <h2 className="text-small font-semibold tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-1 text-caption text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}
