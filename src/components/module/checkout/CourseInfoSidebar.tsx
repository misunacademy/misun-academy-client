import { Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

interface CourseInfoSidebarProps {
  course: Record<string, unknown> | undefined;
  batch: Record<string, unknown> | undefined;
  isLoading: boolean;
}

export function CourseInfoSidebar({ course, batch, isLoading }: CourseInfoSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-6 sm:sticky top-[8.5rem] self-start">
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="p-5">
          {isLoading ? (
            <div className="aspect-video rounded-lg mb-4 bg-primary/8 animate-pulse" />
          ) : (
            <>
              <div className="aspect-video rounded-lg mb-4 relative overflow-hidden">
                <Image
                  src={course?.thumbnailImage as string}
                  alt={(course?.title as string) || 'Course'}
                  width={400}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white/90">{course?.title as string}</h3>
              <div className="flex items-center gap-4 text-sm text-white/50">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary/70" />
                  <span>{(course?.durationEstimate as string) || '0'} Months</span>
                </div>
              </div>
            </>
          )}
        </div>
        {course && (
          <div className="px-5 pb-5">
            <div className="space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              <div>
                <h4 className="font-semibold mb-3 text-white/70 text-sm">What you&apos;ll learn:</h4>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                  {(course.highlights as string[] || []).map((highlight: string, index: number) => (
                    <div key={index} className="text-center px-2 py-1.5 bg-primary/8 border border-primary/15 rounded-md">
                      <span className="text-xs text-white/60">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              <div>
                <h4 className="font-semibold mb-2 text-white/70 text-sm">Course includes:</h4>
                <ul className="space-y-1.5 text-sm">
                  {(course.features as string[] || []).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <PriceSummary batch={batch} />
    </div>
  );
}

function PriceSummary({ batch }: { batch: Record<string, unknown> | undefined }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="p-5">
        <div className="space-y-3">
          {batch ? (
            <>
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-primary/70 mb-3">Price Summary</p>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-white/70">Course Price</span>
                <span className="text-primary font-bold">
                  ৳{((batch.price as number)?.toLocaleString?.('en-IN') || 0)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-white/40">Select a batch to see pricing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
