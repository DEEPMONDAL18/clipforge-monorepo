import { FastifyInstance } from 'fastify';
import { UploadController } from '../controllers/upload.controller.js';

export async function uploadRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/upload',
    {
      schema: {
        description: 'Initialize video upload and job parameters',
        tags: ['Upload'],
        body: {
          type: 'object',
          required: ['fileName', 'fileSizeBytes', 'mimeType', 'segments'],
          properties: {
            fileName: { type: 'string' },
            fileSizeBytes: { type: 'number' },
            mimeType: { type: 'string' },
            segments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['startTimeSeconds', 'endTimeSeconds'],
                properties: {
                  startTimeSeconds: { type: 'number' },
                  endTimeSeconds: { type: 'number' },
                  title: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    UploadController.initUpload
  );
}
