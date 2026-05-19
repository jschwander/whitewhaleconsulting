'use client';

import AppLink from '@/components/AppLink';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  // Home: always dark header (no scroll transition = no jitter). Other pages: light header.
  const overHero = pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        overHero
          ? 'bg-navy/95 border-b border-white/10 md:bg-navy/80 md:backdrop-blur-md'
          : 'bg-white border-b border-slate-200 shadow-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 h-16 md:h-20 flex items-center justify-between">
        <AppLink href="/" className="flex items-center shrink-0" aria-label="White Whale Consulting – Home">
          <Image
            src={overHero ? '/assets/logo.png' : '/assets/logodark.png'}
            alt="White Whale Consulting"
            width={56}
            height={56}
            className="h-12 w-auto object-contain md:h-14"
          />
        </AppLink>
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map(({ href, label }) => (
            <AppLink
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-px after:w-0 after:bg-teal after:transition-[width] after:duration-200 hover:after:w-full ${
                overHero
                  ? 'text-white hover:text-ivory'
                  : 'text-navy-heading hover:text-navy-heading/80'
              }`}
            >
              {label}
            </AppLink>
          ))}
          <AppLink
            href="/contact"
            className="ml-2 inline-flex items-center px-6 py-2.5 rounded-md bg-teal text-white font-semibold text-sm hover:bg-teal-light transition-colors duration-300"
          >
            Book a Call
          </AppLink>
        </nav>
        {/* Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <AppLink
            href="/contact"
            className="inline-flex items-center px-4 py-2 rounded-md bg-teal text-white font-semibold text-sm hover:bg-teal-light transition-colors"
          >
            Book a Call
          </AppLink>
          <AppLink
            href="/"
            className={`text-sm transition-colors duration-300 ${overHero ? 'text-white hover:text-ivory' : 'text-navy-heading hover:text-navy-heading/80'}`}
          >
            Menu
          </AppLink>
        </div>
      </div>
    </header>
  );
}
