import React from 'react';
import { cn } from '../../lib/utils.js';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
}

export const Progress: React.FC<ProgressProps> = ({ value, className, ...props }) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('h-2.5 w-full bg-slate-800 rounded-full overflow-hidden', className)}
      {...props}
    >
      <div
        className="h-full bg-sky-500 transition-all duration-300 ease-out rounded-full"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
};
