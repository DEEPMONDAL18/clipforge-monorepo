import { useCallback, useRef, useState } from 'react';
import { FileVideo, FolderOpen, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  MAX_UPLOAD_BYTES,
  SUPPORTED_ACCEPT_ATTRIBUTE,
  SUPPORTED_EXTENSIONS
} from '@/constants/app';
import { formatBytes } from '@/utils/format';

interface UploadCardProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

/** Primary interaction point: drag & drop or browse for a source video. */
export function UploadCard({ onFileSelected, disabled = false }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.item(0);
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      className={cn(
        'rounded-xl border border-dashed bg-card p-8 text-center shadow-card transition-colors duration-150 sm:p-12',
        isDragOver ? 'border-primary bg-primary/5' : 'hover:border-border-strong',
        disabled && 'pointer-events-none opacity-60'
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={SUPPORTED_ACCEPT_ATTRIBUTE}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
        aria-label="Choose a video file to upload"
      />

      <span
        aria-hidden="true"
        className={cn(
          'mx-auto flex size-12 items-center justify-center rounded-xl border bg-muted text-muted-foreground transition-colors duration-150',
          isDragOver && 'border-primary/50 text-primary'
        )}
      >
        {isDragOver ? <FileVideo className="size-5" /> : <UploadCloud className="size-5" />}
      </span>

      <h2 className="mt-6 text-h3 font-semibold tracking-tight">Drag &amp; drop video</h2>
      <p className="mt-2 text-small text-muted-foreground">
        Drop a file anywhere in this area, or choose one from your device.
      </p>

      <Button
        type="button"
        className="mt-8 min-h-11 rounded-lg px-6"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <FolderOpen className="size-4" />
        Browse files
      </Button>

      <dl className="mt-8 flex flex-col items-center justify-center gap-2 text-caption text-subtle-foreground sm:flex-row sm:gap-6">
        <div className="flex items-center gap-2">
          <dt>Formats</dt>
          <dd className="font-mono uppercase text-muted-foreground">
            {SUPPORTED_EXTENSIONS.join(' · ')}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>Maximum size</dt>
          <dd className="font-mono text-muted-foreground">{formatBytes(MAX_UPLOAD_BYTES, 0)}</dd>
        </div>
      </dl>
    </div>
  );
}
