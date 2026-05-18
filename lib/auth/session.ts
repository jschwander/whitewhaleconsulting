import { cookies } from 'next/headers';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getAdminAuth } from '@/lib/firebase/admin';
import { checkIsAdmin } from '@/lib/auth/admin-check';
import { SESSION_COOKIE_NAME } from './constants';

export type AdminSession = {
  uid: string;
  email?: string;
};

export async function verifyAdminSession(): Promise<AdminSession | null> {
  const auth = getAdminAuth();
  if (!auth) return null;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  let decoded: DecodedIdToken;
  try {
    decoded = await auth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }

  const { isAdmin } = await checkIsAdmin(decoded);
  if (!isAdmin) return null;

  return { uid: decoded.uid, email: decoded.email };
}
