import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * TAD §10: X-Robots-Tag noindex on all /admin/* responses.
 *
 * NOTE: The original cookie-presence check has been removed. The refreshToken
 * cookie is set on the backend domain (Render) and is never present on the
 * frontend domain (Netlify) — cross-origin cookies are scoped to the domain
 * that set them and are never visible to Next.js middleware running on a
 * different domain. Relying on it caused a permanent redirect loop to /login
 * after every successful login.
 *
 * The actual auth gate is handled in two places:
 *   1. AuthProvider (lib/auth/AuthProvider.tsx): calls POST /auth/refresh on
 *      mount for /admin/* paths and sets status to 'unauthenticated' if it
 *      fails, which triggers router.replace('/login') in AdminLayout.
 *   2. AdminLayout (app/admin/layout.tsx): useEffect redirects to /login
 *      whenever status === 'unauthenticated'.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
