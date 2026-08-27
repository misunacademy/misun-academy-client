import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailLoading() {
  return (
    <div className="min-h-[60vh] p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-[500px]" />
          <Skeleton className="h-5 w-[350px]" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-72 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
