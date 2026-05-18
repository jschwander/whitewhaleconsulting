'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config';

let app: FirebaseApp | null = null;

function getApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export const auth: Auth | null = (() => {
  const a = getApp();
  return a ? getAuth(a) : null;
})();

export const db: Firestore | null = (() => {
  const a = getApp();
  return a ? getFirestore(a) : null;
})();

export { isFirebaseConfigured };
