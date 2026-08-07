import { JobMetadata, JobProgress } from '@clipforge/shared';
import { useEffect, useState } from 'react';

export interface UseJobStatusResult {
  readonly job: JobMetadata | null;
  readonly progress: JobProgress | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refresh: () => void;
}

export function useJobStatus(jobId: string | null): UseJobStatusResult {
  const [job, setJob] = useState<JobMetadata | null>(null);
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      setJob(null);
      setProgress(null);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [jobId]);

  return {
    job,
    progress,
    isLoading,
    error,
    refresh: () => {
      // TODO: Trigger manual re-fetch of job status
    }
  };
}
