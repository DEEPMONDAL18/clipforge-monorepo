import { Clock3, FileArchive, Layers, ShieldCheck, Sparkles, Waypoints } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Stream copy, not re-encode',
    description:
      'Clips are cut on keyframes and copied directly, so quality, bitrate and audio stay identical to the source.'
  },
  {
    icon: Layers,
    title: 'Chunked uploads',
    description:
      'Large files transfer in 8 MB chunks with resumable progress, so a 20 GB master never fails on the last percent.'
  },
  {
    icon: Waypoints,
    title: 'Transparent pipeline',
    description:
      'Every stage — upload, metadata, queue, processing, packaging — reports its own state instead of a spinner.'
  },
  {
    icon: FileArchive,
    title: 'One archive, all clips',
    description:
      'Download clips individually or grab a single ZIP containing the full sequence in order.'
  },
  {
    icon: Clock3,
    title: 'One-hour retention',
    description:
      'A live countdown shows exactly when files are deleted. No accounts, no long-term storage, no surprises.'
  },
  {
    icon: ShieldCheck,
    title: 'Nothing kept behind',
    description:
      'Source videos and generated clips are removed together when the retention window closes.'
  }
] as const;

/** Six calm capability statements. No marketing gradient, no testimonials. */
export function Features() {
  return (
    <section aria-labelledby="features-heading" className="border-t py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="features-heading" className="text-h1 font-semibold tracking-tight">
          Built like desktop software
        </h2>
        <p className="mt-3 max-w-xl text-body text-muted-foreground">
          ClipForge behaves like a professional tool: precise numbers, honest progress, and no
          hidden processing.
        </p>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="bg-card p-6">
              <feature.icon aria-hidden="true" className="size-5 text-primary" />
              <h3 className="mt-4 text-small font-semibold">{feature.title}</h3>
              <p className="mt-2 text-small text-muted-foreground">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
