import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * TAD §10: middleware.ts is the ACTUAL auth gate for /admin/*. A client-side
 * redirect in AuthProvider alone is never sufficient, this runs server-side
 * before any /admin page renders.
 *
 * This only checks for the refresh cookie's PRESENCE, not its validity, the
 * cookie is httpOnly and set by the backend (auth.controller.js), so this
 * middleware cannot decode or verify it without calling the backend, and
 * doing that on every navigation would be slow. AuthProvider's mount-time
 * POST /auth/refresh (TAD §5) is what actually confirms the cookie is still
 * valid; if it isn't, AuthProvider redirects to /login itself. This
 * middleware's job is narrower: stop an anonymous visitor with no cookie at
 * all from ever seeing the /admin shell render.
 */
const REFRESH_COOKIE_NAME = 'refreshToken';

export function middleware(request: NextRequest) {
  const hasRefreshCookie = request.cookies.has(REFRESH_COOKIE_NAME);

  if (!hasRefreshCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  // TAD §10: X-Robots-Tag: noindex on all /admin/* responses.
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
