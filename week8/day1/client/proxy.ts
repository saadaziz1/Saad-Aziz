import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/resumelist', '/resumebuilder'];

// Define auth routes that authenticated users shouldn't access
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Check if the current route is an auth route (login/register)
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // If user is NOT authenticated and trying to access protected route
    if (isProtectedRoute && !token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // If user IS authenticated and trying to access auth routes (login/register)
    if (isAuthRoute && token) {
        const url = request.nextUrl.clone();
        url.pathname = '/resumelist';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Configure which routes should trigger the middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
