'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <html lang="bn">
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center px-4">
                    <div className="w-full max-w-md space-y-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tighter">
                                সিস্টেম ত্রুটি
                            </h1>
                            <p className="text-muted-foreground">
                                একটি গুরুতর ত্রুটি ঘটেছে। পেজ রিফ্রেশ করুন।
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <Button onClick={reset} size="lg">
                                আবার চেষ্টা করুন
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => window.location.reload()}
                            >
                                পেজ রিফ্রেশ করুন
                            </Button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
