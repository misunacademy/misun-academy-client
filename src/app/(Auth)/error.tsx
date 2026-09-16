'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Auth error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">
                        প্রমাণীকরণ ব্যর্থ
                    </h1>
                    <p className="text-muted-foreground">
                        প্রমাণীকরণ প্রক্রিয়ায় একটি ত্রুটি ঘটেছে।
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
                        onClick={() => (window.location.href = '/auth/login')}
                    >
                        লগইন পেজে যান
                    </Button>
                </div>
            </div>
        </div>
    );
}
