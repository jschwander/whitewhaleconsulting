import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import BlogEditorForm from '@/components/blog/BlogEditorForm';
import RequireAdmin from '@/components/blog/RequireAdmin';

export const metadata = {
  title: 'New post | White Whale Consulting',
  robots: { index: false },
};

export default async function NewBlogPostPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin?next=/blog/new');
  }

  return (
    <RequireAdmin>
      <BlogEditorForm mode="create" />
    </RequireAdmin>
  );
}
