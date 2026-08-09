import { FileVideo } from 'lucide-react';

import { MetadataSkeleton } from '@/components/common/LoadingSkeleton';
import { StatGrid, StatItem } from '@/components/common/StatItem';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { formatBytes, formatCountdown, formatDuration, formatResolution } from '@/utils/format';
import { estimateClipCount, estimateProcessingSeconds } from '@/utils/video';
import type { VideoMetadata } from '@/types/job';

interface VideoMetadataCardProps {
  metadata: VideoMetadata | null;
  clipLengthSeconds: number;
  isLoading: boolean;
}

/** Read-only presentation of the metadata extracted from the source video. */
export function VideoMetadataCard({
  metadata,
  clipLengthSeconds,
  isLoading
}: VideoMetadataCardProps) {
  const clipCount = metadata ? estimateClipCount(metadata.durationSeconds, clipLengthSeconds) : 0;
  const processingSeconds = metadata
    ? estimateProcessingSeconds(metadata.durationSeconds, clipCount)
    : 0;

  return (
    <WorkspaceCard
      title="Video information"
      description={
        isLoading ? 'Reading the source file' : (metadata?.filename ?? 'No video loaded')
      }
      icon={FileVideo}
    >
      {isLoading || !metadata ? (
        <MetadataSkeleton />
      ) : (
        <StatGrid>
          <StatItem label="Duration" value={formatDuration(metadata.durationSeconds)} mono />
          <StatItem
            label="Resolution"
            value={formatResolution(metadata.width, metadata.height)}
            mono
          />
          <StatItem label="Video codec" value={metadata.codec} />
          <StatItem label="Audio" value={metadata.audioCodec} />
          <StatItem label="Frame rate" value={`${metadata.frameRate.toFixed(2)} fps`} mono />
          <StatItem label="File size" value={formatBytes(metadata.sizeBytes)} mono />
          <StatItem label="Estimated clips" value={`${clipCount}`} mono />
          <StatItem label="Estimated processing" value={formatCountdown(processingSeconds)} mono />
        </StatGrid>
      )}
    </WorkspaceCard>
  );
}
