import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | White Whale Consulting',
  description:
    'Get in touch with White Whale Consulting. Confidential consultations available.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
