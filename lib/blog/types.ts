export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  coverImage: string | null;
  publishedAt: string; // ISO date string for serialization
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  author: string;
  publishedDate: string; // YYYY-MM-DD
  excerpt: string;
  coverImage: string | null;
  body: string;
  originalSlug?: string;
};
