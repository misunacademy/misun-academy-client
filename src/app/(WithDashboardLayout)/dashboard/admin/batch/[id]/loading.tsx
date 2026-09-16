export default function BatchDetailLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full" />
                <div className="space-y-2">
                    <div className="h-5 w-64 bg-muted rounded" />
                    <div className="h-4 w-48 bg-muted rounded" />
                </div>
            </div>
            <div className="rounded-lg border border-border">
                <div className="border-b border-border p-4">
                    <div className="h-5 w-40 bg-muted rounded" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-border p-4">
                        <div className="h-4 w-8 bg-muted rounded" />
                        <div className="h-4 flex-1 bg-muted rounded" />
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-4 w-20 bg-muted rounded" />
                        <div className="h-6 w-16 bg-muted rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
