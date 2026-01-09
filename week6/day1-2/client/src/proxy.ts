import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware logic for Next.js
 * Note: For this to work automatically in Next.js, this file should be named 'middleware.ts'
 * and placed in the 'src' or root directory.
 */
export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const rawRole = request.cookies.get('user-role')?.value;

    // Normalize role: uppercase and convert hyphens to underscores (handles 'super-admin' -> 'SUPER_ADMIN')
    const role = rawRole?.toUpperCase().replace('-', '_');

    const { pathname } = request.nextUrl;

    const protectedPaths = ['/dashboard', '/profile', '/checkout'];
    const guestPaths = ['/login', '/signup'];


    // 1. Not authenticated -> Redirect to login if accessing protected routes
    if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Authenticated -> Role-based protection for Dashboard
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Only ADMIN and SUPER_ADMIN can access dashboard
        // We check for both underscored and hyphenated versions just in case
        const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPER-ADMIN';

        if (!isAdmin) {
            // console.log(`Unauthorized dashboard access blocked for role: ${role}`);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 3. Authenticated -> Redirect away from guest routes (login/signup)
    if (guestPaths.some(path => pathname.startsWith(path)) && token) {
        // If admin, go to dashboard. If user, go to home.
        const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPER-ADMIN';

        if (isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Export as proxy as well since the user requested this name
export const proxy = middleware;
export default middleware;

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/checkout',
        '/login',
        '/signup',
    ],
};
