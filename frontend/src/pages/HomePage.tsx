import { Scissors, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { FileUploader } from '../components/upload/FileUploader.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';

export const HomePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
          Split Large Videos <span className="text-sky-400">Without Quality Loss</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          Upload multi-gigabyte video files, define exact split timestamps, and receive instant losslessly cut clips or a single ZIP package.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <FileUploader onFileSelect={(file) => setSelectedFile(file)} />

        {selectedFile && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-200">{selectedFile.name}</h4>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'video/mp4'}
                </p>
              </div>
              <Button variant="primary" size="md">
                <Scissors className="w-4 h-4 mr-2" />
                Configure Clips
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
        <Card className="space-y-2">
          <div className="text-sky-400 font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Lossless Processing</span>
          </div>
          <p className="text-xs text-slate-400">
            FFmpeg stream copy preserves exact original video codecs, bitrate, color space, and audio channels.
          </p>
        </Card>

        <Card className="space-y-2">
          <div className="text-emerald-400 font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>High Performance Queue</span>
          </div>
          <p className="text-xs text-slate-400">
            Async BullMQ queue workers process video clips in parallel without blocking main API execution.
          </p>
        </Card>

        <Card className="space-y-2">
          <div className="text-amber-400 font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Automatic Ephemeral Cleanup</span>
          </div>
          <p className="text-xs text-slate-400">
            Strict 60-minute retention policy ensures zero residual files remain on disk or cloud storage.
          </p>
        </Card>
      </div>
    </div>
  );
};
