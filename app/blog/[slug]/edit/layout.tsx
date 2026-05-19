import { AuthProvider } from '@/context/AuthProvider';

export default function EditPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
