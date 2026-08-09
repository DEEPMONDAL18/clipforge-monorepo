import { Gauge, ShieldCheck, Zap } from 'lucide-react';

import { APP_TAGLINE } from '@/constants/app';

const HERO_POINTS = [
  { icon: Zap, label: 'No re-encoding' },
  { icon: Gauge, label: 'Files up to 20 GB' },
  { icon: ShieldCheck, label: 'Deleted after 1 hour' }
] as const;

/** Restrained hero: one promise, one supporting line, no competing CTAs. */
export function Hero() {
  return (
    <section className="stage-glow border-b">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Video splitting workspace
        </p>
        <h1 className="mt-6 text-balance text-hero font-semibold tracking-tight">
          Split long videos into clips in minutes
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-body text-muted-foreground">
          {APP_TAGLINE} Upload a file, choose a clip length, and download every segment as an
          archive.
        </p>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {HERO_POINTS.map((point) => (
            <li
              key={point.label}
              className="flex items-center gap-2 text-small text-muted-foreground"
            >
              <point.icon aria-hidden="true" className="size-4 text-primary" />
              {point.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
