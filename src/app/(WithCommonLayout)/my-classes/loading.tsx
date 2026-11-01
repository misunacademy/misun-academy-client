import { Skeleton } from "@/components/ui/skeleton"
import CursorGrid from "./components/CursorGrid"

function CourseCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/10">
      <div className="relative flex min-h-[160px] flex-col overflow-hidden rounded-2xl bg-surface sm:flex-row">
        <div className="relative min-h-[140px] w-full shrink-0 bg-white/5 sm:min-h-0 sm:w-56 md:w-64">
          <Skeleton className="h-full w-full rounded-none bg-white/5" />
          <Skeleton className="absolute left-3 top-3 h-6 w-20 rounded-full bg-primary/20" />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-1/2 bg-white/5" />
          </div>
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-5/6 bg-white/5" />

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-3 w-8 bg-primary/20" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full bg-white/10" />
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <Skeleton className="h-4 w-32 bg-white/5" />
            <Skeleton className="h-10 w-40 rounded-xl bg-primary/20 sm:ml-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyClassesLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading enrolled courses"
      className="relative isolate min-h-screen overflow-hidden bg-[#040a07]"
    >
      <div className="absolute inset-0 z-0 bg-[#040a07]" />

      <CursorGrid
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
        cellSize={30}
        color="#20b486"
        gridColor="#2b5b54"
        highlight="area"
        gridStyle="lines"
        radius={90}
        holdTime={400}
        fadeDuration={800}
        fillOpacity={0.12}
        gridOpacity={0.15}
        spotlight={0.6}
        clickPulse
      />

      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl p-[1.5px]">
          <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-surface p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent" />
            <div className="relative flex items-center gap-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-2xl bg-primary/20" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 bg-primary/20" />
                <Skeleton className="h-8 w-64 max-w-[70vw] bg-white/10" />
              </div>
            </div>
            <Skeleton className="relative mt-4 h-7 w-44 rounded-full bg-primary/10" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative rounded-md bg-black">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <div className="overflow-x-hidden">
              <div className="flex min-w-max justify-start">
                <Skeleton className="mx-3 h-11 w-28 rounded-none bg-primary/10 sm:mx-5 sm:w-32" />
                <Skeleton className="mx-3 h-11 w-32 rounded-none bg-white/5 sm:mx-5 sm:w-36" />
                <Skeleton className="mx-3 h-11 w-36 rounded-none bg-white/5 sm:mx-5 sm:w-44" />
                <Skeleton className="mx-3 h-11 w-32 rounded-none bg-white/5 sm:mx-5 sm:w-36" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        </div>
      </div>
    </main>
  )
}
