import { FastifyInstance } from 'fastify';
import { QueueController } from '../controllers/queue.controller.js';

export async function queueRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/jobs/:id/cancel',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    QueueController.cancelJob
  );

  fastify.get('/queue/stats', QueueController.getQueueStats);
}
