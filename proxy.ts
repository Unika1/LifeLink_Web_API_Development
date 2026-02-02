import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ['/login', '/register', '/forget-password', '/reset-password'];
const adminRoutes = ['/admin'];
const userRoutes = ['/user'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies (directly from request, not server function)
  const token = request.cookies.get("lifelink_token")?.value;
  const userDataStr = request.cookies.get("lifelink_user")?.value;
  
  let user = null;
  try {
    user = userDataStr ? JSON.parse(userDataStr) : null;
  } catch (e) {
    user = null;
  }

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to login if not authenticated and not on public route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based access
  if (token && user) {
    if (isAdminRoute && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (isUserRoute && user.role !== 'user' && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/login',
    '/register',
    '/forget-password',
    '/reset-password'
  ]
};
