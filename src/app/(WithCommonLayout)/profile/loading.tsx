"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <main aria-busy="true" aria-label="Loading profile page" className="min-h-[calc(100vh-80px)] bg-surface p-6 lg:p-8 font-bangla text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 lg:flex-row">
          <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            <div className="flex items-center gap-3 p-6 rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden">
              <Skeleton className="w-20 h-20 shrink-0 rounded-full bg-white/5" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-4 w-[140px] rounded-full bg-white/5" />
                <Skeleton className="h-3 w-[120px] rounded-full bg-white/5 opacity-60" />
                <Skeleton className="h-3 w-[100px] rounded-full bg-white/5 opacity-40" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-8 w-[140px] rounded-full bg-white/5" />
              <div className="bg-primary/5 rounded-xl h-1 border border-white/5" />
              <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
              <Skeleton className="h-4 w-[200px] rounded-full bg-white/5 opacity-60" />
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-6">
            <div className="rounded-2xl border border-primary/20 p-8 flex flex-col min-h-[400px] bg-primary/5 shadow-[0_0_40px_hsl(156_70%_42%/0.03)]">
              <Skeleton className="h-8 w-[160px] rounded-full bg-white/5 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-[120px] rounded-full bg-white/5" />
                <Skeleton className="h-4 w-[200px] rounded-full bg-white/5 opacity-60" />
                <Skeleton className="h-4 w-[180px] rounded-full bg-white/5 opacity-60" />
                <Skeleton className="h-4 w-[240px] rounded-full bg-white/5 opacity-60" />
                <Skeleton className="h-4 w-[160px] rounded-full bg-white/5 opacity-60" />
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 p-8 flex flex-col min-h-[300px] bg-primary/5 shadow-[0_0_40px_hsl(156_70%_42%/0.03)]">
              <Skeleton className="h-8 w-[160px] rounded-full bg-white/5 mb-6" />
              <Skeleton className="h-4 w-[140px] rounded-full bg-white/5 mb-4" />
              <Skeleton className="h-10 w-full rounded-lg bg-white/5 mb-4" />
              <Skeleton className="h-4 w-[200px] rounded-full bg-white/5 mb-4" />
              <Skeleton className="h-4 w-[180px] rounded-full bg-white/5 mb-4" />
              <Skeleton className="h-4 w-[160px] rounded-full bg-white/5 mb-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
