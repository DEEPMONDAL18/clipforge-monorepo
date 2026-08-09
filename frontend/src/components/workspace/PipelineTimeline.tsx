import { Check, Loader2 } from 'lucide-react';

import { PIPELINE_STAGES } from '@/constants/app';
import { cn } from '@/lib/utils';
import type { Job, JobStage, StageState } from '@/types/job';

const STAGE_ORDER: JobStage[] = PIPELINE_STAGES.map((stage) => stage.id);

function resolveStageState(stage: JobStage, job: Job): StageState {
  const current = STAGE_ORDER.indexOf(job.stage);
  const index = STAGE_ORDER.indexOf(stage);
  if (job.status === 'ready' || job.status === 'expired') return 'complete';
  if (index < current) return 'complete';
  if (index === current) return 'active';
  return 'pending';
}

/** Horizontal pipeline showing where the job sits in the six-stage flow. */
export function PipelineTimeline({ job }: { job: Job }) {
  return (
    <ol className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-card md:flex-row md:items-start md:gap-0">
      {PIPELINE_STAGES.map((stage, index) => {
        const state = resolveStageState(stage.id, job);
        const isLast = index === PIPELINE_STAGES.length - 1;

        return (
          <li key={stage.id} className="flex flex-1 items-start gap-3 md:flex-col md:gap-3">
            <div className="flex items-center gap-3 md:w-full">
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border text-caption font-medium transition-colors duration-150',
                  state === 'complete' && 'border-success/40 bg-success/15 text-success',
                  state === 'active' && 'border-primary bg-primary/15 text-primary',
                  state === 'pending' && 'border-border bg-muted text-subtle-foreground'
                )}
              >
                {state === 'complete' ? (
                  <Check className="size-3.5" />
                ) : state === 'active' ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  index + 1
                )}
              </span>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden h-px flex-1 md:block',
                    state === 'complete' ? 'bg-success/40' : 'bg-border'
                  )}
                />
              ) : null}
            </div>
            <div className="min-w-0 md:pr-6">
              <p
                className={cn(
                  'text-small font-medium',
                  state === 'pending' ? 'text-subtle-foreground' : 'text-foreground'
                )}
              >
                {stage.label}
              </p>
              <p className="mt-1 text-caption text-muted-foreground">{stage.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
