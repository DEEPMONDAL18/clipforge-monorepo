import { ClipInfo } from '@clipforge/shared';
import { Download, Film } from 'lucide-react';
import React from 'react';
import { formatBytes, formatSeconds } from '../../lib/utils.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';

export interface ClipListProps {
  clips: readonly ClipInfo[];
  zipDownloadUrl?: string;
}

export const ClipList: React.FC<ClipListProps> = ({ clips, zipDownloadUrl }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Film className="w-5 h-5 text-sky-400" />
          <span>Extracted Clips ({clips.length})</span>
        </h2>
        {zipDownloadUrl && (
          <Button variant="primary" size="md" onClick={() => window.open(zipDownloadUrl, '_blank')}>
            <Download className="w-4 h-4 mr-2" />
            Download All (ZIP)
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clips.map((clip) => (
          <Card key={clip.clipId} className="flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-semibold text-slate-200">{clip.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Duration: {formatSeconds(clip.durationSeconds)} • Size:{' '}
                {formatBytes(clip.sizeBytes)}
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(clip.downloadUrl, '_blank')}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download Clip
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
