/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CalendarCheck, CalendarX } from "lucide-react";
import { useGetCurrentEnrollmentBatchQuery } from "@/redux/api/batchApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import Countdown from "../course/Countdown";
import { format } from "date-fns";
import { FadeIn } from "../../ui/FadeIn";

const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd MMMM, yyyy');
};

export const EnrollmentSection = () => {
    const { data: settingsData, isLoading: settingsLoading } = useGetSettingsQuery();
    const featuredCourseId = (settingsData?.data?.featuredEnrollmentCourse as any)?._id;
    const featuredBatchId = (settingsData?.data?.featuredEnrollmentBatch as any)?._id;

    const { data: batchData, isLoading: batchLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: featuredCourseId },
        { skip: !featuredCourseId || !!featuredBatchId }
    );

    const { data: featuredBatchData, isLoading: featuredBatchLoading } = useGetBatchByIdQuery(
        featuredBatchId || "",
        { skip: !featuredBatchId }
    );

    const batch = featuredBatchData?.data || batchData?.data;


    if (settingsLoading || batchLoading || featuredBatchLoading) {
        return (
            <section className="relative py-16 px-4 bg-[#060f0a] font-bangla">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <p className="text-white/60">Loading enrollment information...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!featuredCourseId) {
        return (
            <section className="relative py-16 px-4 bg-[#060f0a] font-bangla">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <p className="text-white/60">No featured course selected for enrollment.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!batch) {
        return (
            <section className="relative py-16 px-4 bg-[#060f0a] font-bangla">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <p className="text-white/60">No active enrollment batches available at the moment.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            data-dark-section
            className="relative py-24 px-4 bg-[#060f0a] overflow-hidden font-bangla"
        >
            {/* ── Top edge separator ── */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* ── Dot-grid texture ── */}
            <div
                className="absolute inset-0 opacity-[0.18] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* ── Ambient glows ── */}
            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/12 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-[10%] w-[300px] h-[200px] bg-primary/7 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 right-[10%] w-[260px] h-[180px] bg-primary/6 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                {/* ── Hero Header ── */}
                <FadeIn className="text-center space-y-5">
                    {/* Premium badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-primary/10 border border-primary/25 backdrop-blur-sm mb-2
                        shadow-[0_0_15px_hsl(156_70%_42%/0.15)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">
                            ভর্তি চলছে
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-wide
                        bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                        <span className="relative inline-block
                            bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                            কোর্সে ভর্তি
                            <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                        </span>{' '}
                        হতে চান? সময়ের সঙ্গে পাল্লা দিন!
                    </h2>

                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
                        <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/60" />
                        <div className="h-px w-32 bg-gradient-to-r from-primary/60 to-primary/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <div className="h-px w-16 bg-gradient-to-r from-primary/20 to-transparent" />
                    </div>

                    <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        তাই আর দেরি না করে এখনই প্রস্তুতি নিন, কারণ সময় শেষ হয়ে গেলে আবার অপেক্ষা...!
                    </p>

                    {/* ── Countdown Timer ── */}
                    <Countdown />
                </FadeIn>

                {/* ── Information Cards ── */}
                <FadeIn delay={0.2} direction="up">
                    <div className="relative overflow-hidden flex flex-col items-center gap-8 mt-12
                        bg-[#060f0a] border border-primary/15
                        p-8 md:p-10 rounded-[2rem] mx-auto max-w-4xl
                        hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10
                        transition-all duration-500">

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-[2rem]" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-[2rem]" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/15 rounded-bl-[2rem]" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/15 rounded-br-[2rem]" />
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                        {/* Dates row */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-white/90 font-medium text-lg w-full">

                            {/* Start date */}
                            <div className="flex items-center gap-5 group">
                                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38] rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                    <CalendarCheck className="text-white" size={22} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-white/50 uppercase tracking-widest mb-0.5">এনরোলমেন্ট শুরু</div>
                                    <div className="text-white text-xl font-semibold tracking-wide">{batch?.enrollmentStartDate ? formatDate(batch.enrollmentStartDate) : ''}</div>
                                </div>
                            </div>

                            {/* Divider line (hidden on mobile) */}
                            <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

                            {/* End date */}
                            <div className="flex items-center gap-5 group">
                                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-500/80 to-red-400 rounded-xl shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                                    <CalendarX className="text-white" size={22} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-white/50 uppercase tracking-widest mb-0.5">এনরোলমেন্ট শেষ</div>
                                    <div className="text-white text-xl font-semibold tracking-wide">{batch?.enrollmentEndDate ? formatDate(batch.enrollmentEndDate) : ''}</div>
                                </div>
                            </div>

                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                        {/* Price Tag */}
                        <div className="relative z-10 flex justify-center w-full">
                            <div className="relative group overflow-hidden rounded-full p-[2px] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(156_70%_42%/0.3)] bg-[#060f0a]">
                                {/* Spinning Gradient Border */}
                                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
                                    style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 25%, hsl(156 70% 42% / 0.6) 38%, hsl(156 80% 58%) 48%, hsl(156 90% 80%) 53%, hsl(0 0% 100% / 0.9) 56%, hsl(156 90% 80%) 59%, hsl(156 80% 58%) 64%, hsl(156 70% 42% / 0.4) 72%, transparent 82%)' }} />

                                <div className="relative flex items-center gap-3 bg-[#060f0a] px-8 py-3.5 rounded-full z-10 h-full w-full">
                                    <span className="text-white/70 text-lg">কোর্স ফি:</span>
                                    <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent text-2xl font-bold drop-shadow-sm font-mona tabular-nums">
                                        {batch?.price ? batch.price.toLocaleString('en-IN') : '--'}
                                    </span>
                                    <span className="text-primary font-bold text-xl">টাকা</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </FadeIn>
            </div>
            {/* ── Bottom edge separator ── */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </section>
    );
};