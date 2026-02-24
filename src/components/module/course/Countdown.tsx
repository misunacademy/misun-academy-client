/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useGetCurrentEnrollmentBatchQuery, useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { useGetCourseByIdQuery } from "@/redux/features/course/courseApi";
import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import { intervalToDuration, isBefore, isAfter } from "date-fns";
import { FadeIn } from '@/components/ui/FadeIn';

type TimeLeft = {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// ── Sub-components declared outside to avoid "created during render" error ───

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center
      bg-[#060f0a] border border-primary/20 rounded-2xl
      w-20 h-24 sm:w-24 sm:h-28
      shadow-[0_8px_32px_hsl(156_70%_42%/0.15)]
      transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 group"
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40 rounded-tr-2xl" />
      {/* Top shimmer line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 text-4xl sm:text-5xl font-bold font-mona tabular-nums bg-gradient-to-b from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-md">
        {String(value).padStart(2, '0')}
      </div>
      <div className="relative z-10 text-[10px] sm:text-xs text-white/70 font-bangla mt-2 tracking-[0.2em] uppercase">
        {label}
      </div>
    </div>
  );
}

function Colon() {
  return (
    <div className="hidden sm:flex flex-col gap-2 animate-pulse pb-6">
      <div className="w-1.5 h-1.5 rounded-full bg-primary/70 shadow-[0_0_8px_hsl(156_70%_42%)]" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary/70 shadow-[0_0_8px_hsl(156_70%_42%)]" />
    </div>
  );
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [status, setStatus] = useState<'upcoming' | 'running' | 'completed'>('completed');

  const { data: settingsData } = useGetSettingsQuery();
  const featuredCourseId = (settingsData?.data?.featuredEnrollmentCourse as any)?._id;
  const featuredBatchId = (settingsData?.data?.featuredEnrollmentBatch as any)?._id;

  const { isLoading: courseLoading } = useGetCourseByIdQuery(featuredCourseId || "", {
    skip: !featuredCourseId,
  });

  const { data: batchData, isLoading: batchLoading } = useGetCurrentEnrollmentBatchQuery(
    { courseId: featuredCourseId },
    { skip: !featuredCourseId || !!featuredBatchId }
  );

  const { data: featuredBatchData, isLoading: featuredBatchLoading } = useGetBatchByIdQuery(
    featuredBatchId || "",
    { skip: !featuredBatchId }
  );

  const batch = featuredBatchData?.data || batchData?.data;
  const start = useMemo(() => batch ? new Date(batch.enrollmentStartDate) : null, [batch]);
  const end = useMemo(() => batch ? new Date(batch.enrollmentEndDate) : null, [batch]);

  useEffect(() => {
    if (!batch || !start || !end) return;

    const interval = setInterval(() => {
      const current = new Date();
      const isUpcomingNow = isBefore(current, start);
      const isOngoingNow = isAfter(current, start) && isBefore(current, end);

      let targetDate: Date | null = null;

      if (isUpcomingNow) {
        setStatus('upcoming');
        targetDate = start;
      } else if (isOngoingNow) {
        setStatus('running');
        targetDate = end;
      } else {
        setStatus('completed');
        setTimeLeft(null);
      }

      if (targetDate) {
        const duration = intervalToDuration({ start: current, end: targetDate });
        setTimeLeft({
          months: duration.months || 0,
          days: duration.days || 0,
          hours: duration.hours || 0,
          minutes: duration.minutes || 0,
          seconds: duration.seconds || 0,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [batch, start, end]);

  if (courseLoading || batchLoading || featuredBatchLoading) return null;
  if (!featuredCourseId || !batch || status === 'completed' || !timeLeft) return null;

  return (
    <FadeIn delay={0.1} className="mt-8 mb-4">
      <div className="text-center space-y-6">
        {/* Status badge — matches premium pulsing-dot badge across all sections */}
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full
          bg-primary/10 border border-primary/25 backdrop-blur-sm
          shadow-[0_0_20px_hsl(156_70%_42%/0.12)]">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90 font-bangla">
            {status === 'upcoming' ? "এনরোলমেন্ট শুরু হতে বাকি" : "এনরোলমেন্ট শেষ হতে বাকি"}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {timeLeft.months > 0 && (
            <>
              <TimeBlock value={timeLeft.months} label="মাস" />
              <Colon />
            </>
          )}
          <TimeBlock value={timeLeft.days} label="দিন" />
          <Colon />
          <TimeBlock value={timeLeft.hours} label="ঘণ্টা" />
          <Colon />
          <TimeBlock value={timeLeft.minutes} label="মিনিট" />
          <Colon />
          <TimeBlock value={timeLeft.seconds} label="সেকেন্ড" />
        </div>
      </div>
    </FadeIn>
  );
};

export default Countdown;