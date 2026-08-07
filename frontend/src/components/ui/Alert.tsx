import React from 'react';
import { cn } from '../../lib/utils.js';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'warning' | 'error';
}

export const Alert: React.FC<AlertProps> = ({
  children,
  className,
  variant = 'info',
  ...props
}) => {
  const styles = {
    info: 'bg-sky-950/30 text-sky-200 border-sky-800/50',
    warning: 'bg-amber-950/30 text-amber-200 border-amber-800/50',
    error: 'bg-rose-950/30 text-rose-200 border-rose-800/50'
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border text-sm flex items-start gap-3',
        styles[variant],
        className
      )}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
};
