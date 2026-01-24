import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isValidToken = (token: string | undefined): boolean => {
    return !!token && token !== '';
};


export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;


    const token = request.cookies.get('token')?.value;


    const betterAuthSession = 
        request.cookies.get('better-auth.session_token')?.value || 
        request.cookies.get('__Secure-better-auth.session_token')?.value;


    if (process.env.NODE_ENV === 'development') {
        console.debug(`[Proxy] Path: ${pathname} | Manual Token: ${!!token} | Better Auth: ${!!betterAuthSession}`);
    }

    // 3. Protected Routes Logic
    if (pathname.startsWith('/dashboard')) {
 
        if (isValidToken(token) || !!betterAuthSession) {
            return NextResponse.next();
        }

        // Redirect to login with a return URL
        const loginUrl = new URL('/auth', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/checkout')) {
 
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
