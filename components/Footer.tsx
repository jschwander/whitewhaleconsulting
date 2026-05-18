import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="White Whale Consulting"
              width={36}
              height={36}
              className="object-contain opacity-90"
            />
            <span className="font-serif text-base text-navy-heading font-medium">
              White Whale Consulting
            </span>
          </div>
          <nav className="flex flex-wrap gap-6">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-slate-600 hover:text-teal text-sm transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-slate-500 text-sm font-serif italic">
          Clarity Beneath the Surface.
        </p>
        <p className="mt-4 text-slate-400 text-xs">
          © {year} White Whale Consulting. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
