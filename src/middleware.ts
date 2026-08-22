import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

// Define public routes explicitly
const publicRoutes = [
  '/', 
  '/login', 
  '/api/auth/company-signup', 
  '/api/auth/login', 
  '/api/auth/verify'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = request.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // 1. Redirect unauthenticated users trying to access protected routes
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 2. The isFirstLogin Staleness/Redirect Trap
  // If user is logged in, their JWT says it's their first login, and they aren't already on the reset page
  if (
    session && 
    session.isFirstLogin && 
    path !== '/reset-password' && 
    path !== '/api/auth/reset-password'
  ) {
    return NextResponse.redirect(new URL('/reset-password', request.nextUrl));
  }

  // 3. Redirect authenticated users away from public auth pages
  if (session && path === '/login') {
    // If they still need to reset password, force them there instead of dashboard
    if (session.isFirstLogin) {
      return NextResponse.redirect(new URL('/reset-password', request.nextUrl));
    }
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

// Ensure middleware applies everywhere except static files and Next.js internal routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
