"use client";

import { useMemo } from 'react';
import { Skeleton } from 'boneyard-js/react'
import { CalendarCheck, CalendarX, ArrowRight } from "lucide-react";
import Countdown from "../course/Countdown";
import { format } from "date-fns";
import { FadeIn } from "../../ui/FadeIn";
import { BatchResponse, CourseInfo } from "@/redux/api/batchApi";
import Link from "next/link";
import { useCurrentBatch } from '@/hooks/useCurrentBatch';
import { COURSE_SLUGS } from '@/constants/courses';

export const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd MMM, yyyy');
};

const themeMap: Record<string, { primary: string; glow: string }> = {
    [COURSE_SLUGS.ENGLISH]: {
        primary: '217 91% 60%',
        glow: '217 91% 60%',
    },
    'graphic-design': {
        primary: '156 70% 42%',
        glow: '156 85% 70%',
    },
};


const getCourseInfo = (courseId: CourseInfo | string): CourseInfo | null => {
    if (typeof courseId === 'object' && courseId !== null) return courseId;
    return null;
};

// ── Per-course enrollment card ────────────────────────────────────────────────

function CourseEnrollmentCard({
    batch,
    serverTimestamp: cardServerTimestamp,
}: {
    batch: BatchResponse;
    serverTimestamp?: number;
}) {
    const course = getCourseInfo(batch.courseId);
    const slug = course?.slug;

    const themeVars = useMemo(() => {
        if (!slug) return {};
        const t = themeMap[slug];
        if (!t) return {};

        return {
            "--primary": t.primary,
            "--primary-glow": t.glow,
        } as React.CSSProperties;
    }, [slug]);

    if (!course) return null;

    return (
        <FadeIn delay={0.1 + 0 * 0.08} direction="up" style={themeVars}>
            <div
                style={themeVars}
                className="
                    group relative overflow-hidden rounded-[2rem]
                    border border-primary/20
                    bg-gradient-to-br from-surface via-surface to-primary/[0.035]
                    shadow-[0_8px_32px_hsl(var(--primary)/0.06)]
                    transition-all duration-500 ease-out
                    hover:-translate-y-1
                    hover:border-primary/40
                    hover:shadow-[0_16px_45px_hsl(var(--primary)/0.14)]
                "
            >
                {/* Corner accents */}
                <div className="absolute left-0 top-0 z-10 h-7 w-7 rounded-tl-[2rem] border-l-2 border-t-2 border-primary/40 transition-all duration-300 group-hover:h-9 group-hover:w-9 group-hover:border-primary/70" />
                <div className="absolute right-0 top-0 z-10 h-7 w-7 rounded-tr-[2rem] border-r-2 border-t-2 border-primary/40 transition-all duration-300 group-hover:h-9 group-hover:w-9 group-hover:border-primary/70" />
                <div className="absolute bottom-0 left-0 z-10 h-7 w-7 rounded-bl-[2rem] border-b-2 border-l-2 border-primary/20 transition-colors duration-300 group-hover:border-primary/45" />
                <div className="absolute bottom-0 right-0 z-10 h-7 w-7 rounded-br-[2rem] border-b-2 border-r-2 border-primary/20 transition-colors duration-300 group-hover:border-primary/45" />

                {/* Top shimmer */}
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

                {/* Inner ambient glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.055] via-transparent to-primary/[0.025]" />

                <div className="relative z-10 flex flex-col gap-6 p-6 md:gap-7 md:p-8">

                    {/* ── Course identity row ── */}
                    <div className="flex items-start gap-4">

                        {/* Title + batch badge */}
                        <div className="min-w-0 flex-1">
                            <div className="
                                mb-2 inline-flex items-center gap-2
                                rounded-full border border-primary/25
                                bg-gradient-to-r from-primary/[0.13] to-primary/[0.045]
                                px-3 py-1.5
                                shadow-[inset_0_1px_0_hsl(var(--primary)/0.08)]
                            ">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.7)]" />
                                </span>

                                <span className="font-bangla text-xs font-bold tracking-wide text-primary-glow">
                                    ব্যাচ-{String(batch?.title?.split(" ")[1])?.padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Countdown ── */}
                    <Countdown
                        batch={batch}
                        courseSlug={course.slug}
                        serverTimestamp={cardServerTimestamp}
                    />

                    {/* ── Dates + Price row ── */}
                    <div className="
                        flex flex-col items-start justify-between gap-5
                        border-t border-primary/15 pt-5
                        sm:flex-row sm:items-center
                    ">

                        {/* Dates */}
                        <div className="flex flex-wrap gap-4 xs:gap-5">

                            <div className="flex items-center gap-2.5">
                                <div className="
                                    flex h-11 w-11 shrink-0 items-center justify-center
                                    rounded-xl border border-primary/25
                                    bg-gradient-to-br from-primary/[0.20] to-primary/[0.035]
                                    text-primary shadow-[0_3px_12px_hsl(var(--primary)/0.07)]
                                    transition-all duration-300
                                    group-hover:border-primary/40
                                    group-hover:shadow-[0_0_16px_hsl(var(--primary)/0.12)]
                                ">
                                    <CalendarCheck size={20} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <div className="font-bangla text-xs font-medium text-white/60">
                                        শুরু
                                    </div>
                                    <div className="mt-0.5 font-mona text-base font-semibold tracking-tight text-white sm:text-lg">
                                        {formatDate(batch.enrollmentStartDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="
                                    flex h-11 w-11 shrink-0 items-center justify-center
                                    rounded-xl border border-red-400/20
                                    bg-gradient-to-br from-red-500/[0.15] to-red-500/[0.025]
                                    text-red-400 transition-all duration-300
                                    group-hover:border-red-400/35
                                ">
                                    <CalendarX size={20} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <div className="font-bangla text-xs font-medium text-white/60">
                                        শেষ
                                    </div>
                                    <div className="mt-0.5 font-mona text-base font-semibold tracking-tight text-white sm:text-lg">
                                        {formatDate(batch.enrollmentEndDate)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex w-full shrink-0 items-center justify-between gap-4 sm:w-auto sm:justify-start">

                            {/* Price badge */}
                            <div className="
                                flex items-baseline gap-1.5 rounded-xl
                                border border-primary/15
                                bg-gradient-to-br from-primary/[0.10] to-primary/[0.025]
                                px-3.5 py-2
                            ">
                                <span className="font-bangla text-sm font-semibold text-primary-glow">
                                    ফি
                                </span>

                                <span className="font-mona text-xl font-extrabold tracking-tight text-primary-glow tabular-nums sm:text-2xl">
                                    {batch.price
                                        ? batch.price.toLocaleString("en-IN")
                                        : "--"}
                                </span>

                                <span className="font-bangla text-sm font-semibold text-primary-glow">
                                    ৳
                                </span>
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/checkout?course=${course.slug}`}
                                aria-label="এনরোল করুন"
                                className="
                                    shrink-0 rounded-xl
                                    focus-visible:outline-none
                                    focus-visible:ring-2 focus-visible:ring-primary
                                    focus-visible:ring-offset-2
                                    focus-visible:ring-offset-surface
                                "
                            >
                                <div className="
                                    group/btn relative isolate flex min-h-[46px]
                                    items-center gap-2 overflow-hidden rounded-xl
                                    border border-primary/40
                                    bg-primary px-5 py-3
                                    font-bangla text-sm font-bold
                                    text-primary-foreground
                                    shadow-[0_4px_16px_hsl(var(--primary)/0.18)]
                                    transition-all duration-300
                                    hover:-translate-y-0.5
                                    hover:border-primary/70
                                    hover:shadow-[0_8px_24px_hsl(var(--primary)/0.32)]
                                    active:translate-y-0
                                    cursor-pointer
                                ">
                                    <span className="
                                        pointer-events-none absolute inset-0 -z-10
                                        -translate-x-full
                                        bg-gradient-to-r from-transparent via-white/15 to-transparent
                                        transition-transform duration-700
                                        group-hover/btn:translate-x-full
                                    " />

                                    <span>এনরোল করুন</span>

                                    <ArrowRight
                                        size={15}
                                        strokeWidth={2.2}
                                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}


// ── Main Section ──────────────────────────────────────────────────────────────
export const EnrollmentSection = () => {
    const { batch, isLoading, serverTimestamp } = useCurrentBatch();

    return (
        <Skeleton name="EnrollmentSection" loading={isLoading}>
            {!batch ? null : (
                <section
                    id="enroll-now"
                    data-dark-section
                    className="relative scroll-mt-24 py-24 px-4 bg-surface-darker overflow-hidden font-bangla selection:bg-primary/30 selection:text-white"
                >

                    {/* Elegant Background Meshes & Masks */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(32,180,134,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(32,180,134,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                    {/* Subtle Top Glow */}
                    <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[400px] w-[800px] -translate-x-1/2 rounded-[100%] bg-primary/[0.06] blur-[100px]" />
                    <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-[100%] bg-emerald-500/[0.04] blur-[120px]" />

                    <div className="relative z-10 max-w-4xl mx-auto">

                        {/* ── Section header ── */}
                        <FadeIn className="text-center space-y-4 mb-14">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-primary/10 border border-primary/25 backdrop-blur-sm
                        shadow-[0_0_15px_hsl(156_70%_42%/0.12)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                <span className="text-xs font-semibold text-primary-glow font-bangla">
                                    ভর্তি চলছে
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-white">
                                <span className="relative inline-block pt-2 text-primary-glow">
                                    কোর্সে ভর্তি
                                    <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full
                                bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                                </span>
                                <span className="text-white">
                                    {' '}হতে চান? সময়ের সঙ্গে পাল্লা দিন!
                                </span>
                            </h2>

                            {/* Decorative divider */}
                            <div className="flex items-center justify-center gap-3 pt-1">
                                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
                                <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/60" />
                                <div className="h-px w-32 bg-gradient-to-r from-primary/60 to-primary/20" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                <div className="h-px w-16 bg-gradient-to-r from-primary/20 to-transparent" />
                            </div>

                            <p className="readable-body max-w-2xl mx-auto">
                                তাই আর দেরি না করে এখনই প্রস্তুতি নিন, কারণ সময় শেষ হয়ে গেলে আবার অপেক্ষা...!
                            </p>
                        </FadeIn>

                        {/* ── Course cards ── */}

                        <CourseEnrollmentCard batch={batch} serverTimestamp={serverTimestamp} />



                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </section>
            )}
        </Skeleton>
    );
};