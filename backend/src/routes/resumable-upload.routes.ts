import { FastifyInstance } from 'fastify';
import { ResumableUploadController } from '../controllers/resumable-upload.controller.js';

export async function resumableUploadRoutes(fastify: FastifyInstance): Promise<void> {
  // Add raw binary content type parser for chunk stream uploads
  fastify.addContentTypeParser(
    'application/octet-stream',
    { parseAs: 'buffer' },
    (_req, payload, done) => {
      done(null, payload);
    }
  );

  fastify.post(
    '/upload/init',
    {
      schema: {
        description: 'Initialize a new resumable video upload session',
        tags: ['Resumable Upload'],
        body: {
          type: 'object',
          required: ['fileName', 'fileSizeBytes', 'mimeType', 'segments'],
          properties: {
            fileName: { type: 'string' },
            fileSizeBytes: { type: 'number' },
            mimeType: { type: 'string' },
            segments: { type: 'array' },
            chunkSizeBytes: { type: 'number' }
          }
        }
      }
    },
    ResumableUploadController.initUpload
  );

  fastify.put(
    '/upload/:uploadId/chunk',
    {
      schema: {
        description: 'Upload a single video chunk part with mandatory SHA-256 checksum',
        tags: ['Resumable Upload'],
        params: {
          type: 'object',
          required: ['uploadId'],
          properties: {
            uploadId: { type: 'string' }
          }
        }
      }
    },
    ResumableUploadController.uploadChunk
  );

  fastify.get(
    '/upload/:uploadId/status',
    {
      schema: {
        description: 'Query upload session progress and missing chunk indices for resume',
        tags: ['Resumable Upload'],
        params: {
          type: 'object',
          required: ['uploadId'],
          properties: {
            uploadId: { type: 'string' }
          }
        }
      }
    },
    ResumableUploadController.getUploadStatus
  );

  fastify.delete(
    '/upload/:uploadId',
    {
      schema: {
        description: 'Abort upload session and purge temporary stored chunks',
        tags: ['Resumable Upload'],
        params: {
          type: 'object',
          required: ['uploadId'],
          properties: {
            uploadId: { type: 'string' }
          }
        }
      }
    },
    ResumableUploadController.abortUpload
  );
}
