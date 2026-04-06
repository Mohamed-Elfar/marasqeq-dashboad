import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Get session from cookie
  const session = request.cookies.get('supabase-auth-token');

  // If trying to access protected route without session, redirect to login
  if (!isPublicRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (isPublicRoute && session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboards', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.svg (metadata files)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
