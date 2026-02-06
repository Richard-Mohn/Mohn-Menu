import { type NextRequest, NextResponse } from 'next/server';

/**
 * LOCL MIDDLEWARE: Domain-Based Multi-Tenancy Router
 * 
 * How it works:
 * 1. User visits chinawok.com
 * 2. Middleware detects the domain
 * 3. Looks up business in Firestore by domain
 * 4. Rewrites the request to include business context
 * 5. Business data is available throughout the app
 */

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Extract domain without port
  const domain = hostname.split(':')[0];
  
  // Skip middleware for certain paths
  const skipPaths = ['/_next', '/api', '/static', '/public', '/favicon.ico'];
  if (skipPaths.some(path => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 1. Check if this is a custom domain (not platform.locl.com or localhost)
  const isCustomDomain = !domain.includes('localhost') && !domain.startsWith('platform.locl');

  if (isCustomDomain) {
    /**
     * CUSTOM DOMAIN ROUTING
     * Example: chinawok.com -> looks up "china-wok-petersburg" business
     */

    // For now, we'll store a mapping in Firebase
    // Later, you can use Vercel's Edge Config or a database lookup
    
    // Store business identifier in request headers for Next.js to use
    const response = NextResponse.next();
    
    // This header will be available in getServerSideProps and API routes
    response.headers.set('x-business-domain', domain);
    
    // Add a cookie so client-side code knows which business we're on
    response.cookies.set('business-domain', domain, {
      path: '/',
      maxAge: 31536000, // 1 year
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  }

  // 2. Platform domain (platform.locl.com) - Standard routing
  if (domain.includes('platform.locl') || domain.includes('localhost')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
