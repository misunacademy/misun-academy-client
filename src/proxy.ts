import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for Better Auth session cookie
    const betterAuthSession = 
        request.cookies.get('better-auth.session_token')?.value || 
        request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (process.env.NODE_ENV === 'development') {
        console.debug(`[Proxy] Path: ${pathname} | Better Auth Session: ${!!betterAuthSession}`);
    }

    // Protected routes that require authentication
    const protectedPaths = ['/dashboard', '/checkout'];
    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtectedRoute) {
        if (!betterAuthSession) {
            // Redirect to login with return URL
            const loginUrl = new URL('/auth', request.url);
            loginUrl.searchParams.set('redirectTo', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Configuration
export const config = {
    matcher: ['/dashboard/:path*', '/checkout/:path*'],
};
