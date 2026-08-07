import { Upload, Video } from 'lucide-react';
import React, { useState } from 'react';
import { Card } from '../ui/Card.js';

export interface FileUploaderProps {
  onFileSelect?: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect?.(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card
      variant="glass"
      className={`border-2 border-dashed transition-all cursor-pointer text-center p-12 ${
        dragActive ? 'border-sky-500 bg-sky-950/20' : 'border-slate-800 hover:border-slate-700'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-sky-500/10 rounded-full text-sky-400">
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-100">Upload Large Video File</h3>
          <p className="text-sm text-slate-400 mt-1">
            Drag & drop MP4, MOV, MKV, or WebM up to 5 GB
          </p>
        </div>
        <div className="flex items-center text-xs text-slate-500 space-x-2">
          <Video className="w-4 h-4" />
          <span>Lossless Stream Copy Extraction • 1-Hour Auto Deletion</span>
        </div>
      </div>
    </Card>
  );
};
