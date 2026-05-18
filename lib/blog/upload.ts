/** Upload a blog image via the server (admin session required). */
export async function uploadBlogImage(
  file: File,
  folder: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/blog/upload', {
    method: 'POST',
    body: formData,
  });

  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? 'Image upload failed.');
  }
  if (!data.url) {
    throw new Error('Image upload failed.');
  }
  return data.url;
}
