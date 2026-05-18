'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import LinkExtension from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import RichTextToolbar from './RichTextToolbar';
import { useAuth } from '@/context/AuthProvider';
import { slugifyTitle, normalizeSlug } from '@/lib/blog/slug';
import { uploadBlogImage } from '@/lib/blog/upload';
import { publishBlogPost, deleteBlogPost } from '@/app/actions/blog';
import { formatDateForInput } from '@/lib/blog/dates';

const fieldClass =
  'w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/30';
const labelClass =
  'mb-2 block text-sm font-medium text-slate-600';

export type BlogEditorInitial = {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  body: string;
  coverImage: string;
  publishedDate: string;
};

type Props = {
  mode: 'create' | 'edit';
  initial?: BlogEditorInitial;
};

export default function BlogEditorForm({ mode, initial }: Props) {
  const router = useRouter();
  const { user, isAdmin, profileLoading } = useAuth();
  const featuredInputId = useId();
  const isCreate = mode === 'create';

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [publishedDate, setPublishedDate] = useState(
    initial?.publishedDate ?? formatDateForInput()
  );
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false);

  const slugTouched = useRef(false);
  const originalSlug = useRef(initial?.slug ?? '');

  const uploadFolder =
    slug.trim() || originalSlug.current || `_drafts/${user?.uid ?? 'anonymous'}`;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Placeholder.configure({ placeholder: 'Write your post…' }),
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension.configure({ allowBase64: false }),
    ],
    content: initial?.body || '<p></p>',
    editorProps: {
      attributes: {
        class: 'ProseMirror min-h-[280px] px-4 py-3 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!isCreate || slugTouched.current) return;
    setSlug(slugifyTitle(title));
  }, [title, isCreate]);

  useEffect(() => {
    if (isCreate && user && !author) {
      setAuthor(user.displayName || user.email?.split('@')[0] || 'White Whale');
    }
  }, [isCreate, user, author]);

  useEffect(() => {
    if (initial?.body && editor) {
      editor.commands.setContent(initial.body, { emitUpdate: false });
    }
  }, [initial?.body, editor]);

  const insertBodyImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploadingBodyImage(true);
      setError('');
      try {
        const url = await uploadBlogImage(file, uploadFolder);
        editor.chain().focus().setImage({ src: url, alt: '' }).run();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Image upload failed.');
      } finally {
        setUploadingBodyImage(false);
      }
    };
    input.click();
  }, [editor, uploadFolder]);

  async function onCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError('');
    try {
      const url = await uploadBlogImage(file, uploadFolder);
      setCoverImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cover image upload failed.');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const result = await publishBlogPost({
      title,
      slug: normalizeSlug(slug.trim() || slugifyTitle(title)),
      author,
      publishedDate,
      excerpt,
      coverImage: coverImage.trim() || null,
      body: editor?.getHTML() ?? '',
      originalSlug: isCreate ? undefined : originalSlug.current,
    });

    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/blog/${result.slug}`);
    router.refresh();
  }

  async function handleDelete() {
    if (isCreate || !originalSlug.current) return;
    if (
      !window.confirm('Delete this post permanently? This cannot be undone.')
    ) {
      return;
    }
    setSaving(true);
    const result = await deleteBlogPost(originalSlug.current);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push('/blog');
    router.refresh();
  }

  if (profileLoading) {
    return (
      <div className="pt-16 md:pt-20 bg-page min-h-screen">
        <p className="max-w-3xl mx-auto px-6 py-20 text-sm text-slate-500">
          Loading…
        </p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="pt-16 md:pt-20 bg-page min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-teal"
          >
            ← Back to blog
          </Link>
          {!isCreate && originalSlug.current ? (
            <Link
              href={`/blog/${originalSlug.current}`}
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-teal"
            >
              View published post
            </Link>
          ) : null}
        </div>

        <h1 className="mt-4 font-serif text-4xl text-navy-heading sm:text-5xl">
          {isCreate ? 'New blog post' : 'Edit blog post'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Compose your article, add images, then publish. It will appear on the
          blog immediately.
        </p>

        <form onSubmit={handlePublish} className="mt-10 space-y-6">
          <div>
            <label className={labelClass} htmlFor="blog-title">
              Title <span className="text-teal">*</span>
            </label>
            <input
              id="blog-title"
              className={fieldClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="blog-slug">
              URL slug
            </label>
            <div className="flex items-center gap-2 font-mono text-sm text-slate-500">
              <span>/blog/</span>
              <input
                id="blog-slug"
                className={`${fieldClass} font-mono`}
                value={slug}
                onChange={(e) => {
                  slugTouched.current = true;
                  setSlug(normalizeSlug(e.target.value));
                }}
                placeholder="my-post-slug"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="blog-author">
                Author <span className="text-teal">*</span>
              </label>
              <input
                id="blog-author"
                className={fieldClass}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="blog-date">
                Post date <span className="text-teal">*</span>
              </label>
              <input
                id="blog-date"
                type="date"
                className={fieldClass}
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="blog-excerpt">
              Excerpt <span className="text-teal">*</span>
            </label>
            <textarea
              id="blog-excerpt"
              className={`${fieldClass} min-h-[88px] resize-y`}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for the blog listing page"
              required
            />
          </div>

          <div>
            <span className={labelClass}>Cover image</span>
            <div className="flex flex-wrap items-start gap-4">
              {coverImage ? (
                <div className="relative aspect-[16/9] w-full max-w-sm overflow-hidden rounded-md border border-slate-200">
                  <Image
                    src={coverImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 384px) 100vw, 384px"
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <input
                  id={featuredInputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onCoverImageChange}
                />
                <label
                  htmlFor={featuredInputId}
                  className={`inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-navy-heading hover:border-teal ${
                    uploadingCover ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  {uploadingCover
                    ? 'Uploading…'
                    : coverImage
                      ? 'Replace cover image'
                      : 'Upload cover image'}
                </label>
                {coverImage ? (
                  <button
                    type="button"
                    className="text-left text-xs text-slate-500 underline"
                    onClick={() => setCoverImage('')}
                  >
                    Remove cover image
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <span className={labelClass}>
              Post body <span className="text-teal">*</span>
            </span>
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
              {editor ? (
                <RichTextToolbar editor={editor} onInsertImage={insertBodyImage} />
              ) : null}
              <EditorContent editor={editor} />
            </div>
            {uploadingBodyImage ? (
              <p className="mt-1 text-xs text-slate-500">Uploading image…</p>
            ) : null}
          </div>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2.5 rounded-md bg-teal text-white font-semibold text-sm hover:bg-teal-light transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing…' : isCreate ? 'Publish post' : 'Save changes'}
            </button>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-2.5 rounded-md border border-slate-200 text-navy-heading font-semibold text-sm hover:border-teal transition-colors"
            >
              Cancel
            </Link>
            {!isCreate ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="ml-auto text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                Delete post
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
