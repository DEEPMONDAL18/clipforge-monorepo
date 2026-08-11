/**
 * Domain types re-exported from @clipforge/shared.
 * Maintains 100% backward compatibility across all frontend components.
 */

import type { JobStatusType } from '@clipforge/shared';

export type {
  JobStage,
  StageState,
  VideoMetadata,
  ClipSettings,
  ClipArtifact,
  ArchiveArtifact,
  ActivityLevel,
  ActivityEvent,
  JobErrorCode,
  JobError,
  UploadProgress,
  Job,
  WorkspacePhase
} from '@clipforge/shared';

export type JobStatus = JobStatusType;
