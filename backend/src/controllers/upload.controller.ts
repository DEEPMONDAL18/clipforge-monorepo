import { FastifyReply, FastifyRequest } from 'fastify';
import { InitUploadRequestDTO } from '@clipforge/shared';
import { successResponse } from '../utils/response.js';

export class UploadController {
  public static async initUpload(
    request: FastifyRequest<{ Body: InitUploadRequestDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    const uploadService = request.server.services.upload;
    const videoService = request.server.services.video;

    // Create placeholder job metadata and upload details
    await videoService.createJob(request.body);
    const result = await uploadService.initializeUpload(request.body);

    reply.status(201).send(successResponse(result));
  }
}
