'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter">
                        ড্যাশবোর্ড লোড করতে ব্যর্থ
                    </h2>
                    <p className="text-muted-foreground">
                        ড্যাশবোর্ড লোড করার সময় একটি ত্রুটি ঘটেছে।
                    </p>
                </div>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="rounded-lg bg-destructive/10 p-4 text-left">
                        <p className="text-sm font-mono text-destructive">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button onClick={reset}>আবার চেষ্টা করুন</Button>
                    <Button
                        variant="outline"
                        onClick={() => (window.location.href = '/dashboard')}
                    >
                        ড্যাশবোর্ড রিফ্রেশ করুন
                    </Button>
                </div>
            </div>
        </div>
    );
}
