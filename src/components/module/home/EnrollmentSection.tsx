/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from 'react';
import { CalendarCheck, CalendarX, ArrowRight } from "lucide-react";
import Countdown from "../course/Countdown";
import { format } from "date-fns";
import { FadeIn } from "../../ui/FadeIn";
import {  BatchResponse, CourseInfo, useGetCurrentEnrollmentBatchQuery } from "@/redux/api/batchApi";
import Link from "next/link";
import { useGetCourseBySlugQuery } from '@/redux/api/courseApi';

export const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd MMM, yyyy');
};

// theme definitions matching Countdown
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


const getCourseInfo = (courseId: CourseInfo | string): CourseInfo | null => {
    if (typeof courseId === 'object' && courseId !== null) return courseId;
    return null;
};

// ── Per-course enrollment card ────────────────────────────────────────────────
function CourseEnrollmentCard({ batch }: { batch: BatchResponse; }) {
    const course = getCourseInfo(batch.courseId);
    const slug = course?.slug;
    const themeVars = useMemo(() => {
        if (!slug) return {};
        const t = themeMap[slug];
        if (!t) return {};
        return {
            '--primary': t.primary,
            '--primary-glow': t.glow,
        } as React.CSSProperties;
    }, [slug]);
    if (!course) return null;

    return (
        <FadeIn delay={0.1 + 0 * 0.08} direction="up" style={themeVars}>
            <div style={themeVars} className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-[#060f0a]
                hover:border-primary/35 hover:shadow-[0_0_40px_hsl(var(--primary)/0.12)]
                transition-all duration-500 group">

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-[2rem] z-10" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-[2rem] z-10" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/15 rounded-bl-[2rem] z-10" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/15 rounded-br-[2rem] z-10" />

                {/* Top shimmer */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                {/* Inner ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/4 to-transparent pointer-events-none" />

                <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6">

                    {/* ── Course identity row ── */}
                    <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        {/* <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-primary/20
                            shadow-[0_0_14px_hsl(156_70%_42%/0.15)] group-hover:border-primary/40 transition-colors">
                            {course.thumbnailImage ? (
                                <Image
                                    src={course.thumbnailImage}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <BookOpen size={24} className="text-primary/60" />
                                </div>
                            )}
                        </div> */}

                        {/* Title + batch badge */}
                        <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                bg-primary/10 border border-primary/20 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary/80 font-bangla">
                                    ব্যাচ-{String(batch?.title?.split(' ')[1])?.padStart(2, '0')}
                                </span>
                            </div>
                            {/* <h3 className="text-white font-bold text-lg leading-tight font-bangla line-clamp-2
                                group-hover:text-primary/90 transition-colors">
                                {course.title}
                            </h3> */}
                            {/* {course.shortDescription && (
                                <p className="text-white/45 text-xs mt-1 leading-relaxed font-bangla line-clamp-2">
                                    {course.shortDescription}
                                </p>
                            )} */}
                        </div>
                    </div>

                    {/* ── Countdown ── */}
                    {/* pass slug if available so countdown can theme itself */}
                    <Countdown batch={batch} courseSlug={course.slug} />

                    {/* ── Dates + Price row ── */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                        pt-4 border-t border-primary/10">

                        {/* Dates */}
                        <div className="flex  gap-3 xs:gap-5">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center
                                    bg-gradient-to-br from-primary/20 to-primary/5
                                    rounded-lg border border-primary/20">
                                    <CalendarCheck size={20} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-base text-white/40 uppercase tracking-widest font-bangla">শুরু</div>
                                    <div className="text-white/75 text-lg font-medium">{formatDate(batch.enrollmentStartDate)}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center
                                    bg-gradient-to-br from-red-500/15 to-red-500/5
                                    rounded-lg border border-red-500/20">
                                    <CalendarX size={20} className="text-red-400" />
                                </div>
                                <div>
                                    <div className="text-base text-white/40 uppercase tracking-widest font-bangla">শেষ</div>
                                    <div className="text-white/75 text-lg font-medium">{formatDate(batch.enrollmentEndDate)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Price badge */}
                            <div className="flex items-baseline gap-1">
                                <span className="text-primary/70 text-xs font-bangla">ফি</span>
                                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent
                                    text-xl font-bold font-mona tabular-nums">
                                    {batch.price ? batch.price.toLocaleString('en-IN') : '--'}
                                </span>
                                <span className="text-primary/70 text-xs font-bangla">৳</span>
                            </div>

                            {/* CTA */}
                            <Link href={`/checkout?course=${course.slug}`}>
                                <div className="relative overflow-hidden flex items-center gap-1.5
                                    px-4 py-2 rounded-xl font-bangla text-sm font-bold
                                    bg-gradient-to-r from-primary/20 to-primary/10
                                    border border-primary/30 text-primary
                                    hover:from-primary/30 hover:to-primary/20 hover:border-primary/50
                                    hover:shadow-[0_0_16px_hsl(var(--primary)/0.3)]
                                    transition-all duration-300 group/btn cursor-pointer">
                                    <span>এনরোল করুন</span>
                                    <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
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
    const { data: gdCourseData, isLoading: gdCourseLoading } = useGetCourseBySlugQuery('complete-graphic-design-with-freelancing');
    const gdCourseId = (gdCourseData?.data as any)?._id;
    const { data: gdCurrentRes, isLoading: gdCurrentLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId });


    const batch = useMemo(() => (gdCurrentRes?.data ?? {}) as BatchResponse, [gdCurrentRes]);

    if (gdCourseLoading || gdCurrentLoading) {
        return (
            <section id="enroll-now" className="relative scroll-mt-24 py-20 px-4 bg-[#060f0a] font-bangla">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-white/40 text-sm animate-pulse">লোড হচ্ছে...</p>
                </div>
            </section>
        );
    }



    return (
        <section
            id="enroll-now"
            data-dark-section
            className="relative scroll-mt-24 py-24 px-4 bg-[#060f0a] overflow-hidden font-bangla"
        >
            {/* ── Top edge ── */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* ── Dot-grid texture ── */}
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* ── Ambient glows ── */}
            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-[10%] w-[300px] h-[200px] bg-primary/6 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 right-[10%] w-[260px] h-[180px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">

                {/* ── Section header ── */}
                <FadeIn className="text-center space-y-4 mb-14">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-primary/10 border border-primary/25 backdrop-blur-sm
                        shadow-[0_0_15px_hsl(156_70%_42%/0.12)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        <span className="text-xs font-semibold  uppercase text-primary/90 font-bangla">
                            ভর্তি চলছে
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-wide">
                        <span className="relative inline-block pt-2
                            bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                            কোর্সে ভর্তি
                            <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full
                                bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                        </span>
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
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

                    <p className="text-white/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        তাই আর দেরি না করে এখনই প্রস্তুতি নিন, কারণ সময় শেষ হয়ে গেলে আবার অপেক্ষা...!
                    </p>
                </FadeIn>

                {/* ── Course cards ── */}

                    <CourseEnrollmentCard batch={batch}  />

        

            </div>

            {/* ── Bottom edge ── */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </section>
    );
};