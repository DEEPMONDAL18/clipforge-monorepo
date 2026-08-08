import { cn } from '@/lib/utils';

/** Geometric wordmark: a film frame being divided into clips. */
export function ClipForgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('text-primary', className)}
    >
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9 4.75v14.5M15 4.75v14.5" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      <path d="M2.75 12h18.5" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
    </svg>
  );
}
