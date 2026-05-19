import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APEX_HOST, CANONICAL_HOST } from '@/lib/site';

/**
 * Canonical host: www only.
 * Redirects whitewhaleconsulting.com → www.whitewhaleconsulting.com (308).
 * Never redirects www → apex (that would fight Vercel domain settings and loop).
 */
export function middleware(request: NextRequest) {
  const hostHeader =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    '';
  const hostname = hostHeader.split(',')[0]?.trim().split(':')[0]?.toLowerCase() ?? '';

  if (hostname === APEX_HOST) {
    const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(destination, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * All paths except static files and Next internals.
     * API routes on the apex host are redirected to www as well.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
