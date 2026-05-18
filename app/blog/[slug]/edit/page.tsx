import { notFound, redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { getBlogPostForEdit } from '@/app/actions/blog';
import BlogEditorForm from '@/components/blog/BlogEditorForm';
import RequireAdmin from '@/components/blog/RequireAdmin';

type Props = { params: { slug: string } };

export const metadata = {
  title: 'Edit post | White Whale Consulting',
  robots: { index: false },
};

export default async function EditBlogPostPage({ params }: Props) {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect(`/admin?next=/blog/${encodeURIComponent(params.slug)}/edit`);
  }

  const initial = await getBlogPostForEdit(params.slug);
  if (!initial) notFound();

  return (
    <RequireAdmin>
      <BlogEditorForm mode="edit" initial={initial} />
    </RequireAdmin>
  );
}
