
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/profile']

// Routes that are strictly for unauthenticated users
const authRoutes = ['/login', '/register']

export default function proxy(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    // 1. Protect Logic: If trying to access protected route without token => Redirect to Login
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            const loginUrl = new URL('/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    // 2. Auth Logic: If trying to access login/register WITH token => Redirect to Home
    if (authRoutes.some(route => pathname.startsWith(route))) {
        if (token) {
            const homeUrl = new URL('/', request.url)
            return NextResponse.redirect(homeUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/login',
        '/register'
    ]
}
