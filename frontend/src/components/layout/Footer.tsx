import { APP_NAME, APP_VERSION, GITHUB_URL } from '@/constants/app';

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'GitHub', href: GITHUB_URL }
] as const;

/** Minimal footer: legal links, GitHub, version, copyright. */
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-caption text-subtle-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-sm text-caption text-muted-foreground transition-colors duration-150 hover:text-foreground"
              {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
          <span className="font-mono text-caption text-subtle-foreground">v{APP_VERSION}</span>
        </nav>
      </div>
    </footer>
  );
}
