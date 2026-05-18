'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { verifyAdminSession } from '@/lib/auth/session';
import { normalizeSlug, slugifyTitle } from '@/lib/blog/slug';
import { formatDateForInput } from '@/lib/blog/dates';
import { parseDateInput } from '@/lib/blog/dates-server';
import type { BlogPostInput } from '@/lib/blog/types';
import { getAdminDb } from '@/lib/firebase/admin';

export type BlogActionResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

async function requireAdmin() {
  const session = await verifyAdminSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function publishBlogPost(
  input: BlogPostInput
): Promise<BlogActionResult> {
  try {
    const session = await requireAdmin();
    const db = getAdminDb();
    if (!db) {
      return { ok: false, error: 'Server is not configured for Firebase Admin.' };
    }

    const trimmedTitle = input.title.trim();
    const trimmedSlug = normalizeSlug(
      input.slug.trim() || slugifyTitle(trimmedTitle)
    );
    const trimmedAuthor = input.author.trim();
    const trimmedExcerpt = input.excerpt.trim();
    const bodyHtml = input.body.trim();

    if (!trimmedTitle) return { ok: false, error: 'Title is required.' };
    if (!trimmedAuthor) return { ok: false, error: 'Author is required.' };
    if (!trimmedExcerpt) {
      return { ok: false, error: 'Excerpt is required (shown on the blog index).' };
    }
    if (!bodyHtml || bodyHtml === '<p></p>') {
      return { ok: false, error: 'Post body cannot be empty.' };
    }

    const isCreate = !input.originalSlug;
    const originalSlug = input.originalSlug?.trim() ?? '';

    if (isCreate) {
      const existing = await db.collection('blogPosts').doc(trimmedSlug).get();
      if (existing.exists) {
        return {
          ok: false,
          error:
            'A post with this URL slug already exists. Change the slug or title.',
        };
      }
    } else if (trimmedSlug !== originalSlug) {
      const existing = await db.collection('blogPosts').doc(trimmedSlug).get();
      if (existing.exists) {
        return { ok: false, error: 'That URL slug is already taken.' };
      }
      await db.collection('blogPosts').doc(originalSlug).delete();
    }

    const payload: Record<string, unknown> = {
      title: trimmedTitle,
      excerpt: trimmedExcerpt,
      body: bodyHtml,
      author: trimmedAuthor,
      coverImage: input.coverImage?.trim() || null,
      publishedAt: parseDateInput(input.publishedDate),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: session.uid,
    };

    if (isCreate) {
      payload.createdAt = FieldValue.serverTimestamp();
      payload.createdBy = session.uid;
    }

    await db.collection('blogPosts').doc(trimmedSlug).set(payload, { merge: true });
    return { ok: true, slug: trimmedSlug };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to publish post.';
    if (message === 'Unauthorized') {
      return { ok: false, error: 'You must be signed in as an admin.' };
    }
    return { ok: false, error: message };
  }
}

export async function deleteBlogPost(slug: string): Promise<BlogActionResult> {
  try {
    await requireAdmin();
    const db = getAdminDb();
    if (!db) {
      return { ok: false, error: 'Server is not configured for Firebase Admin.' };
    }

    const trimmed = slug.trim();
    if (!trimmed) return { ok: false, error: 'Invalid slug.' };

    await db.collection('blogPosts').doc(trimmed).delete();
    return { ok: true, slug: trimmed };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to delete post.';
    if (message === 'Unauthorized') {
      return { ok: false, error: 'You must be signed in as an admin.' };
    }
    return { ok: false, error: message };
  }
}

export async function getBlogPostForEdit(slug: string) {
  const session = await verifyAdminSession();
  if (!session) return null;

  const db = getAdminDb();
  if (!db) return null;

  const doc = await db.collection('blogPosts').doc(slug).get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    slug: doc.id,
    title: data.title ?? '',
    author: data.author ?? '',
    excerpt: data.excerpt ?? '',
    body: data.body ?? '',
    coverImage: data.coverImage ?? data.featuredImage ?? '',
    publishedDate: formatDateForInput(data.publishedAt),
  };
}
