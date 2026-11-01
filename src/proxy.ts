import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED_PATHS = [
    '/dashboard',
    '/checkout',
    '/my-classes',
    '/profile',
    '/payment',
    // '/bootcamp',
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

const CACHE_TTL_MS = 30_000;

let cachedMaintenance: { enabled: boolean; expiry: number } | null = null;

const BETTER_AUTH_COOKIE_KEYS = [
    'better-auth.session_token',
    '__Secure-better-auth.session_token',
    'better-auth.session_token.0',
    '__Secure-better-auth.session_token.0',
] as const;

function hasBetterAuthSession(request: NextRequest): boolean {
    // Presence check only (HttpOnly session cookies can't be verified at the
    // edge without the secret): a forged/expired cookie passes here, but real
    // enforcement lives in AuthGuard + API 401s. Never treat presence as proof.
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

// Segment-boundary prefix match: '/dashboard-evil' must not match '/dashboard'.
function matchesPath(pathname: string, prefix: string): boolean {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isMaintenanceAllowlisted(pathname: string) {
    if (MAINTENANCE_ALLOWLIST_EXACT.has(pathname)) return true;
    return MAINTENANCE_ALLOWLIST_PREFIXES.some((prefix) => matchesPath(pathname, prefix));
}

async function fetchMaintenanceStatus(baseApiUrl: string): Promise<boolean> {
    try {
        const response = await fetch(`${baseApiUrl}/settings`, {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
        });
        if (!response.ok) return false;
        const payload = await response.json();
        return payload?.data?.maintenanceEnabled === true;
    } catch {
        return false;
    }
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

    if (!cachedMaintenance || Date.now() > cachedMaintenance.expiry) {
        cachedMaintenance = {
            enabled: await fetchMaintenanceStatus(baseApiUrl),
            expiry: Date.now() + CACHE_TTL_MS,
        };
    }

    if (cachedMaintenance.enabled) {
        const url = request.nextUrl.clone();
        url.pathname = '/maintenance';
        url.search = '';
        return NextResponse.redirect(url);
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

    const isProtectedRoute = PROTECTED_PATHS.some((path) => matchesPath(pathname, path));

    if (isProtectedRoute && !sessionCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        // Preserve the full deep link (path + query) for post-login return.
        url.search = `?redirect_url=${encodeURIComponent(`${pathname}${request.nextUrl.search}`)}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};