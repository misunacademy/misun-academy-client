import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
            console.debug('[debug/log] received debug payload:', body);
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[debug/log] failed to parse body', err);
        return NextResponse.json({ ok: false }, { status: 400 });
    }
}
