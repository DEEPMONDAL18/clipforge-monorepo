import React from 'react';
import { cn } from '../../lib/utils.js';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const base = 'rounded-xl border p-6 transition-all duration-200';
  const styles = {
    default: 'bg-slate-900/80 border-slate-800 shadow-xl',
    glass: 'bg-slate-900/40 backdrop-blur-md border-slate-800/80 shadow-2xl'
  };

  return (
    <div className={cn(base, styles[variant], className)} {...props}>
      {children}
    </div>
  );
};
