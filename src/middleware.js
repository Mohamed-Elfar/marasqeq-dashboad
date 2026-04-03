import { NextResponse } from 'next/server';
export function middleware(request) {
  const response = NextResponse.next();

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/content-management/pages/home', request.url));
  }
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/:path*', '/']
};
export { default } from 'next-auth/middleware';