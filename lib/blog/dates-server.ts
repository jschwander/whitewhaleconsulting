import { Timestamp } from 'firebase-admin/firestore';

export function parseDateInput(value: string): Timestamp {
  const [y, m, d] = value.split('-').map(Number);
  return Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0));
}
