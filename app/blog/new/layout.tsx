import { AuthProvider } from '@/context/AuthProvider';

export default function NewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
