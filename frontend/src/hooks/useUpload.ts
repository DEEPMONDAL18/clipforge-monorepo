import { InitUploadResponseDTO, SplitSegmentInput } from '@clipforge/shared';
import { useState } from 'react';

export interface UseUploadResult {
  readonly isUploading: boolean;
  readonly uploadProgressPercentage: number;
  readonly error: string | null;
  readonly startUpload: (
    file: File,
    segments: SplitSegmentInput[]
  ) => Promise<InitUploadResponseDTO | null>;
}

export function useUpload(): UseUploadResult {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressPercentage, setUploadProgressPercentage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const startUpload = async (
    _file: File,
    _segments: SplitSegmentInput[]
  ): Promise<InitUploadResponseDTO | null> => {
    setIsUploading(true);
    setUploadProgressPercentage(0);
    setError(null);

    try {
      // TODO: Execute initialization request and stream upload bytes to server/storage
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgressPercentage,
    error,
    startUpload
  };
}
