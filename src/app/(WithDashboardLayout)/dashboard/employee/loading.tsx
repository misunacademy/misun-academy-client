export default function EmployeeDashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full ring-2 ring-emerald-100" />
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-72 bg-muted rounded" />
                        <div className="h-5 w-20 bg-muted rounded-full" />
                    </div>
                    <div className="h-4 w-56 bg-muted rounded" />
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-border p-5 space-y-2">
                        <div className="h-3 w-20 bg-muted rounded" />
                        <div className="h-7 w-16 bg-muted rounded" />
                        <div className="h-2 w-28 bg-muted rounded" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 rounded-lg border border-border p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-36 bg-muted rounded" />
                        <div className="h-8 w-20 bg-muted rounded" />
                    </div>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-border pb-3">
                            <div className="space-y-1">
                                <div className="h-3 w-20 bg-muted rounded" />
                                <div className="h-3 w-32 bg-muted rounded" />
                            </div>
                            <div className="h-3 w-20 bg-muted rounded" />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-2 space-y-5">
                    <div className="rounded-lg border border-border p-5 space-y-3">
                        <div className="h-5 w-32 bg-muted rounded" />
                        <div className="h-8 w-20 bg-muted rounded" />
                        <div className="h-2 w-40 bg-muted rounded" />
                    </div>
                    <div className="rounded-lg border border-border p-5 space-y-3">
                        <div className="h-5 w-28 bg-muted rounded" />
                        <div className="h-8 w-16 bg-muted rounded" />
                        <div className="h-10 w-full bg-muted rounded" />
                    </div>
                </div>
            </div>
            <div className="rounded-lg border border-border">
                <div className="border-b border-border p-4">
                    <div className="h-5 w-36 bg-muted rounded" />
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-border p-4">
                        <div className="h-4 flex-1 bg-muted rounded" />
                        <div className="h-4 w-20 bg-muted rounded" />
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-6 w-16 bg-muted rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
