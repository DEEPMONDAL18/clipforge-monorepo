import { FastifyReply, FastifyRequest } from 'fastify';
import { NotFoundError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

export class JobController {
  public static async getJob(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const videoService = request.server.services.video;

    const job = await videoService.getJob(id);
    if (!job) {
      throw new NotFoundError(`Job with ID '${id}' not found`);
    }

    reply.send(successResponse(job));
  }

  public static async getProgress(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const videoService = request.server.services.video;

    const progress = await videoService.getJobProgress(id);
    if (!progress) {
      throw new NotFoundError(`Progress for job '${id}' not found`);
    }

    reply.send(successResponse(progress));
  }

  public static async getClips(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const videoService = request.server.services.video;

    const clips = await videoService.getJobClips(id);
    reply.send(successResponse(clips));
  }

  public static async deleteJob(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const videoService = request.server.services.video;
    const cleanupService = request.server.services.cleanup;

    await videoService.cancelOrDeleteJob(id);
    await cleanupService.deleteJobArtifacts(id);

    reply.send(
      successResponse({
        jobId: id,
        message: 'Job artifacts and metadata deleted successfully'
      })
    );
  }
}
