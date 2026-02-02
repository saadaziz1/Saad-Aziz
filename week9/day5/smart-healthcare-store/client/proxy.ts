import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    // 1. Protected routes (Auth required)
    // Add paths here that strictly require login
    const protectedPaths = ['/profile', '/checkout']

    // Note: User can view products without login, but cannot add to cart (handled in component)
    // If strict product view protection is needed, add '/products' here.

    if (protectedPaths.some(path => pathname.startsWith(path))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 2. Auth routes (Guest only)
    // Don't let logged-in users visit login/signup pages
    const authPaths = ['/login', '/signup']
    if (authPaths.some(path => pathname.startsWith(path))) {
        if (token) {
            return NextResponse.redirect(new URL('/products', request.url))
        }
    }

    return NextResponse.next()
}

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
}
