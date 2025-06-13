import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/' || 
    path === '/auth/login' || 
    path === '/auth/register' || 
    path === '/auth/forgot-password' ||
    path.startsWith('/api/auth');
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Redirect logic for authenticated users
  if (isPublicPath && token) {
    // If user is already logged in and tries to access public paths, redirect to dashboard
    const role = token.role || 'parent';
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }
  
  // Redirect logic for unauthenticated users
  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected paths, redirect to login
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Role-based access control
  if (token && path.startsWith('/dashboard/')) {
    const role = token.role || 'parent';
    const requestedRole = path.split('/')[2]; // Extract role from path
    
    // If user tries to access a dashboard they don't have permission for
    if (requestedRole !== role && role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }
  
  // Admin-only routes
  if (token && path.startsWith('/admin/') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*'
  ],
};