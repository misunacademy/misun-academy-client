export default function InstructorDashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full" />
                <div className="space-y-2">
                    <div className="h-5 w-72 bg-muted rounded" />
                    <div className="h-4 w-52 bg-muted rounded" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-border p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded-xl" />
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-muted rounded" />
                            <div className="h-6 w-12 bg-muted rounded" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="rounded-lg border border-border p-5 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 bg-muted rounded-lg" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 w-48 bg-muted rounded" />
                        <div className="h-3 w-full bg-muted rounded" />
                        <div className="flex gap-2">
                            <div className="h-5 w-24 bg-muted rounded-full" />
                            <div className="h-5 w-24 bg-muted rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-6 w-40 bg-muted rounded" />
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 bg-muted rounded" />
                                <div className="h-4 w-64 bg-muted rounded" />
                            </div>
                            <div className="flex gap-1">
                                <div className="h-8 w-8 bg-muted rounded" />
                                <div className="h-8 w-8 bg-muted rounded" />
                                <div className="h-8 w-8 bg-muted rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
