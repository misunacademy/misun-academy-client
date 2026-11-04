"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function BootcampDetailLoading() {
  return (
    <main aria-busy="true" aria-label="Loading bootcamp detail page" className="min-h-screen bg-[#0a0a0b] font-bangla text-white">
      <section className="relative overflow-hidden py-12 pt-10 pb-24 px-4">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Skeleton className="h-5 w-48 rounded-full bg-white/5" />
            <Skeleton className="mt-3 h-14 w-full max-w-[640px] rounded-full bg-white/10" />
            <Skeleton className="mt-4 h-8 w-[720px] max-w-full rounded-full bg-white/10" />
            <Skeleton className="mt-3 h-6 w-[600px] max-w-full rounded-full bg-white/10" />
            <div className="mt-6 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-32 rounded-full bg-white/5 border border-white/10" />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Skeleton className="h-10 w-[260px] rounded-xl bg-[#ffd60a]/10 border border-[#ffd60a]/20" />
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-[150px] rounded-lg bg-[#ffd60a]/10 border border-[#ffd60a]/30" />
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-6 rounded-[2rem] bg-[#ffd60a]/10 blur-3xl" />
            <Skeleton className="relative w-full rounded-2xl border border-white/10 shadow-2xl aspect-video" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#ffd60a]/25 bg-[#ffd60a]/[0.06] p-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48 rounded-full bg-[#ffd60a]/10" />
            <Skeleton className="h-4 w-64 bg-[#ffd60a]/10" />
          </div>
          <Skeleton className="shrink-0 h-10 w-[200px] rounded-xl bg-white/5 shadow-[0_0_28px_rgba(255,214,10,0.35)]" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="space-y-5">
          <Skeleton className="h-5 w-28 rounded-full bg-white/5 mb-2" />
          <Skeleton className="mt-1 h-10 w-[320px] rounded-full bg-white/10" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-5 w-5 shrink-0 rounded-full bg-white/5" />
                  <Skeleton className="h-5 w-32 rounded-full bg-white/5" />
                </div>
                <Skeleton className="h-6 w-full rounded-full bg-white/10 mb-3" />
                <Skeleton className="h-4 w-full rounded-full bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="space-y-5">
          <Skeleton className="h-5 w-28 rounded-full bg-white/5 mb-2" />
          <Skeleton className="mt-1 h-10 w-[320px] rounded-full bg-white/10" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Skeleton className="h-5 w-1/2 rounded-full bg-white/10 mb-4" />
                <Skeleton className="h-4 w-full rounded-full bg-white/10 mb-3" />
                <Skeleton className="h-3 w-full rounded-full bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="space-y-5">
          <Skeleton className="h-5 w-28 rounded-full bg-white/5 mb-2" />
          <Skeleton className="mt-1 h-10 w-[320px] rounded-full bg-white/10" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-5">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full bg-white/10" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-3/4 rounded-full bg-white/5" />
                    <Skeleton className="h-4 w-2/3 rounded-full bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="space-y-5">
          <Skeleton className="h-5 w-32 rounded-full bg-white/5 mb-2" />
          <Skeleton className="mt-1 h-10 w-[320px] rounded-full bg-white/10" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border border-white/10 p-[1.5px]">
                <div className="relative overflow-hidden rounded-xl bg-[#0d0d0e] p-6">
                  <Skeleton className="h-32 w-full rounded-none bg-white/5 mb-4" />
                  <Skeleton className="h-4 w-1/2 rounded-full bg-white/5 mb-3" />
                  <Skeleton className="h-3 w-3/4 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 bg-[#0d0d0e]">
        <div className="space-y-5">
          <Skeleton className="h-5 w-32 rounded-full bg-white/5 mb-2" />
          <Skeleton className="mt-1 h-10 w-[320px] rounded-full bg-white/10" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-6">
                <Skeleton className="h-10 w-12 rounded-full bg-white/10 mb-4" />
                <Skeleton className="h-5 w-32 rounded-full bg-white/5 mb-3" />
                <Skeleton className="h-4 w-full rounded-full bg-white/5 mb-3" />
                <Skeleton className="h-3 w-5/6 rounded-full bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="space-y-5">
          <Skeleton className="h-5 w-32 rounded-full bg-white/5 mb-2" />
          <Skeleton className="mt-1 h-10 w-[320px] rounded-full bg-white/10" />
          <div className="mt-5 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10 p-[1.5px]">
                <div className="relative overflow-hidden rounded-2xl bg-[#0d0d0e] p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent" />
                  <Skeleton className="h-48 w-full rounded-none bg-white/5 mb-4" />
                  <Skeleton className="h-4 w-28 rounded-full bg-white/5 mb-3" />
                  <Skeleton className="h-3 w-full rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 bg-[#0d0d0e]">
        <div className="space-y-5">
          <Skeleton className="h-5 w-32 rounded-full bg-white/5 mb-2" />
          <Skeleton className="mt-1 h-10 w-[320px] rounded-full bg-white/10" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3 rounded-full bg-white/5" />
                  <Skeleton className="h-3 w-full rounded-full bg-white/5" />
                  <Skeleton className="h-3 w-1/2 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-xl border border-white/10 p-8 sm:p-10">
          <div className="space-y-6">
            <Skeleton className="h-5 w-48 rounded-full bg-white/5 mb-4" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/5 mb-4" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/5 mb-4" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/5 mb-4" />
            <Skeleton className="h-12 w-[220px] rounded-xl bg-[#ffd60a]/10 border border-[#ffd60a]/20" />
          </div>
        </div>
      </section>
    </main>
  )
}
