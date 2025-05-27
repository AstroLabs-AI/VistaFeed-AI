import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware without JWT verification to avoid Edge Runtime issues
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected and auth routes
  const protectedRoutes = ['/dashboard', '/agents', '/social', '/videos', '/shop'];
  const authRoutes = ['/auth', '/login', '/register'];
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // For protected routes, we'll let the client-side handle authentication
  // This avoids Edge Runtime compatibility issues
  if (isProtectedRoute) {
    // Let the page handle authentication check on the client side
    return NextResponse.next();
  }
  
  // For auth routes, also let client side handle redirects
  if (isAuthRoute) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};