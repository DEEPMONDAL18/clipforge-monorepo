import { FastifyInstance } from 'fastify';
import { DownloadController } from '../controllers/download.controller.js';

export async function downloadRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/download/:jobId',
    {
      schema: {
        description: 'Download individual clip or complete ZIP archive',
        tags: ['Download'],
        params: {
          type: 'object',
          required: ['jobId'],
          properties: {
            jobId: { type: 'string' }
          }
        },
        querystring: {
          type: 'object',
          properties: {
            clipId: { type: 'string' },
            archive: { type: 'string' }
          }
        }
      }
    },
    DownloadController.downloadJobArtifact
  );
}
