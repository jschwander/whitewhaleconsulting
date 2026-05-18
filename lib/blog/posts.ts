import type { DocumentData } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase/admin';
import type { BlogPost } from './types';
import { formatPostDate, timestampToIso, toMillis } from './dates';

function docToPost(slug: string, data: DocumentData): BlogPost {
  return {
    slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    body: data.body ?? '',
    author: data.author ?? '',
    coverImage: data.coverImage ?? data.featuredImage ?? null,
    publishedAt:
      timestampToIso(data.publishedAt) ??
      timestampToIso(data.createdAt) ??
      new Date().toISOString(),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const db = getAdminDb();
  if (!db) return [];

  try {
    const snap = await db.collection('blogPosts').get();
    const posts = snap.docs.map((doc) => docToPost(doc.id, doc.data()));
    posts.sort((a, b) => toMillis(b.publishedAt) - toMillis(a.publishedAt));
    return posts;
  } catch (err) {
    console.error('[blog] getAllBlogPosts failed:', err);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = getAdminDb();
  if (!db) return null;

  try {
    const doc = await db.collection('blogPosts').doc(slug).get();
    if (!doc.exists) return null;
    return docToPost(doc.id, doc.data()!);
  } catch (err) {
    console.error('[blog] getBlogPostBySlug failed:', err);
    return null;
  }
}

export { formatPostDate };
