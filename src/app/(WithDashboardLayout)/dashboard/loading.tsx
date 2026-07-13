export default function DashboardLoading() {
    return (
        <div className="flex min-h-[60vh] animate-pulse">
            <div className="hidden lg:block w-64 shrink-0 border-r border-border">
                <div className="space-y-2 p-4">
                    <div className="h-8 w-32 bg-muted rounded-lg mb-6" />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2">
                            <div className="h-5 w-5 bg-muted rounded" />
                            <div className="h-4 flex-1 bg-muted rounded" />
                        </div>
                    ))}
                </div>
                <div className="border-t border-border p-4 mt-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-full" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-24 bg-muted rounded" />
                            <div className="h-3 w-16 bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="space-y-2">
                        <div className="h-5 w-64 bg-muted rounded" />
                        <div className="h-4 w-48 bg-muted rounded" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border border-border p-5 space-y-3">
                            <div className="h-4 w-24 bg-muted rounded" />
                            <div className="h-8 w-16 bg-muted rounded" />
                            <div className="h-3 w-32 bg-muted rounded" />
                        </div>
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="rounded-lg border border-border p-5 space-y-4">
                            <div className="h-5 w-40 bg-muted rounded" />
                            <div className="h-3 w-56 bg-muted rounded" />
                            {Array.from({ length: 5 }).map((_, j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-muted rounded-full" />
                                        <div className="space-y-1.5">
                                            <div className="h-3 w-28 bg-muted rounded" />
                                            <div className="h-2 w-16 bg-muted rounded" />
                                        </div>
                                    </div>
                                    <div className="h-3 w-20 bg-muted rounded" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
