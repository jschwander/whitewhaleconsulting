import type { DecodedIdToken } from 'firebase-admin/auth';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';

export type AdminCheckSource =
  | 'custom_claim'
  | 'env_uid'
  | 'firestore'
  | 'none';

export type AdminCheckResult = {
  isAdmin: boolean;
  source: AdminCheckSource;
};

function adminUidsFromEnv(): string[] {
  return (process.env.ADMIN_UIDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasAdminCustomClaim(decoded: DecodedIdToken): boolean {
  const role = decoded.role;
  if (role === 'admin') return true;
  if (decoded.admin === true) return true;
  return false;
}

async function adminFromFirestore(uid: string): Promise<boolean> {
  const db = getAdminDb();
  if (!db) return false;
  const profile = await db.collection('users').doc(uid).get();
  return profile.exists && profile.data()?.role === 'admin';
}

/**
 * Server-side admin check. Order: custom claims → ADMIN_UIDS env → Firestore.
 * Firestore may fail if the service account lacks Datastore/Firestore IAM roles.
 */
export async function checkIsAdmin(
  decoded: DecodedIdToken
): Promise<AdminCheckResult> {
  if (hasAdminCustomClaim(decoded)) {
    return { isAdmin: true, source: 'custom_claim' };
  }

  if (adminUidsFromEnv().includes(decoded.uid)) {
    return { isAdmin: true, source: 'env_uid' };
  }

  try {
    const fromFirestore = await adminFromFirestore(decoded.uid);
    if (fromFirestore) {
      return { isAdmin: true, source: 'firestore' };
    }
    return { isAdmin: false, source: 'none' };
  } catch (err) {
    console.error('[auth] Firestore admin check failed:', formatError(err));
    console.error(
      '[auth] Grant the service account "Cloud Datastore User" in GCP IAM, set ADMIN_UIDS in .env.local, or set custom claim role=admin on the user.'
    );
    return { isAdmin: false, source: 'none' };
  }
}

/** Sync custom claim from Firestore role when Firestore is readable (optional bootstrap). */
export async function syncAdminCustomClaim(uid: string): Promise<void> {
  const auth = getAdminAuth();
  if (!auth) return;

  try {
    const isAdmin = await adminFromFirestore(uid);
    if (!isAdmin) return;
    await auth.setCustomUserClaims(uid, { role: 'admin' });
    console.info('[auth] Set custom claim role=admin for', uid);
  } catch (err) {
    console.warn('[auth] Could not sync admin custom claim:', formatError(err));
  }
}

export function formatError(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { code?: string; message?: string };
    if (e.code && e.message) return `${e.code}: ${e.message}`;
    if (e.message) return e.message;
  }
  return String(err);
}

export function isFirebaseAuthError(err: unknown): err is { code: string; message: string } {
  return Boolean(
    err &&
      typeof err === 'object' &&
      'code' in err &&
      typeof (err as { code: unknown }).code === 'string' &&
      String((err as { code: string }).code).startsWith('auth/')
  );
}
