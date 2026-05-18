import { NextRequest, NextResponse } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from '@/lib/auth/constants';
import {
  checkIsAdmin,
  formatError,
  isFirebaseAuthError,
  syncAdminCustomClaim,
} from '@/lib/auth/admin-check';
import { getAdminAuth } from '@/lib/firebase/admin';

const isDev = process.env.NODE_ENV === 'development';

function jsonError(
  message: string,
  status: number,
  extra?: Record<string, string>
) {
  return NextResponse.json(
    { error: message, ...(isDev && extra ? extra : {}) },
    { status }
  );
}

export async function POST(request: NextRequest) {
  const auth = getAdminAuth();

  if (!auth) {
    console.error('[auth/session] Firebase Admin Auth is not configured.');
    return jsonError('Firebase Admin is not configured on the server.', 503);
  }

  let idToken: string | undefined;
  try {
    const body = await request.json();
    idToken = body.idToken;
  } catch (err) {
    console.error('[auth/session] Invalid JSON body:', formatError(err));
    return jsonError('Invalid request body.', 400);
  }

  if (!idToken) {
    return jsonError('Missing idToken.', 400);
  }

  let decoded: DecodedIdToken;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch (err) {
    console.error('[auth/session] verifyIdToken failed:', formatError(err));
    const code = isFirebaseAuthError(err) ? err.code : 'auth/unknown';
    return jsonError('Invalid or expired sign-in token.', 401, {
      code,
      detail: isDev ? formatError(err) : code,
    });
  }

  const { isAdmin, source } = await checkIsAdmin(decoded);
  if (!isAdmin) {
    console.warn('[auth/session] Access denied for uid:', decoded.uid, {
      email: decoded.email,
      adminCheckSource: source,
    });
    return jsonError(
      'Access denied. Ensure users/{uid} has role "admin", set ADMIN_UIDS, or add custom claim role=admin.',
      403,
      isDev ? { uid: decoded.uid } : undefined
    );
  }

  if (source === 'firestore') {
    await syncAdminCustomClaim(decoded.uid);
  }

  let sessionCookie: string;
  try {
    sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });
  } catch (err) {
    console.error('[auth/session] createSessionCookie failed:', formatError(err));
    const code = isFirebaseAuthError(err) ? err.code : 'auth/unknown';
    return jsonError('Could not create session.', 500, {
      code,
      detail: isDev ? formatError(err) : code,
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_MS / 1000,
    path: '/',
  });
  return response;
}
