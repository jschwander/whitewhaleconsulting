'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';

export default function BlogAdminActions() {
  const { isAdmin, profileLoading } = useAuth();

  if (profileLoading || !isAdmin) return null;

  return (
    <Link
      href="/blog/new"
      className="inline-flex items-center px-6 py-2.5 rounded-md bg-teal text-white font-semibold text-sm hover:bg-teal-light transition-colors shrink-0"
    >
      + New post
    </Link>
  );
}
