import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { UploadCard } from '@/components/workspace/UploadCard';
import { UploadMonitor } from '@/components/workspace/UploadMonitor';
import { VideoMetadataCard } from '@/components/workspace/VideoMetadataCard';
import { ClipSettingsCard } from '@/components/workspace/ClipSettingsCard';
import { QueueCard } from '@/components/workspace/QueueCard';
import { ProgressCard } from '@/components/workspace/ProgressCard';
import { PipelineTimeline } from '@/components/workspace/PipelineTimeline';
import { ActivityTimeline } from '@/components/workspace/ActivityTimeline';
import { CompletionCard } from '@/components/workspace/CompletionCard';
import { DownloadPanel } from '@/components/workspace/DownloadPanel';
import { ExpiryCard } from '@/components/workspace/ExpiryCard';
import { ExpiredCard } from '@/components/workspace/ExpiredCard';
import { JobDetailsCard } from '@/components/workspace/JobDetailsCard';
import { ErrorPanel } from '@/components/workspace/ErrorPanel';
import { DEFAULT_CLIP_LENGTH_SECONDS } from '@/constants/app';
import type { Job, WorkspacePhase } from '@/types/job';

const transition = { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const };

function Phase({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={transition}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}

interface WorkspaceProps {
  initialJob?: Job | null;
  initialPhase?: WorkspacePhase;
  onFileSelected?: (file: File) => void;
  onStartOver?: () => void;
}

/**
 * The single, stateful workspace. It transforms as the job moves through the pipeline.
 */
export function Workspace({
  initialJob = null,
  initialPhase = 'idle',
  onFileSelected,
  onStartOver
}: WorkspaceProps) {
  const [job] = useState<Job | null>(initialJob);
  const [phase, setPhase] = useState<WorkspacePhase>(initialPhase);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clipLengthSeconds, setClipLengthSeconds] = useState(DEFAULT_CLIP_LENGTH_SECONDS);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPhase('idle');
    if (onStartOver) {
      onStartOver();
    }
  };

  const activeError = job?.error;

  return (
    <div id="workspace" className="scroll-mt-24">
      <AnimatePresence mode="wait">
        {phase === 'failed' && activeError ? (
          <Phase key="failed">
            <ErrorPanel
              error={activeError}
              isRetrying={false}
              onRetry={() => {}}
              onStartOver={handleReset}
            />
          </Phase>
        ) : phase === 'idle' ? (
          <Phase key="idle">
            <UploadCard onFileSelected={handleFileSelect} />
          </Phase>
        ) : phase === 'uploading' ? (
          <Phase key="uploading">
            <UploadMonitor
              filename={selectedFile?.name ?? 'Uploading video'}
              progress={
                job?.upload ?? {
                  uploadedBytes: 0,
                  totalBytes: selectedFile?.size ?? 0,
                  percentage: 0,
                  bytesPerSecond: 0,
                  etaSeconds: 0
                }
              }
              onCancel={handleReset}
            />
            {job ? <PipelineTimeline job={job} /> : null}
          </Phase>
        ) : phase === 'metadata' && job ? (
          <Phase key="metadata">
            <PipelineTimeline job={job} />
            <VideoMetadataCard
              metadata={job.metadata}
              clipLengthSeconds={clipLengthSeconds}
              isLoading={job.metadata === null}
            />
            {job.metadata ? (
              <ClipSettingsCard
                durationSeconds={job.metadata.durationSeconds}
                isSubmitting={false}
                onClipLengthChange={setClipLengthSeconds}
                onSubmit={() => {}}
              />
            ) : null}
            <ActivityTimeline events={job.activity} />
          </Phase>
        ) : phase === 'queued' && job ? (
          <Phase key="queued">
            <PipelineTimeline job={job} />
            <QueueCard job={job} />
            <ActivityTimeline events={job.activity} />
          </Phase>
        ) : phase === 'processing' && job ? (
          <Phase key="processing">
            <PipelineTimeline job={job} />
            <ProgressCard job={job} />
            <ActivityTimeline events={job.activity} />
          </Phase>
        ) : phase === 'ready' && job ? (
          <Phase key="ready">
            <CompletionCard job={job} onStartNew={handleReset} />
            <DownloadPanel
              clips={job.clips}
              archive={job.archive}
              isLoading={false}
              isExpired={false}
              onDownloadClip={(clip) => {
                if (clip.downloadUrl) window.open(clip.downloadUrl, '_blank');
              }}
              onDownloadArchive={(archive) => {
                if (archive.downloadUrl) window.open(archive.downloadUrl, '_blank');
              }}
            />
            {job.expiresAt ? <ExpiryCard expiresAt={job.expiresAt} /> : null}
            <JobDetailsCard job={job} />
            <ActivityTimeline events={job.activity} />
          </Phase>
        ) : phase === 'expired' && job ? (
          <Phase key="expired">
            <ExpiredCard onStartNew={handleReset} />
            <JobDetailsCard job={job} />
          </Phase>
        ) : (
          <Phase key="fallback">
            <UploadCard onFileSelected={handleFileSelect} />
          </Phase>
        )}
      </AnimatePresence>
    </div>
  );
}
