import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('user_role')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't need authentication
    const publicRoutes = ['/login', '/signup', '/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If no token and trying to access a protected route
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If has token but trying to access login/signup
    if (token && isPublicRoute) {
        if (userRole === 'teacher') {
            return NextResponse.redirect(new URL('/teacher', request.url));
        }
        return NextResponse.redirect(new URL('/student', request.url));
    }

    // Role-based protection
    if (token) {
        if (pathname.startsWith('/teacher') && userRole !== 'teacher') {
            return NextResponse.redirect(new URL('/student', request.url));
        }
        if (pathname.startsWith('/student') && userRole !== 'student') {
            return NextResponse.redirect(new URL('/teacher', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
