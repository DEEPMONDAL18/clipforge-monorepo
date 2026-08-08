import { Github } from 'lucide-react';

import { ClipForgeMark } from '@/components/layout/ClipForgeMark';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { APP_NAME, GITHUB_URL } from '@/constants/app';

/** Minimal sticky navigation: logo, GitHub, theme toggle. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a
          href="/"
          className="flex items-center gap-2 rounded-md text-small font-semibold tracking-tight"
        >
          <ClipForgeMark className="size-6" />
          {APP_NAME}
        </a>
        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-11 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="ClipForge on GitHub">
              <Github className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
