"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
    const [path, setPath] = useState(window.location.href);
    const [referrer, setReferrer] = useState(document.referrer || '');

    useEffect(() => {
        // Run only in development to avoid sending logs in production
        if (process.env.NODE_ENV !== 'development') return;

        const p = window.location.href;
        const r = document.referrer || '';

        console.warn('[NotFound] Rendered for path:', p, 'referrer:', r);

        // Send a small dev-only payload to an API route so server logs capture it too
        fetch('/api/debug/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: p, referrer: r }),
        }).catch((err) => console.debug('[NotFound] failed to send debug log', err));
    }, []);

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
            {/* Large Watermark */}
            <h1 className="absolute text-[20vw] md:text-[28vw] lg:text-[30vw] font-bold font-monaExpanded text-primary opacity-5 select-none">
                404
            </h1>

            <div className="text-center relative z-10">
                <h1 className="text-6xl md:text-8xl font-bold text-primary font-monaExpanded">404</h1>
                <p className="text-lg md:text-2xl text-secondary-foreground font-monaExpanded mt-2">Page Not Found</p>
                <Link href="/">
                    <Button className="mt-8">Go Back Home</Button>
                </Link>

                {/* Visible debug info during development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 text-sm text-muted-foreground">
                        <p>
                            <strong>Requested path:</strong> <code>{path || 'loading...'}</code>
                        </p>
                        <p>
                            <strong>Referrer:</strong> <code>{referrer || 'none'}</code>
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">This information is logged to the console and to /api/debug/log for debugging.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
