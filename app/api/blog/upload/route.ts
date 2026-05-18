import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { getAdminStorage } from '@/lib/firebase/admin';

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const storage = getAdminStorage();
  if (!storage) {
    return NextResponse.json(
      { error: 'Firebase Storage is not configured.' },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const folder = String(formData.get('folder') ?? '_drafts').replace(/[^a-zA-Z0-9_/-]/g, '');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 10 MB.' }, { status: 400 });
  }

  const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(0, 80);
  const path = `blog/${folder}/${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const bucket = storage.bucket();
  const object = bucket.file(path);
  await object.save(buffer, {
    metadata: { contentType: file.type || 'image/jpeg' },
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;

  return NextResponse.json({ url });
}
