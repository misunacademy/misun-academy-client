"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfileError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Profile page error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">
                        প্রোফাইল লোড করা যায়নি!
                    </h1>
                    <p className="text-muted-foreground">
                        এই পেজ লোড করার সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।
                    </p>
                </div>

                {process.env.NODE_ENV === "development" && (
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
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/my-classes">সকল ক্লাসে ফিরে যান</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
