import { Archive, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';

/** Terminal state after the one-hour retention window closes. */
export function ExpiredCard({ onStartNew }: { onStartNew: () => void }) {
  return (
    <WorkspaceCard
      title="These clips have expired"
      description="ClipForge deletes every file one hour after processing."
      icon={Archive}
    >
      <p className="text-small text-muted-foreground">
        The clips from this job are no longer stored on our servers. Upload the source video again
        to regenerate them — processing settings are not retained either.
      </p>
      <Button className="mt-6 min-h-11 rounded-lg" onClick={onStartNew}>
        <RotateCcw className="size-4" />
        Upload a new video
      </Button>
    </WorkspaceCard>
  );
}
