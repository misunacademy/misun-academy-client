import { Skeleton } from "@/components/ui/skeleton"

export function HeroSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading hero section"
      data-dark-section
      className="relative w-full min-h-screen border-b border-white/5 overflow-hidden bg-[#060f0a]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/40 to-surface" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="absolute top-1/4 -left-20 lg:left-10 w-64 h-64 md:w-96 md:h-96 border-[8px] md:border-[16px] border-primary/10 rounded-full z-0 blur-xl md:blur-2xl" />
      <div className="absolute bottom-10 -right-20 lg:right-1/4 w-80 h-80 md:w-[30rem] md:h-[30rem] border-[12px] md:border-[24px] border-primary/5 rounded-full z-0 blur-2xl md:blur-3xl" />

      <div className="relative z-10 min-h-screen pt-16 pb-20 flex flex-col justify-center">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="font-bangla space-y-8 max-w-2xl">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-[112px] rounded-full bg-white/10" />
              <Skeleton className="h-8 w-[128px] rounded-full bg-white/10" />
              <Skeleton className="h-8 w-[124px] rounded-full bg-white/10" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-9 w-[132px] rounded-full bg-white/10" />
              <Skeleton className="h-10 sm:h-11 md:h-12 w-full rounded-lg bg-white/10" />
              <Skeleton className="h-10 sm:h-11 md:h-12 w-[92%] rounded-lg bg-white/10" />
              <Skeleton className="h-7 sm:h-8 w-[72%] rounded-lg bg-white/5 mt-3" />
            </div>

            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full rounded bg-white/5" />
              <Skeleton className="h-4 w-[92%] rounded bg-white/5" />
              <Skeleton className="h-4 w-[78%] rounded bg-white/5" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Skeleton className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-[118px] rounded bg-white/10" />
                  <Skeleton className="h-2.5 w-[96px] rounded bg-white/5" />
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Skeleton className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-[92px] rounded bg-white/10" />
                  <Skeleton className="h-2.5 w-[96px] rounded bg-white/5" />
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Skeleton className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-[108px] rounded bg-white/10" />
                  <Skeleton className="h-2.5 w-[88px] rounded bg-white/5" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Skeleton className="h-[52px] w-[220px] rounded-xl bg-primary/20" />
            </div>
          </div>

          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center mt-12 lg:mt-0">
            <div className="relative z-10 w-[85%] h-[85%]">
              <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full scale-90" />
              <Skeleton className="relative z-10 w-full h-full rounded-2xl bg-white/[0.06] border border-white/5" />
            </div>

            <div className="absolute top-[10%] left-[5%] z-20">
              <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/10" />
            </div>
            <div className="absolute top-[20%] right-[5%] z-20">
              <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 border border-white/10" />
            </div>
            <div className="absolute bottom-[25%] left-[2%] z-20">
              <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10" />
            </div>
            <div className="absolute bottom-[15%] right-[10%] z-20">
              <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-dashed border-white/5 rounded-full -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-dashed border-primary/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
