import Fastify, { FastifyInstance } from 'fastify';
import { AppEnv, loadEnv } from './config/env.js';
import { errorHandlerMiddleware } from './middleware/error-handler.middleware.js';
import { registerSecurityMiddleware } from './middleware/security.middleware.js';
import { registerRoutes } from './routes/index.js';
import { CleanupService } from './services/cleanup.service.js';
import { FFmpegService } from './services/ffmpeg.service.js';
import { QueueService } from './services/queue.service.js';
import { SupabaseService } from './services/supabase.service.js';
import { UploadService } from './services/upload.service.js';
import { VideoService } from './services/video.service.js';
import { ZipService } from './services/zip.service.js';

import { WorkerService } from './services/worker.service.js';
import { ResumableUploadService } from './services/resumable-upload.service.js';
import { LocalStorageProvider } from './storage/local-storage.provider.js';

export function buildApp(envOverride?: AppEnv): FastifyInstance {
  const env = envOverride || loadEnv();

  const app = Fastify({
    logger: false, // Using custom pino logger integration
    disableRequestLogging: false
  });

  const storageProvider = new LocalStorageProvider(env.STORAGE_ROOT_DIR);
  const videoService = new VideoService();
  const ffmpegService = new FFmpegService();
  const zipService = new ZipService();
  const workerService = new WorkerService(
    env,
    videoService,
    ffmpegService,
    storageProvider,
    zipService
  );
  const queueService = new QueueService(workerService, videoService);

  // Attach runtime config & storage provider abstraction
  app.decorate('config', env);
  app.decorate('storageProvider', storageProvider);

  // Initialize and attach dependency-injected services
  app.decorate('services', {
    upload: new UploadService(),
    resumableUpload: new ResumableUploadService(
      env,
      storageProvider,
      videoService,
      ffmpegService,
      queueService
    ),
    video: videoService,
    ffmpeg: ffmpegService,
    queue: queueService,
    worker: workerService,
    cleanup: new CleanupService(),
    zip: new ZipService(),
    supabase: new SupabaseService(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  });

  // Register error handler
  app.setErrorHandler(errorHandlerMiddleware);

  // Health check endpoint (No authentication, monitoring ready)
  app.get('/health', async () => {
    return {
      status: 'ok',
      uptime: process.uptime(),
      version: '1.0.0'
    };
  });

  // Register security plugins & middleware
  app.register(registerSecurityMiddleware);

  // Register application routes
  app.register(registerRoutes);

  return app;
}
