"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function BootcampWatchLoading() {
  return (
    <main aria-busy="true" aria-label="Loading bootcamp watch page" className="min-h-screen bg-[#0a0a0b] font-bangla text-white pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex items-center gap-1 font-bangla text-sm text-white/55">
          <Skeleton className="h-4 w-4 shrink-0 rounded-full bg-white/5" />
          <Skeleton className="h-4 w-48 rounded-full bg-white/5" />
        </div>
        <Skeleton className="mt-2 h-10 w-[240px] rounded-full bg-white/10" />
        <Skeleton className="mt-1 h-5 w-[200px] rounded-full bg-white/5" />
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-5 px-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <Skeleton className="relative w-full h-[340px] rounded-none bg-white/5" />
          </div>
          <Skeleton className="mt-4 h-5 w-24 rounded-full bg-white/10" />
          <Skeleton className="mt-1 h-8 w-full rounded-lg bg-white/5" />
          <Skeleton className="mt-1 h-5 w-3/4 rounded-full bg-white/5" />

          <div className="mt-4 flex items-center justify-between gap-3">
            <Skeleton className="h-9 w-28 rounded-xl border border-white/15 bg-white/5" />
            <Skeleton className="h-9 w-28 rounded-xl bg-white/5" />
            <Skeleton className="h-9 w-28 rounded-xl bg-white/5" />
          </div>

          <div className="mt-6">
            <Skeleton className="h-8 w-5 rounded-full bg-[#ffd60a]/15 mb-2" />
            <Skeleton className="mt-2 h-5 w-[160px] rounded-full bg-white/5 mb-3" />
            <ul className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-xl bg-[#ffd60a]/15" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-5/6 rounded-full bg-white/90" />
                    <Skeleton className="mt-0.5 h-3 w-full rounded-full bg-white/60" />
                  </div>
                  <Skeleton className="h-4 w-4 shrink-0 bg-white/40" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Skeleton className="h-5 w-24 rounded-full bg-white/5 mb-4" />
            <Skeleton className="h-8 w-32 rounded-xl bg-[#0d0d0e] border border-white/10" />
            <Skeleton className="h-5 w-32 rounded-full bg-white/5 mb-3" />
            <Skeleton className="h-4 w-full rounded-full bg-white/5" />
            <Skeleton className="h-3 w-5/6 rounded-full bg-white/5" />
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:sticky lg:top-20">
          <Skeleton className="border-b border-white/10 px-4 py-3 h-9 w-[120px] rounded-full bg-white/5" />
          <div className="max-h-[60vh] divide-y divide-white/5 overflow-y-auto lg:max-h-[70vh]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5">
                <Skeleton className="h-8 w-8 shrink-0 rounded-lg bg-white/10 text-white/60" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="block h-4 w-3/4 rounded-full bg-white/85" />
                  <Skeleton className="mt-0.5 block h-3 w-full rounded-full bg-white/45" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
