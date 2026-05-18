/**
 * Set Firebase Auth custom claim role=admin for a user (server-side blog auth).
 *
 * Usage (from project root, with .env.local configured):
 *   node scripts/set-admin-claim.mjs <firebase-auth-uid>
 */
import { readFileSync } from 'fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node scripts/set-admin-claim.mjs <firebase-auth-uid>');
  process.exit(1);
}

const line = readFileSync('.env.local', 'utf8')
  .split('\n')
  .find((l) => l.startsWith('FIREBASE_SERVICE_ACCOUNT_KEY='));
if (!line) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT_KEY in .env.local');
  process.exit(1);
}

const sa = JSON.parse(line.slice('FIREBASE_SERVICE_ACCOUNT_KEY='.length));
if (sa.private_key?.includes('\\n')) {
  sa.private_key = sa.private_key.replace(/\\n/g, '\n');
}

initializeApp({ credential: cert(sa), projectId: sa.project_id });
await getAuth().setCustomUserClaims(uid, { role: 'admin' });
console.log('Set custom claim role=admin for', uid);
console.log('User must sign out and sign in again for the claim to appear on ID tokens.');
