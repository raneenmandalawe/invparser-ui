'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (getAuth()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-slate-500">Redirecting...</p>
    </div>
  );
}
