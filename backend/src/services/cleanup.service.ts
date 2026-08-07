import { ICleanupService } from '../types/services.types.js';
import { logger } from '../utils/logger.js';

export class CleanupService implements ICleanupService {
  public async deleteExpiredFiles(): Promise<number> {
    // TODO: Query database for jobs created > 1 hour ago and unlink source video, clip files, and ZIP archives
    logger.info('Executing scheduled sweep for expired video files (placeholder)');
    return 0;
  }

  public async deleteJobArtifacts(jobId: string): Promise<void> {
    // TODO: Target specific job ID directory and permanently remove files from storage
    logger.info({ jobId }, 'Deleting job video artifacts (placeholder)');
  }
}
