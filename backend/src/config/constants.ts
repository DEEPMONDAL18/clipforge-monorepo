export const APP_CONSTANTS = {
  NAME: 'ClipForge',
  VERSION: '1.0.0',
  DEFAULT_JOB_TTL_MS: 3600 * 1000, // 1 Hour
  MAX_SEGMENTS_PER_VIDEO: 100,
  MIN_SEGMENT_DURATION_SECONDS: 1,
  SUPPORTED_MIME_TYPES: [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm'
  ] as const,
  QUEUE_NAMES: {
    VIDEO_PROCESSING: 'video-processing-queue',
    CLEANUP: 'cleanup-queue'
  } as const
} as const;
