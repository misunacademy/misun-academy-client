
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isValidToken = (token: string | undefined): boolean => {
    return !!token && token !== '';
};

// Next.js 16 convention: export function proxy
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check for Manual Auth Token
    const token = request.cookies.get('token')?.value;

    // 2. Check for Better Auth Session
    // (Check both standard and secure variants to be safe in prod)
    const betterAuthSession = 
        request.cookies.get('better-auth.session_token')?.value || 
        request.cookies.get('__Secure-better-auth.session_token')?.value;

    // Debug logging (Optional: remove in production)
    if (process.env.NODE_ENV === 'development') {
        console.debug(`[Proxy] Path: ${pathname} | Manual Token: ${!!token} | Better Auth: ${!!betterAuthSession}`);
    }

    // 3. Protected Routes Logic
    if (pathname.startsWith('/dashboard')) {
        // Optimistic Check: If either cookie exists, let them pass.
        // The destination page/API will handle strict verification.
        if (isValidToken(token) || !!betterAuthSession) {
            return NextResponse.next();
        }

        // Redirect to login with a return URL
        const loginUrl = new URL('/auth', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/checkout')) {
        // Optimistic Check: If either cookie exists, let them pass.
        // The destination page/API will handle strict verification.
        if (isValidToken(token) || !!betterAuthSession) {
            return NextResponse.next();
        }

        // Redirect to login with a return URL
        const loginUrl = new URL('/auth', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configuration
export const config = {
    matcher: ['/dashboard/:path*', '/checkout/:path*'],
};
