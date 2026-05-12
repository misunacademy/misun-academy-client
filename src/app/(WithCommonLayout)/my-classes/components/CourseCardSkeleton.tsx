export function CourseCardSkeleton() {
  return (
    <div className="relative p-[1.5px] rounded-2xl overflow-hidden animate-pulse">
      <span className="absolute inset-0 rounded-2xl border border-primary/10" />
      
      <div className="relative flex flex-col sm:flex-row min-h-[160px] rounded-2xl bg-[#060f0a] overflow-hidden">
        {/* Thumbnail Skeleton */}
        <div className="relative w-full sm:w-56 md:w-64 shrink-0 min-h-[140px] sm:min-h-0 bg-white/5" />

        {/* Details Skeleton */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-white/10 rounded-md" />
            <div className="h-4 w-1/2 bg-white/5 rounded-md" />
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="h-3 w-full bg-white/5 rounded-md" />
            <div className="h-3 w-4/5 bg-white/5 rounded-md" />
          </div>

          <div className="relative space-y-1.5 mt-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 bg-white/5 rounded-md" />
              <div className="h-3 w-8 bg-white/5 rounded-md" />
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden" />
          </div>

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 mt-auto pt-1">
            <div className="h-4 w-32 bg-white/5 rounded-md" />
            <div className="sm:ml-auto">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 w-36 h-9">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
