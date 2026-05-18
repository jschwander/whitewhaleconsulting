'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!profileLoading && (!user || !isAdmin)) {
      router.replace('/admin');
    }
  }, [user, isAdmin, profileLoading, router]);

  if (profileLoading || !user || !isAdmin) {
    return (
      <div className="pt-16 md:pt-20 bg-page min-h-screen">
        <p className="max-w-3xl mx-auto px-6 py-20 text-sm text-slate-500">
          Loading…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
