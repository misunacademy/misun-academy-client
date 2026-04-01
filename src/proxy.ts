// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED_PATHS = [
    '/dashboard',
    '/checkout',
    '/my-classes',
    '/profile',
] as const;

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const sessionCookie = Boolean(getSessionCookie(request));

    const isProtectedRoute = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

    if (!isProtectedRoute || sessionCookie) {
        return NextResponse.next();
    }

    // URLSearchParams encodes automatically; do not double-encode this value.
    const redirectPath = `${pathname}${search}`;
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect_url', redirectPath);

    return NextResponse.redirect(loginUrl);
}

// Match protected routes (use /path* pattern consistently)
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/checkout/:path*',
        '/my-classes/:path*',
        '/profile/:path*',
    ],
};