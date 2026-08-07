import { AppEnv } from '../config/env.js';
import { IStorageProvider } from '../storage/storage-provider.interface.js';
import {
  ICleanupService,
  IFFmpegService,
  IQueueService,
  ISupabaseService,
  IUploadService,
  IVideoService,
  IZipService
} from './services.types.js';

import { ResumableUploadService } from '../services/resumable-upload.service.js';
import { WorkerService } from '../services/worker.service.js';

declare module 'fastify' {
  interface FastifyInstance {
    config: AppEnv;
    storageProvider: IStorageProvider;
    services: {
      upload: IUploadService;
      resumableUpload: ResumableUploadService;
      video: IVideoService;
      ffmpeg: IFFmpegService;
      queue: IQueueService;
      worker: WorkerService;
      cleanup: ICleanupService;
      zip: IZipService;
      supabase: ISupabaseService;
    };
  }
}
