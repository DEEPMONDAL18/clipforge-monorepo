import { cn } from '@/lib/utils';
import type { JobStatus } from '@/types/job';

const STATUS_LABELS: Record<JobStatus, string> = {
  uploading: 'Uploading',
  uploaded: 'Uploaded',
  extracting_metadata: 'Reading metadata',
  awaiting_configuration: 'Ready to configure',
  queued: 'Queued',
  processing: 'Processing',
  packaging: 'Packaging ZIP',
  ready: 'Ready',
  expired: 'Expired',
  failed: 'Failed'
};

const STATUS_TONES: Record<JobStatus, string> = {
  uploading: 'bg-primary/12 text-primary',
  uploaded: 'bg-primary/12 text-primary',
  extracting_metadata: 'bg-primary/12 text-primary',
  awaiting_configuration: 'bg-muted text-muted-foreground',
  queued: 'bg-warning/15 text-warning',
  processing: 'bg-primary/12 text-primary',
  packaging: 'bg-primary/12 text-primary',
  ready: 'bg-success/15 text-success',
  expired: 'bg-muted text-muted-foreground',
  failed: 'bg-destructive/15 text-destructive'
};

const PULSING: JobStatus[] = ['uploading', 'extracting_metadata', 'processing', 'packaging'];

/** Compact pill describing the current job status. */
export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-caption font-medium',
        STATUS_TONES[status]
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full bg-current',
          PULSING.includes(status) && 'animate-pulse'
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

export { STATUS_LABELS };
