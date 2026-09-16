import { Skeleton } from "@/components/ui/skeleton";

export default function FeedbackLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-[300px]" />
          <Skeleton className="mx-auto h-4 w-[400px]" />
        </div>
        <div className="space-y-4 rounded-xl border p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
