"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function BootcampLoading() {
  return (
    <main aria-busy="true" aria-label="Loading bootcamp page" className="min-h-screen bg-[#0a0a0b] font-bangla text-white">
      <section className="relative overflow-hidden bg-[#0a0a0b] py-12 md:pt-16 pb-24 px-4">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="space-y-6">
            <Skeleton className="h-6 w-48 rounded-full bg-white/5" />
            <Skeleton className="mt-3 h-12 w-full max-w-[640px] rounded-full bg-white/10" />
            <Skeleton className="mt-4 h-8 w-[720px] max-w-full rounded-full bg-white/10" />
            <div className="mt-6 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-32 rounded-full bg-white/5 border border-white/10" />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Skeleton className="h-10 w-[200px] rounded-xl bg-[#ffd60a]/10 border border-[#ffd60a]/20" />
              <Skeleton className="h-9 w-[140px] rounded-lg border border-[#e5484d]/40 bg-[#e5484d]/10" />
            </div>
          </div>
          <FadeInPlaceholder className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-6 rounded-[2rem] bg-[#ffd60a]/10 blur-3xl" />
            <Skeleton className="relative w-full rounded-2xl border border-white/10 shadow-2xl aspect-[3/4]" />
          </FadeInPlaceholder>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-[200px] rounded-full bg-white/5 mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 p-6">
                <Skeleton className="h-5 w-1/3 bg-white/5 mb-4" />
                <Skeleton className="h-4 w-full bg-white/10 mb-3" />
                <Skeleton className="h-3 w-3/4 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#0d0d0e]">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-[240px] rounded-full bg-white/5 mb-8" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48 bg-white/5" />
                    <Skeleton className="h-3 w-64 bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/10 p-6">
                  <Skeleton className="h-5 w-40 bg-white/5 mb-4" />
                  <Skeleton className="h-4 w-full bg-white/10 mb-3" />
                  <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-[280px] rounded-full bg-white/5 mb-8" />
          <div className="space-y-8">
            <div className="rounded-xl border border-white/10 p-8">
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-[280px] rounded-full bg-white/5 mb-8" />
          <form className="space-y-6 rounded-xl border border-white/10 p-8 sm:p-10">
            <Skeleton className="h-5 w-48 bg-white/5" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-12 w-[200px] rounded-xl bg-[#ffd60a]/10 border border-[#ffd60a]/20 mt-4" />
          </form>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6 bg-[#0d0d0e]">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-[200px] rounded-full bg-white/5 mb-8" />
          <div className="grid gap-8 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-6">
                <Skeleton className="h-10 w-12 rounded-full bg-white/10 mb-4" />
                <Skeleton className="h-5 w-32 bg-white/5 mb-3" />
                <Skeleton className="h-4 w-full bg-white/10 mb-3" />
                <Skeleton className="h-3 w-5/6 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-[240px] rounded-full bg-white/5 mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10 p-[1.5px]">
                <div className="relative overflow-hidden rounded-2xl bg-[#0d0d0e] p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent" />
                  <Skeleton className="h-48 w-full rounded-none bg-white/5 mb-4" />
                  <Skeleton className="h-4 w-28 bg-white/5 mb-3" />
                  <Skeleton className="h-3 w-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function FadeInPlaceholder({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}
