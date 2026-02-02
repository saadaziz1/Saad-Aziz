import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define paths that are always accessible
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isRootPath = pathname === '/';

    // 1. Redirect unauthenticated users from private routes to /login
    if (isRootPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Redirect authenticated users from guest routes to /
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/login', '/register'],
};
