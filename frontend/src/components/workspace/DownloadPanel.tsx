import { Download, FileArchive, Film } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ClipListSkeleton } from '@/components/common/LoadingSkeleton';
import { formatBytes, formatDuration, formatResolution } from '@/utils/format';
import type { ArchiveArtifact, ClipArtifact } from '@/types/job';

interface DownloadPanelProps {
  clips: ClipArtifact[];
  archive: ArchiveArtifact | null;
  isLoading: boolean;
  isExpired: boolean;
  onDownloadClip: (clip: ClipArtifact) => void;
  onDownloadArchive: (archive: ArchiveArtifact) => void;
}

/** Clip list with per-clip and archive downloads. */
export function DownloadPanel({
  clips,
  archive,
  isLoading,
  isExpired,
  onDownloadClip,
  onDownloadArchive
}: DownloadPanelProps) {
  return (
    <WorkspaceCard
      title="Your clips"
      description={
        clips.length > 0
          ? `${clips.length} clips generated without re-encoding`
          : 'Generated clips will appear here'
      }
      icon={Film}
      action={
        archive && !isExpired ? (
          <Button className="min-h-11 rounded-lg" onClick={() => onDownloadArchive(archive)}>
            <FileArchive className="size-4" />
            Download all ({formatBytes(archive.sizeBytes)})
          </Button>
        ) : null
      }
    >
      {isLoading ? (
        <ClipListSkeleton />
      ) : clips.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No clips yet"
          description="Once processing finishes, every clip will be listed here with its own download."
        />
      ) : (
        <ul className="divide-y rounded-lg border">
          {clips.map((clip) => (
            <li
              key={clip.id}
              className="flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate text-small font-medium" title={clip.filename}>
                  {clip.filename}
                </p>
                <p className="mt-1 font-mono text-caption tabular-nums text-subtle-foreground">
                  {formatDuration(clip.durationSeconds)} · {formatBytes(clip.sizeBytes)} ·{' '}
                  {formatResolution(clip.width, clip.height)}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="min-h-11 shrink-0 rounded-lg"
                onClick={() => onDownloadClip(clip)}
                disabled={isExpired}
                aria-label={`Download ${clip.filename}`}
              >
                <Download className="size-4" />
                Download
              </Button>
            </li>
          ))}
        </ul>
      )}
    </WorkspaceCard>
  );
}
