import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authTokenKey = process.env.NEXT_PUBLIC_COOKIE_AUTH_TOKEN!;
  const userRoleKey = process.env.NEXT_PUBLIC_COOKIE_USER_ROLE!;
  const authToken = request.cookies.get(authTokenKey)?.value;
  const adminRole = request.cookies.get(userRoleKey)?.value;

  // Redirect authenticated users away from login/signup pages
  if ((pathname === '/login' || pathname === '/signup') && authToken) {
    // Check if user has admin role and redirect accordingly
    const hasAdminRole = adminRole === 'admin' || adminRole === 'super_admin' || adminRole === 'owner';
    if (hasAdminRole) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/plans', request.url));
    }
  }

  // Allow access to login and signup pages without authentication
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.next();
  }

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check if user has admin role
    const hasAdminRole = adminRole === 'admin' || adminRole === 'super_admin' || adminRole === 'owner';
    if (!hasAdminRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect client routes that require authentication
  if (pathname.startsWith('/redeem') || pathname === '/profile' || pathname === '/plans' || pathname === '/home' || pathname === '/schedule') {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/redeem',
    '/redeem/:path*',
    '/profile',
    '/plans'
  ],
};
