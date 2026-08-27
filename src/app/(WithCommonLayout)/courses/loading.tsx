import { Skeleton } from "@/components/ui/skeleton"

export default function CoursesLoading() {
  return (
    <div className="min-h-screen">
      <section
        aria-busy="true"
        aria-label="Loading course banner"
        className="relative bg-surface overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle,hsl(156_70%_42%)_1px,transparent_1px)] bg-[length:32px_32px]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center pt-24 md:pt-28 pb-24 px-4">
          <Skeleton className="h-7 w-[280px] rounded-full bg-white/10 mb-6" />
          <div className="space-y-3 flex flex-col items-center w-full max-w-3xl">
            <Skeleton className="h-8 w-[132px] rounded-full bg-white/10" />
            <Skeleton className="h-10 md:h-12 w-[520px] max-w-full rounded-lg bg-white/10" />
            <Skeleton className="h-10 md:h-12 w-[460px] max-w-full rounded-lg bg-white/10" />
            <Skeleton className="h-7 w-[220px] rounded-lg bg-white/5" />
          </div>
          <div className="mt-6 space-y-2 w-full max-w-3xl flex flex-col items-center">
            <Skeleton className="h-4 w-full max-w-xl rounded bg-white/5" />
            <Skeleton className="h-4 w-[88%] max-w-xl rounded bg-white/5" />
            <Skeleton className="h-4 w-[72%] max-w-xl rounded bg-white/5" />
          </div>

          <div className="flex gap-3 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white/10" />
            ))}
          </div>

          <Skeleton className="h-[52px] w-[220px] rounded-xl bg-primary/20 mt-6" />

          <Skeleton className="h-[68px] w-[320px] md:w-[600px] rounded-2xl bg-white/5 border border-white/10 mt-6" />

          <Skeleton className="h-12 w-[180px] rounded-xl bg-primary/20 mt-8" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-72 w-full rounded-xl bg-white/5" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-48 bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-5/6 bg-white/5" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-12 w-full rounded-xl bg-primary/10" />
          </div>
        </div>
      </div>
    </div>
  )
}
