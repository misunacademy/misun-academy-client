'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter">
                        কিছু ভুল হয়েছে!
                    </h1>
                    <p className="text-muted-foreground">
                        দুঃখিত, একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।
                    </p>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="rounded-lg bg-destructive/10 p-4 text-left">
                        <p className="text-sm font-mono text-destructive">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button onClick={reset} size="lg">
                        আবার চেষ্টা করুন
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => (window.location.href = '/')}
                    >
                        হোম পেজে ফিরে যান
                    </Button>
                </div>
            </div>
        </div>
    );
}
