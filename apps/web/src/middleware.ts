import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/signup', '/blogs'];
const protectedRoutes = ['/blogs/new', '/blogs/edit'];
const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? 'auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/api/auth');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
// Routes Middleware should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API routes should handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (*.png, *.jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)' 
  ],
};
