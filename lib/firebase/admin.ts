import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let adminApp: App | null = null;

function normalizeServiceAccount(raw: Record<string, unknown>) {
  const privateKey = raw.private_key;
  if (typeof privateKey === 'string' && privateKey.includes('\\n')) {
    raw.private_key = privateKey.replace(/\\n/g, '\n');
  }
  return raw;
}

function parseServiceAccountJson(json: string): Record<string, unknown> | null {
  const trimmed = json.trim();
  try {
    return normalizeServiceAccount(
      JSON.parse(trimmed) as Record<string, unknown>
    );
  } catch {
    // .env may wrap JSON in single quotes
    if (
      (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
      try {
        return normalizeServiceAccount(
          JSON.parse(trimmed.slice(1, -1)) as Record<string, unknown>
        );
      } catch {
        return null;
      }
    }
    return null;
  }
}

function initAdminApp(): App | null {
  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.FIREBASE_PROJECT_ID;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (json) {
    const serviceAccount = parseServiceAccountJson(json);
    if (!serviceAccount) {
      console.error(
        '[firebase-admin] Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON (check quoting in .env.local).'
      );
      return null;
    }
    adminApp = initializeApp({
      credential: cert(serviceAccount as Parameters<typeof cert>[0]),
      projectId:
        (serviceAccount.project_id as string | undefined) ?? projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    return adminApp;
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    return adminApp;
  }

  return null;
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      (process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY)
  );
}

export function getAdminApp(): App | null {
  if (adminApp) return adminApp;
  return initAdminApp();
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminStorage(): Storage | null {
  const app = getAdminApp();
  return app ? getStorage(app) : null;
}
