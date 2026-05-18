/** Client-safe date helpers (no firebase-admin imports). */

export function formatDateForInput(value?: unknown): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  let d: Date;
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    d = (value as { toDate: () => Date }).toDate();
  } else if (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    typeof (value as { seconds: number }).seconds === 'number'
  ) {
    d = new Date((value as { seconds: number }).seconds * 1000);
  } else if (typeof value === 'string') {
    d = new Date(value);
  } else if (value instanceof Date) {
    d = value;
  } else {
    d = new Date();
  }
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatPostDate(value: unknown): string {
  if (!value) return '';
  let d: Date;
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    d = (value as { toDate: () => Date }).toDate();
  } else if (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    typeof (value as { seconds: number }).seconds === 'number'
  ) {
    d = new Date((value as { seconds: number }).seconds * 1000);
  } else if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      d = parsed;
    } else {
      return value;
    }
  } else {
    return '';
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function timestampToIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    typeof (value as { seconds: number }).seconds === 'number'
  ) {
    return new Date((value as { seconds: number }).seconds * 1000).toISOString();
  }
  if (typeof value === 'string') return value;
  return undefined;
}

export function toMillis(value: unknown): number {
  if (!value) return 0;
  if (
    typeof value === 'object' &&
    value !== null &&
    'toMillis' in value &&
    typeof (value as { toMillis: () => number }).toMillis === 'function'
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    typeof (value as { seconds: number }).seconds === 'number'
  ) {
    return (value as { seconds: number }).seconds * 1000;
  }
  if (typeof value === 'string') return Date.parse(value) || 0;
  return 0;
}
