'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { isFirebaseConfigured } from '@/lib/firebase/client';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const next = searchParams.get('next') || '/blog/new';

  if (!loading && user && isAdmin) {
    router.replace(next);
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signIn(email, password);
      router.replace(next);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sign-in failed. Check your credentials.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/assets/logodark.png"
            alt="White Whale Consulting"
            width={64}
            height={64}
            className="h-16 w-auto object-contain"
          />
          <h1 className="mt-6 font-serif text-4xl text-navy-heading sm:text-5xl">
            Admin access
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to create and edit blog posts.
          </p>
        </div>

        {!isFirebaseConfigured() ? (
          <p className="mt-10 text-center text-sm text-red-600" role="alert">
            Firebase is not configured. Copy <code className="text-xs">.env.example</code>{' '}
            to <code className="text-xs">.env.local</code> and add your project keys.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-10 space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              disabled={busy}
              className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-teal focus:ring-2 focus:ring-teal/30 disabled:opacity-60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={busy}
              className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-teal focus:ring-2 focus:ring-teal/30 disabled:opacity-60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? (
            <p className="text-center text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-teal py-3 text-sm font-semibold text-white hover:bg-teal-light transition-colors disabled:opacity-60"
          >
            {busy ? 'Please wait…' : 'Log in'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-teal">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-page text-slate-500 text-sm">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
