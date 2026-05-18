import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, formatPostDate } from '@/lib/blog/posts';
import BlogPostBody from '@/components/blog/BlogPostBody';
import BlogPostEditLink from '@/components/blog/BlogPostEditLink';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: `${post.title} | White Whale Consulting`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const dateLabel = formatPostDate(post.publishedAt);

  return (
    <div className="pt-16 md:pt-20 bg-page min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/blog"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-teal"
          >
            ← Blog
          </Link>
          <BlogPostEditLink slug={post.slug} />
        </div>

        {post.coverImage ? (
          <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-md border border-slate-200">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}

        <p className="mt-6 text-xs uppercase tracking-wide text-slate-500">
          {post.author}
          {dateLabel ? ` · ${dateLabel}` : ''}
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl text-navy-heading leading-tight">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">{post.excerpt}</p>
        ) : null}

        <div className="mt-10">
          <BlogPostBody html={post.body} />
        </div>
      </article>
    </div>
  );
}
