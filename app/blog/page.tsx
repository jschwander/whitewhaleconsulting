import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts, formatPostDate } from '@/lib/blog/posts';
import BlogAdminActions from '@/components/blog/BlogAdminActions';
import BlogPostEditLink from '@/components/blog/BlogPostEditLink';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog | White Whale Consulting',
  description: 'Insights on leadership, teams, and clarity beneath the surface.',
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="pt-16 md:pt-20 bg-page min-h-screen">
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-slate-500 mb-4">
                Blog
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-navy-heading leading-tight">
                Field notes
              </h1>
              <p className="mt-4 text-slate-600 text-base leading-relaxed max-w-2xl">
                Reflections on leadership, team health, and what lies beneath the
                surface.
              </p>
            </div>
            <BlogAdminActions />
          </div>

          {posts.length === 0 ? (
            <div className="mt-12 border border-dashed border-slate-300 rounded-md p-8 text-center text-sm text-slate-500">
              Check back soon for new articles.
            </div>
          ) : (
            <ul className="mt-12 divide-y divide-slate-200 border-t border-slate-200">
              {posts.map((post) => (
                <li key={post.slug}>
                  <article className="flex gap-4 py-6 sm:gap-6 sm:py-8">
                    {post.coverImage ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative block h-20 w-28 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white sm:h-24 sm:w-36"
                      >
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </Link>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        {post.author}
                        {post.publishedAt
                          ? ` · ${formatPostDate(post.publishedAt)}`
                          : ''}
                      </p>
                      <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                        <h2 className="font-serif text-2xl leading-tight text-navy-heading sm:text-[1.75rem]">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="hover:text-teal transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h2>
                        <BlogPostEditLink slug={post.slug} />
                      </div>
                      {post.excerpt ? (
                        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-2 inline-block text-sm font-semibold text-teal hover:underline"
                      >
                        Read more
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
