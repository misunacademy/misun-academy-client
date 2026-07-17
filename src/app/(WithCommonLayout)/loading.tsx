import { Skeleton } from "@/components/ui/skeleton";

export default function CommonLayoutLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[400px]" />
          <Skeleton className="h-5 w-[550px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border p-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-3 w-[140px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
