import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isValidToken = (token: string | undefined): boolean => {
    return !!token && token !== '';
};

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    if (pathname.startsWith('/dashboard')) {
        if (isValidToken(token)) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};