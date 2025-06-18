import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the route is public
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // Get the user's session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token and not on a public route, redirect to login
  if (!token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Get user role and available roles from token
  const userRole = (token as any).role || 'admin';
  const userRoles = (token as any).roles || [userRole];

  // Check if user is accessing a dashboard route
  if (pathname.startsWith('/dashboard/')) {
    const roleFromPath = pathname.split('/')[2]; // e.g., /dashboard/admin -> admin
    
    // If user doesn't have access to this role's dashboard, redirect to their primary role
    if (roleFromPath && !userRoles.includes(roleFromPath)) {
      const dashboardUrl = new URL(`/dashboard/${userRole}`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // If user is authenticated but accessing the root, redirect to their dashboard
  if (pathname === '/') {
    const dashboardUrl = new URL(`/dashboard/${userRole}`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};