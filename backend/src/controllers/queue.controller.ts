import { FastifyReply, FastifyRequest } from 'fastify';
import { successResponse } from '../utils/response.js';

export class QueueController {
  public static async cancelJob(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const queueService = request.server.services.queue;
    await queueService.cancelJob(id);

    reply.status(200).send(
      successResponse({
        jobId: id,
        message: `Job '${id}' cancellation signal registered`
      })
    );
  }

  public static async getQueueStats(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const workerService = _request.server.services.worker;
    const stats = await workerService.getQueueMetrics();

    reply.status(200).send(successResponse(stats));
  }
}
