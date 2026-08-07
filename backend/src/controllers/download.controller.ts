import { FastifyReply, FastifyRequest } from 'fastify';
import { successResponse } from '../utils/response.js';

export class DownloadController {
  public static async downloadJobArtifact(
    request: FastifyRequest<{
      Params: { jobId: string };
      Querystring: { clipId?: string; archive?: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { jobId } = request.params;
    const { clipId, archive } = request.query;

    // Mock response payload representing file stream / redirect download
    reply.send(
      successResponse({
        jobId,
        downloadType: archive === 'true' ? 'ZIP_ARCHIVE' : 'INDIVIDUAL_CLIP',
        clipId: clipId || null,
        fileName: archive === 'true' ? `${jobId}_all_clips.zip` : `${clipId || 'clip_1'}.mp4`,
        downloadUrl: `https://storage.clipforge.app/downloads/${jobId}/${clipId || 'archive.zip'}`,
        expiresInSeconds: 3600
      })
    );
  }
}
