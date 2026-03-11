/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useGetCurrentEnrollmentBatchQuery } from "@/redux/api/batchApi";
import { useGetCourseBySlugQuery } from "@/redux/api/courseApi";
import { intervalToDuration, isBefore, isAfter } from "date-fns";
import { FadeIn } from '@/components/ui/FadeIn';
import { BatchResponse } from '@/redux/api/batchApi';

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

interface CountdownProps {
  /** Pass a pre-fetched batch object directly (e.g. from EnrollmentSection) */
  batch?: BatchResponse | null;
  /** OR pass a course slug to auto-resolve the current enrollment batch */
  courseSlug?: string;
}

// map of course slug → primary colors (HSL) used by CSS vars
const themeMap: Record<string, { primary: string; glow: string }> = {
  'english-for-professional-communication': {
    primary: '217 91% 60%',
    glow: '217 91% 60%',
  },
  'graphic-design': {
    primary: '156 70% 42%',
    glow: '156 85% 70%',
  },
};

const Countdown = ({ batch: batchProp, courseSlug }: CountdownProps = {}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [label, setLabel] = useState<string>('');

  // ── Course-slug path (course detail pages & BannerSection) ───────────────
  const { data: courseBySlug, isLoading: courseBySlugLoading } = useGetCourseBySlugQuery(
    courseSlug!, { skip: !courseSlug }
  );
  const slugCourseId = courseSlug ? (courseBySlug?.data as any)?._id : undefined;

  const { data: slugBatchRes, isLoading: slugBatchLoading } = useGetCurrentEnrollmentBatchQuery(
    { courseId: slugCourseId },
    { skip: !slugCourseId }
  );

  // Resolve batch: if a batch is passed directly, use it; otherwise use slug-resolved batch
  const batch = batchProp ?? (courseSlug ? (slugBatchRes?.data as any) : null);

  // derive effective slug from either prop or batch info
  const effectiveSlug = useMemo(() => {
    if (courseSlug) return courseSlug;
    // batch.courseId may be object with slug
    if (batch && typeof batch.courseId === 'object' && (batch.courseId as any).slug) {
      return (batch.courseId as any).slug as string;
    }
    return undefined;
  }, [courseSlug, batch]);

  // compute CSS variable overrides based on slug
  const themeVars = useMemo(() => {
    if (!effectiveSlug) return {};
    const t = themeMap[effectiveSlug];
    if (!t) return {};
    return {
      '--primary': t.primary,
      '--primary-glow': t.glow,
    } as React.CSSProperties;
  }, [effectiveSlug]);

  const enrollmentStart = useMemo(() => batch?.enrollmentStartDate ? new Date(batch.enrollmentStartDate) : null, [batch]);
  const enrollmentEnd = useMemo(() => batch?.enrollmentEndDate ? new Date(batch.enrollmentEndDate) : null, [batch]);

  useEffect(() => {
    if (!batch || !enrollmentStart || !enrollmentEnd) return;

    const tick = () => {
      const now = new Date();
      const batchStatus = batch.status as string;

      let targetDate: Date | null = null;
      let nextLabel = '';

      if (batchStatus === 'upcoming') {
        const enrollmentOpen = isAfter(now, enrollmentStart) && isBefore(now, enrollmentEnd);
        const enrollmentNotYetOpen = isBefore(now, enrollmentStart);

        if (enrollmentOpen) {
          // Enrollment window is currently open → count down to its end
          targetDate = enrollmentEnd;
          nextLabel = 'এনরোলমেন্ট শেষ হতে বাকি';
        } else if (enrollmentNotYetOpen) {
          // Enrollment hasn't started yet → count down to its start
          targetDate = enrollmentStart;
          nextLabel = 'এনরোলমেন্ট শুরু হতে বাকি';
        }
        // If past enrollmentEnd and still "upcoming", nothing to show
      } else if (batchStatus === 'running') {
        // The batch is running — show enrollment end countdown only if still within window
        if (isBefore(now, enrollmentEnd)) {
          targetDate = enrollmentEnd;
          nextLabel = 'এনরোলমেন্ট শেষ হতে বাকি';
        }
      }

      if (targetDate) {
        const duration = intervalToDuration({ start: now, end: targetDate });
        setTimeLeft({
          months: duration.months || 0,
          days: duration.days || 0,
          hours: duration.hours || 0,
          minutes: duration.minutes || 0,
          seconds: duration.seconds || 0,
        });
        setLabel(nextLabel);
      } else {
        setTimeLeft(null);
        setLabel('');
      }
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [batch, enrollmentStart, enrollmentEnd]);

  const isCountdownLoading = courseSlug
    ? (courseBySlugLoading || (!!slugCourseId && slugBatchLoading))
    : false;

  if (isCountdownLoading) return null;
  if (!batch || !timeLeft || !label) return null;

  return (
    <FadeIn delay={0.1} className="mt-8 mb-4" style={themeVars}>
      <div className="text-center space-y-6">
        {/* Status badge */}
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full
          bg-primary/10 border border-primary/25 backdrop-blur-sm
          shadow-[0_0_20px_hsl(156_70%_42%/0.12)]">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <p className="text-xs font-semibold  uppercase text-primary/90 font-bangla">
            {label}
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