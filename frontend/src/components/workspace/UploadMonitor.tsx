import { X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { StatGrid, StatItem } from '@/components/common/StatItem';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { formatBitrate, formatBytes, formatCountdown, formatPercentage } from '@/utils/format';
import type { UploadProgress } from '@/types/job';

interface UploadMonitorProps {
  filename: string;
  progress: UploadProgress;
  onCancel: () => void;
}

/** The upload card transformed into a live transfer monitor. */
export function UploadMonitor({ filename, progress, onCancel }: UploadMonitorProps) {
  return (
    <WorkspaceCard
      title="Uploading video"
      description={filename}
      emphasis
      action={
        <Button variant="ghost" size="sm" className="min-h-11 gap-2" onClick={onCancel}>
          <X className="size-4" />
          Cancel
        </Button>
      }
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-h2 tabular-nums">
          {formatPercentage(progress.percentage)}
        </span>
        <span className="text-small text-muted-foreground">
          {formatBytes(progress.uploadedBytes)} of {formatBytes(progress.totalBytes)}
        </span>
      </div>

      <Progress value={progress.percentage} className="mt-4 h-2" aria-label="Upload progress" />

      <div className="mt-6">
        <StatGrid>
          <StatItem label="File size" value={formatBytes(progress.totalBytes)} mono />
          <StatItem label="Uploaded" value={formatBytes(progress.uploadedBytes)} mono />
          <StatItem label="Speed" value={formatBitrate(progress.bytesPerSecond)} mono />
          <StatItem label="Time remaining" value={formatCountdown(progress.etaSeconds)} mono />
        </StatGrid>
      </div>
    </WorkspaceCard>
  );
}
