import React from 'react';

import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Faq } from '@/components/landing/Faq';
import { Workspace } from '@/components/workspace/Workspace';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col space-y-12">
      <Hero />
      <div className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Workspace />
      </div>
      <Features />
      <Faq />
    </div>
  );
};
