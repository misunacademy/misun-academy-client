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

const BETTER_AUTH_COOKIE_KEYS = [
    'better-auth.session_token',
    '__Secure-better-auth.session_token',
    'better-auth.session_token.0',
    '__Secure-better-auth.session_token.0',
] as const;

function hasBetterAuthSession(request: NextRequest): boolean {
    if (getSessionCookie(request)) {
        return true;
    }

    for (const key of BETTER_AUTH_COOKIE_KEYS) {
        if (request.cookies.get(key)?.value) {
            return true;
        }
    }

    return false;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = hasBetterAuthSession(request);

    const isProtectedRoute = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

    if (!isProtectedRoute || sessionCookie) {
        return NextResponse.next();
    }

    // Better Auth can keep auth cookies scoped to API domain in some deployments.
    // In that case, edge middleware cannot see the cookie reliably on frontend host.
    // Let client-side auth flow validate session via /auth/me to avoid redirect loops.
    return NextResponse.next();
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