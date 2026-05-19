import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APEX_HOST, CANONICAL_HOST } from '@/lib/site';

/**
 * Redirect apex → www only. Never redirects www → apex.
 * Catches RSC requests (?_rsc=) that must not be served from the naked domain.
 */
export function middleware(request: NextRequest) {
  const hostHeader =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    '';
  const hostname = hostHeader.split(',')[0]?.trim().split(':')[0]?.toLowerCase() ?? '';

  if (hostname === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
