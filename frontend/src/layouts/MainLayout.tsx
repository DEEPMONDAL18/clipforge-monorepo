import { Clock, Scissors, ShieldCheck } from 'lucide-react';
import React from 'react';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
                ClipForge
              </h1>
              <p className="text-xs text-slate-400">Lossless Video Splitting Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Lossless Quality</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>1-Hour Auto Delete</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 bg-slate-950/40 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} ClipForge SaaS Platform. All files automatically deleted
            after 60 minutes.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#docs" className="hover:text-slate-300 transition-colors">
              Documentation
            </a>
            <a href="#api" className="hover:text-slate-300 transition-colors">
              API Contract
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
