import { FastifyInstance } from 'fastify';
import { JobController } from '../controllers/job.controller.js';

export async function jobRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/jobs/:id',
    {
      schema: {
        description: 'Get job status and metadata',
        tags: ['Jobs'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    JobController.getJob
  );

  fastify.get(
    '/jobs/:id/progress',
    {
      schema: {
        description: 'Get real-time job processing progress',
        tags: ['Jobs'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    JobController.getProgress
  );

  fastify.get(
    '/jobs/:id/clips',
    {
      schema: {
        description: 'Get generated clip metadata list for job',
        tags: ['Jobs'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    JobController.getClips
  );

  fastify.delete(
    '/jobs/:id',
    {
      schema: {
        description: 'Cancel or delete video job and associated files',
        tags: ['Jobs'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    JobController.deleteJob
  );
}
