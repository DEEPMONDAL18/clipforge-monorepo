import React, { useState } from 'react';
import { MainLayout } from './layouts/MainLayout.js';
import { HomePage } from './pages/HomePage.js';
import { JobStatusPage } from './pages/JobStatusPage.js';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'status'>('home');

  return (
    <MainLayout>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            currentTab === 'home'
              ? 'bg-sky-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setCurrentTab('home')}
        >
          Create Job
        </button>
        <button
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            currentTab === 'status'
              ? 'bg-sky-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setCurrentTab('status')}
        >
          Job Status (Mock View)
        </button>
      </div>

      {currentTab === 'home' ? <HomePage /> : <JobStatusPage />}
    </MainLayout>
  );
};

export default App;
