import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { CANONICAL_SITE_URL } from '@/lib/site';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  icons: {
    icon: [{ url: '/assets/whalefavicon.png', sizes: '512x512', type: 'image/png' }],
    apple: [{ url: '/assets/whalefavicon.png', sizes: '512x512', type: 'image/png' }],
  },
  title: 'White Whale Consulting | Clarity Beneath the Surface',
  description:
    'We help leaders get beneath the surface—coaching, strategic planning, and conflict resolution so teams can move forward with clarity.',
  openGraph: {
    title: 'White Whale Consulting',
    description: 'Clarity Beneath the Surface. Coaching • Strategic Planning • Conflict Resolution.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-page">
        <ScrollToTop />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
