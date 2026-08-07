import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  SECRET_KEY: z.string().default('development-secret-key-do-not-use-in-prod'),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_DB: z.coerce.number().default(0),

  STORAGE_DRIVER: z.enum(['local', 's3', 'r2', 'azure', 'gcs']).default('local'),
  STORAGE_ROOT_DIR: z.string().default('./storage'),
  STORAGE_TEMP_DIR: z.string().default('./storage/temp'),
  UPLOAD_TEMP_DIR: z.string().default('./storage/uploads'),
  LOGS_DIR: z.string().default('./storage/logs'),
  MAX_FILE_SIZE_BYTES: z.coerce.number().default(5368709120), // 5 GB
  DEFAULT_CHUNK_SIZE_BYTES: z.coerce.number().default(5242880), // 5 MB
  JOB_TTL_SECONDS: z.coerce.number().default(3600), // 1 Hour
  WORKER_CONCURRENCY: z.coerce.number().default(2),
  WORKER_JOB_TIMEOUT_MS: z.coerce.number().default(300000), // 5 Minutes
  MAX_JOB_RETRIES: z.coerce.number().default(3),

  SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  SUPABASE_ANON_KEY: z.string().optional().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),

  FFMPEG_PATH: z.string().optional().default('ffmpeg'),
  FFPROBE_PATH: z.string().optional().default('ffprobe'),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(): AppEnv {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables schema:', result.error.format());
    throw new Error('Environment variable validation failure.');
  }
  return result.data;
}
