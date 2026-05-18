'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';

export default function BlogPostEditLink({ slug }: { slug: string }) {
  const { isAdmin, profileLoading } = useAuth();

  if (profileLoading || !isAdmin) return null;

  return (
    <Link
      href={`/blog/${slug}/edit`}
      className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-teal"
    >
      Edit
    </Link>
  );
}
