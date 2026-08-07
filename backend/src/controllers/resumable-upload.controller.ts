import { InitUploadRequestDTO } from '@clipforge/shared';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

export class ResumableUploadController {
  public static async initUpload(
    request: FastifyRequest<{ Body: InitUploadRequestDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    const uploadService = request.server.services.resumableUpload;
    const result = await uploadService.initUpload(request.body);
    reply.status(201).send(successResponse(result));
  }

  public static async uploadChunk(
    request: FastifyRequest<{
      Params: { uploadId: string };
      Headers: { 'x-chunk-index'?: string; 'x-chunk-checksum'?: string };
      Querystring: { chunkIndex?: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { uploadId } = request.params;
    const chunkIndexHeader = request.headers['x-chunk-index'] || request.query.chunkIndex;
    const checksum = request.headers['x-chunk-checksum'];

    if (chunkIndexHeader === undefined) {
      throw new ValidationError("Missing required 'x-chunk-index' header or query parameter");
    }

    if (!checksum || checksum.trim() === '') {
      throw new ValidationError("Missing required mandatory SHA-256 checksum header ('x-chunk-checksum')");
    }

    const chunkIndex = parseInt(chunkIndexHeader, 10);
    if (isNaN(chunkIndex)) {
      throw new ValidationError("Invalid 'x-chunk-index' parameter; must be an integer");
    }

    // Expect raw Buffer body
    const chunkBuffer = Buffer.isBuffer(request.body)
      ? request.body
      : Buffer.from(JSON.stringify(request.body || {}));

    const uploadService = request.server.services.resumableUpload;
    const result = await uploadService.uploadChunk(uploadId, chunkIndex, chunkBuffer, checksum);

    reply.status(200).send(successResponse(result));
  }

  public static async getUploadStatus(
    request: FastifyRequest<{ Params: { uploadId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { uploadId } = request.params;
    const uploadService = request.server.services.resumableUpload;
    const result = await uploadService.getUploadStatus(uploadId);
    reply.status(200).send(successResponse(result));
  }

  public static async abortUpload(
    request: FastifyRequest<{ Params: { uploadId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { uploadId } = request.params;
    const uploadService = request.server.services.resumableUpload;
    await uploadService.abortUpload(uploadId);
    reply.status(200).send(
      successResponse({
        jobId: uploadId,
        message: 'Upload session aborted and temporary chunks purged'
      })
    );
  }
}
