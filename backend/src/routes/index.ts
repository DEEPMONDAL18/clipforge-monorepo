import { FastifyInstance } from 'fastify';
import { downloadRoutes } from './download.routes.js';
import { jobRoutes } from './job.routes.js';
import { queueRoutes } from './queue.routes.js';
import { resumableUploadRoutes } from './resumable-upload.routes.js';
import { uploadRoutes } from './upload.routes.js';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  const apiPrefix = app.config.API_PREFIX || '/api/v1';

  await app.register(
    async (api) => {
      await api.register(resumableUploadRoutes);
      await api.register(uploadRoutes);
      await api.register(jobRoutes);
      await api.register(queueRoutes);
      await api.register(downloadRoutes);
    },
    { prefix: apiPrefix }
  );
}
