import type { JobStage } from '@/types/job';

/** Application identity — sourced from environment where available. */
export const APP_NAME = 'ClipForge';
export const APP_TAGLINE = 'Process large videos without compromising quality.';
export const APP_VERSION = import.meta.env['VITE_APP_VERSION'] ?? '1.0.0';
export const GITHUB_URL = import.meta.env['VITE_GITHUB_URL'] ?? 'https://github.com/clipforge';

/** Upload constraints enforced by the backend. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024 * 1024;
export const UPLOAD_CHUNK_BYTES = 8 * 1024 * 1024;
export const SUPPORTED_EXTENSIONS = ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'] as const;
export const SUPPORTED_ACCEPT_ATTRIBUTE = SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',');

/** Clip length options offered in the configuration card. */
export const CLIP_LENGTH_PRESETS_SECONDS = [120, 180, 300] as const;
export const DEFAULT_CLIP_LENGTH_SECONDS = 180;
export const MIN_CLIP_LENGTH_SECONDS = 15;
export const MAX_CLIP_LENGTH_SECONDS = 3600;

/** Storage lifetime enforced by the backend cleanup worker. */
export const RETENTION_SECONDS = 60 * 60;
export const EXPIRY_WARNING_SECONDS = 5 * 60;

/** Polling cadence for job status while a job is active. */
export const JOB_POLL_INTERVAL_MS = 750;

export const THEME_STORAGE_KEY = 'clipforge-theme';

export interface PipelineStageDefinition {
  id: JobStage;
  label: string;
  description: string;
}

export const PIPELINE_STAGES: readonly PipelineStageDefinition[] = [
  { id: 'upload', label: 'Upload', description: 'Transferring your video in chunks' },
  { id: 'metadata', label: 'Metadata', description: 'Reading duration, codec and frame rate' },
  { id: 'queue', label: 'Queue', description: 'Waiting for an available worker' },
  { id: 'processing', label: 'Processing', description: 'Splitting clips without re-encoding' },
  { id: 'zip', label: 'ZIP', description: 'Packaging every clip into one archive' },
  { id: 'ready', label: 'Ready', description: 'Clips available for download' }
] as const;
