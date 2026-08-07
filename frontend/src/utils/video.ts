import { SUPPORTED_EXTENSIONS, MAX_UPLOAD_BYTES } from '@/constants/app';

export function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? (parts.pop() ?? '') : '';
}

export function isSupportedVideoFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(extension);
}

export function isWithinSizeLimit(file: File): boolean {
  return file.size > 0 && file.size <= MAX_UPLOAD_BYTES;
}

export function estimateClipCount(durationSeconds: number, clipLengthSeconds: number): number {
  if (clipLengthSeconds <= 0) return 0;
  return Math.max(1, Math.ceil(durationSeconds / clipLengthSeconds));
}

/**
 * Lossless splitting is stream-copy based, so processing time scales with
 * clip count and source duration rather than with encoding complexity.
 */
export function estimateProcessingSeconds(durationSeconds: number, clipCount: number): number {
  return Math.round(durationSeconds * 0.012 + clipCount * 0.9 + 4);
}
