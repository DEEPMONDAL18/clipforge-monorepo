import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

/** Dark/light switch. Dark is the default appearance. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11 rounded-lg text-muted-foreground hover:text-foreground"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
