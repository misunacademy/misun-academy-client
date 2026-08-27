import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[450px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[160px]" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
