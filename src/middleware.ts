import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { isAuthenticatedRequest } from './lib/session';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route (excluding login)
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    // Verify admin authentication
    const isAuthenticated = await isAuthenticatedRequest(request);

    if (!isAuthenticated) {
      // Redirect to admin login
      const loginUrl = new URL('/en/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames and admin routes
  matcher: ['/', '/(ar|en)/:path*', '/admin/:path*']
};
