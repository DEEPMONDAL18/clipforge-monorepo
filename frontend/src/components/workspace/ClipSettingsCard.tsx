import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Scissors, Play } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WorkspaceCard } from '@/components/common/WorkspaceCard';
import { cn } from '@/lib/utils';
import {
  CLIP_LENGTH_PRESETS_SECONDS,
  MAX_CLIP_LENGTH_SECONDS,
  MIN_CLIP_LENGTH_SECONDS
} from '@/constants/app';
import { formatClipLength, formatCountdown } from '@/utils/format';
import { estimateClipCount, estimateProcessingSeconds } from '@/utils/video';

const SECONDS_PER_MINUTE = 60;

const clipSettingsSchema = z
  .object({
    preset: z.enum(['120', '180', '300', 'custom']),
    customMinutes: z.coerce
      .number()
      .min(MIN_CLIP_LENGTH_SECONDS / SECONDS_PER_MINUTE, 'Clips must be at least 15 seconds long.')
      .max(MAX_CLIP_LENGTH_SECONDS / SECONDS_PER_MINUTE, 'Clips cannot exceed 60 minutes.')
      .optional()
  })
  .refine((values) => values.preset !== 'custom' || values.customMinutes !== undefined, {
    message: 'Enter a custom clip length.',
    path: ['customMinutes']
  });

type ClipSettingsFormValues = z.input<typeof clipSettingsSchema>;

interface ClipSettingsCardProps {
  durationSeconds: number;
  isSubmitting: boolean;
  onClipLengthChange: (seconds: number) => void;
  onSubmit: (clipLengthSeconds: number) => void;
}

/** Clip length configuration with validated custom durations. */
export function ClipSettingsCard({
  durationSeconds,
  isSubmitting,
  onClipLengthChange,
  onSubmit
}: ClipSettingsCardProps) {
  const form = useForm<ClipSettingsFormValues>({
    resolver: zodResolver(clipSettingsSchema),
    mode: 'onChange',
    defaultValues: { preset: '180', customMinutes: 4 }
  });

  const preset = form.watch('preset');
  const customMinutes = form.watch('customMinutes');

  const clipLengthSeconds = useMemo(() => {
    if (preset !== 'custom') return Number(preset);
    const minutes = Number(customMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0) return 0;
    return Math.round(minutes * SECONDS_PER_MINUTE);
  }, [preset, customMinutes]);

  const isValidLength =
    clipLengthSeconds >= MIN_CLIP_LENGTH_SECONDS && clipLengthSeconds <= MAX_CLIP_LENGTH_SECONDS;
  const clipCount = isValidLength ? estimateClipCount(durationSeconds, clipLengthSeconds) : 0;
  const processingSeconds = isValidLength
    ? estimateProcessingSeconds(durationSeconds, clipCount)
    : 0;

  const selectLength = (value: ClipSettingsFormValues['preset']) => {
    form.setValue('preset', value, { shouldValidate: true });
    if (value !== 'custom') onClipLengthChange(Number(value));
  };

  return (
    <WorkspaceCard
      title="Clip configuration"
      description="Choose how long each generated clip should be."
      icon={Scissors}
      emphasis
    >
      <form
        onSubmit={form.handleSubmit(() => {
          if (isValidLength) onSubmit(clipLengthSeconds);
        })}
        noValidate
      >
        <fieldset>
          <legend className="text-caption uppercase tracking-wide text-subtle-foreground">
            Clip length
          </legend>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CLIP_LENGTH_PRESETS_SECONDS.map((seconds) => {
              const value = String(seconds) as ClipSettingsFormValues['preset'];
              const isSelected = preset === value;
              return (
                <button
                  key={seconds}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectLength(value)}
                  className={cn(
                    'min-h-11 rounded-lg border px-4 text-small font-medium transition-colors duration-150',
                    isSelected
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'bg-background text-muted-foreground hover:border-border-strong hover:text-foreground'
                  )}
                >
                  {formatClipLength(seconds)}
                </button>
              );
            })}
            <button
              type="button"
              aria-pressed={preset === 'custom'}
              onClick={() => selectLength('custom')}
              className={cn(
                'min-h-11 rounded-lg border px-4 text-small font-medium transition-colors duration-150',
                preset === 'custom'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'bg-background text-muted-foreground hover:border-border-strong hover:text-foreground'
              )}
            >
              Custom
            </button>
          </div>
        </fieldset>

        {preset === 'custom' ? (
          <div className="mt-6 max-w-xs">
            <Label htmlFor="custom-clip-length" className="text-caption text-muted-foreground">
              Custom length in minutes
            </Label>
            <Input
              id="custom-clip-length"
              type="number"
              inputMode="decimal"
              step="0.5"
              min={MIN_CLIP_LENGTH_SECONDS / SECONDS_PER_MINUTE}
              max={MAX_CLIP_LENGTH_SECONDS / SECONDS_PER_MINUTE}
              className="mt-2 h-11 rounded-lg"
              aria-invalid={Boolean(form.formState.errors.customMinutes)}
              {...form.register('customMinutes', {
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  const minutes = Number(event.target.value);
                  if (Number.isFinite(minutes) && minutes > 0) {
                    onClipLengthChange(Math.round(minutes * SECONDS_PER_MINUTE));
                  }
                }
              })}
            />
            {form.formState.errors.customMinutes ? (
              <p role="alert" className="mt-2 text-caption text-destructive">
                {form.formState.errors.customMinutes.message}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-6 border-t pt-6 sm:flex-row sm:items-end sm:justify-between">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <dt className="text-caption uppercase tracking-wide text-subtle-foreground">
                Estimated clips
              </dt>
              <dd className="mt-1 font-mono text-h3 tabular-nums">{clipCount || '—'}</dd>
            </div>
            <div>
              <dt className="text-caption uppercase tracking-wide text-subtle-foreground">
                Estimated processing
              </dt>
              <dd className="mt-1 font-mono text-h3 tabular-nums">
                {clipCount ? formatCountdown(processingSeconds) : '—'}
              </dd>
            </div>
          </dl>

          <Button
            type="submit"
            className="min-h-11 rounded-lg px-6"
            disabled={!isValidLength || isSubmitting}
          >
            <Play className="size-4" />
            {isSubmitting ? 'Starting…' : 'Process video'}
          </Button>
        </div>
      </form>
    </WorkspaceCard>
  );
}
