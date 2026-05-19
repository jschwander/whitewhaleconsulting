'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const AuthProvider = dynamic(
  () => import('@/context/AuthProvider').then((m) => m.AuthProvider),
  { ssr: false }
);

/** Only load Firebase Auth on routes that need sign-in or the blog editor. */
function routeNeedsAuth(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return true;
  if (pathname === '/blog/new') return true;
  if (/^\/blog\/[^/]+\/edit$/.test(pathname)) return true;
  return false;
}

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (routeNeedsAuth(pathname)) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return <>{children}</>;
}
