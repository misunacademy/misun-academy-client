import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED_PATHS = [
    '/dashboard',
    '/checkout',
    '/my-classes',
    '/profile',
] as const;

const MAINTENANCE_ALLOWLIST_PREFIXES = [
    '/maintenance',
    '/dashboard',
    '/auth',
    '/api',
] as const;

const MAINTENANCE_ALLOWLIST_EXACT = new Set([
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-0.xml',
]);

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

function isMaintenanceAllowlisted(pathname: string) {
    if (MAINTENANCE_ALLOWLIST_EXACT.has(pathname)) return true;
    return MAINTENANCE_ALLOWLIST_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

async function maybeRedirectToMaintenance(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isMaintenanceAllowlisted(pathname)) {
        return null;
    }

    const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseApiUrl) {
        return null;
    }

    try {
        const response = await fetch(`${baseApiUrl}/settings`, {
            headers: {
                Accept: 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        const payload = await response.json();
        const maintenanceEnabled = payload?.data?.maintenanceEnabled === true;

        if (maintenanceEnabled) {
            const url = request.nextUrl.clone();
            url.pathname = '/maintenance';
            url.search = '';
            return NextResponse.redirect(url);
        }
    } catch {
        return null;
    }

    return null;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const maintenanceResponse = await maybeRedirectToMaintenance(request);
    if (maintenanceResponse) {
        return maintenanceResponse;
    }

    const sessionCookie = hasBetterAuthSession(request);

    const isProtectedRoute = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

    if (!isProtectedRoute || sessionCookie) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

// Run on all public routes so maintenance mode can take effect.
export const config = {
    // matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
    matcher: [
        '/dashboard/:path*',
        '/checkout/:path*',
        '/my-classes/:path*',
        '/profile/:path*',
    ],
};