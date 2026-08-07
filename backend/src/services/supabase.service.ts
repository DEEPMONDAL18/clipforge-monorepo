import { JobMetadata } from '@clipforge/shared';
import { ISupabaseService } from '../types/services.types.js';
import { logger } from '../utils/logger.js';

export class SupabaseService implements ISupabaseService {
  constructor(
    private readonly supabaseUrl?: string,
    private readonly supabaseKey?: string
  ) {
    void this.supabaseUrl;
    void this.supabaseKey;
  }

  public async saveJobRecord(job: JobMetadata): Promise<void> {
    // TODO: Insert job record into Supabase PostgreSQL database table `jobs`
    logger.info({ jobId: job.jobId }, 'Supabase DB saveJobRecord (placeholder)');
  }

  public async fetchJobRecord(jobId: string): Promise<JobMetadata | null> {
    // TODO: Query job record by ID from Supabase
    logger.info({ jobId }, 'Supabase DB fetchJobRecord (placeholder)');
    return null;
  }

  public async updateJobRecord(
    jobId: string,
    updates: Partial<JobMetadata>
  ): Promise<void> {
    // TODO: Update job record columns in Supabase
    logger.info({ jobId, updates }, 'Supabase DB updateJobRecord (placeholder)');
  }

  public async deleteJobRecord(jobId: string): Promise<void> {
    // TODO: Delete job record row from Supabase
    logger.info({ jobId }, 'Supabase DB deleteJobRecord (placeholder)');
  }
}
