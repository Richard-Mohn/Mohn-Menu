/**
 * proxy.ts — Next.js 16 convention (replaces middleware.ts)
 * 
 * Custom domain routing for multi-tenant SEO websites.
 * 
 * Flow:
 * 1. Customer visits chinawok.com
 * 2. DNS CNAME → Firebase App Hosting URL
 * 3. Cloud Run receives request with x-forwarded-host: chinawok.com
 * 4. proxy.ts detects it's NOT the main domain
 * 5. Resolves domain → slug via /api/resolve-domain
 * 6. Rewrites all URLs to the /{slug}/* route tree
 * 7. Sets x-custom-domain and x-business-slug headers
 * 
 * On the main platform domain, requests pass through unchanged.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isMainDomain } from '@/lib/tenant-links';

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - api (API routes)
     * - static files (favicon.ico, images, etc.)
     */
    '/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
};

export default async function proxy(request: NextRequest) {
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // If this is the main platform domain, pass through
  if (isMainDomain(hostname)) {
    return NextResponse.next();
  }

  // ─── Custom Domain Detected ───────────────────────────────────────

  // Protect platform-only routes on custom domains
  const platformRoutes = ['/login', '/register', '/dashboard', '/owner', '/driver', '/customer', '/admin', '/logout'];
  if (platformRoutes.some(route => pathname.startsWith(route))) {
    // Redirect to main platform domain
    const mainUrl = new URL(pathname, `https://mohnmenu.com`);
    return NextResponse.redirect(mainUrl, 307);
  }

  // Resolve the custom domain to a business slug
  try {
    const resolveUrl = new URL('/api/resolve-domain', request.url);
    resolveUrl.searchParams.set('domain', hostname);
    
    const response = await fetch(resolveUrl.toString());
    
    if (!response.ok) {
      // Domain not found — show 404 or redirect to main site
      return NextResponse.next();
    }

    const { slug } = await response.json();

    if (!slug) {
      return NextResponse.next();
    }

    // ─── Rewrite Rules ─────────────────────────────────────────────
    const url = request.nextUrl.clone();
    
    if (pathname === '/' || pathname === '') {
      url.pathname = `/${slug}`;
    } else if (pathname === '/about' || pathname === '/about/') {
      url.pathname = `/${slug}/about`;
    } else if (pathname === '/contact' || pathname === '/contact/') {
      url.pathname = `/${slug}/contact`;
    } else if (pathname === '/menu' || pathname === '/menu/') {
      url.pathname = `/${slug}/menu`;
    } else if (pathname.startsWith('/services/')) {
      url.pathname = `/${slug}${pathname}`;
    } else if (pathname === '/order' || pathname === '/order/') {
      url.pathname = `/order/${slug}`;
    } else {
      // Catch-all: could be a location page like /richmond-va
      url.pathname = `/${slug}${pathname}`;
    }

    // Set headers so server components know this is a custom domain request
    const rewriteResponse = NextResponse.rewrite(url);
    rewriteResponse.headers.set('x-custom-domain', '1');
    rewriteResponse.headers.set('x-business-slug', slug);
    
    return rewriteResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.next();
  }
}
