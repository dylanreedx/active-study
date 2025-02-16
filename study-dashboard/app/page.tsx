// make a simple hero section with a modern clean heading and a link to the dashboard

import React from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-white mb-4'>
          Use convenient active recall to prepare for your next test.
        </h1>
        <Link href='/dashboard'>
          <Button>Start Studying</Button>
        </Link>
      </div>
    </div>
  );
}
