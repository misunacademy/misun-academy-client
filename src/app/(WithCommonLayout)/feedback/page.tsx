"use client";
import { useState, useMemo } from "react";
import { TestimonialCard } from "@/components/module/testimonial/TestimonialCard";
import { PaginationControls } from "@/components/module/testimonial/PaginationControls";
import { BatchFilter } from "@/components/module/testimonial/BatchFilter";
import { studentFeedbacks } from "@/constants/studentFeedbacks";
import { GraduationCap, Users, Star, TrendingUp, Award, Heart } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

const Feedback = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBatch, setSelectedBatch] = useState("all");

    const batchInfo = useMemo(() => {
        const batches: string[] = [
            ...new Set(
                studentFeedbacks
                    .map(feedback => feedback.batch)
                    .filter((batch): batch is string => batch !== undefined)
            ),
        ].sort((a, b) => b.localeCompare(a));
        const counts = studentFeedbacks.reduce((acc, feedback) => {
            acc[feedback.batch!] = (acc[feedback.batch!] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return { batches, counts };
    }, []);

    const filteredTestimonials = useMemo(() => {
        if (selectedBatch === "all") return [...studentFeedbacks].reverse();
        return studentFeedbacks.filter(feedback => feedback.batch === selectedBatch);
    }, [selectedBatch]);

    const paginatedTestimonials = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTestimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTestimonials, currentPage]);

    const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);

    const handleBatchChange = (batch: string) => {
        setSelectedBatch(batch);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-[#060f0a]">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[#060f0a]">
                {/* Dot-grid */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                {/* Ambient glows */}
                <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/7 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* Edge separator */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 text-center">

                    {/* Icon badge */}
                    <div className="flex justify-center mb-8">
                        <div className="relative p-[1.5px] rounded-full overflow-hidden">
                            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                            <div className="relative w-20 h-20 rounded-full bg-[#060f0a] flex items-center justify-center">
                                <GraduationCap className="w-9 h-9 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">শিক্ষার্থীদের মতামত</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-[140%] mb-6">
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent pt-2">শিক্ষার্থীদের </span>
                        <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.45)]">সফলতার গল্প</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed mb-14">
                        MISUN Academy-র শিক্ষার্থীদের বাস্তব অভিজ্ঞতা ও সফলতার গল্প যা আপনাকে অনুপ্রাণিত করবে
                    </p>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[    // ৭ম
                            { icon: <Users className="w-6 h-6 text-primary" />, value: "১৫০০+", label: "হ্যাপি শিক্ষার্থী" },
                            { icon: <TrendingUp className="w-6 h-6 text-cyan-400" />, value: "৬ষ্ঠ", label: "ব্যাচ চলছে" },
                            { icon: <Star className="w-6 h-6 text-yellow-400" />, value: "৯৮%", label: "সন্তুষ্টি" },
                            { icon: <Award className="w-6 h-6 text-orange-400" />, value: "৯৪%", label: "কর্মসংস্থান" },
                        ].map((stat, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl
                                bg-[#060f0a] border border-primary/15 px-5 py-6
                                transition-all duration-300 hover:border-primary/35 hover:-translate-y-0.5
                                hover:shadow-[0_4px_24px_hsl(156_70%_42%/0.15)]">
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40 rounded-tl-2xl" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40 rounded-tr-2xl" />
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex justify-center mb-2">{stat.icon}</div>
                                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">{stat.value}</div>
                                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CONTENT ── */}
            <section className="relative bg-[#060f0a]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">

                    {/* Section header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">রিভিউ</span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold leading-[140%]">
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent pt-2">আমাদের শিক্ষার্থীরা কী </span>
                            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.4)]">বলছে?</span>
                        </h2>

                        {/* Live stats row */}
                        <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
                                <Heart className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-xs text-white/55">মোট পর্যালোচনা: <strong className="text-white/80">{filteredTestimonials.length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
                                <span className="text-xs text-white/55">পৃষ্ঠা <strong className="text-primary">{currentPage}</strong> / {totalPages}</span>
                            </div>
                        </div>

                        {/* Decorative divider */}
                        <div className="flex items-center gap-3 w-full max-w-xs mx-auto mt-8">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                        </div>
                    </div>

                    {/* Batch filter */}
                    <div className="mb-10">
                        <BatchFilter
                            batches={batchInfo.batches}
                            selectedBatch={selectedBatch}
                            onBatchChange={handleBatchChange}
                            testimonialCounts={batchInfo.counts}
                        />
                    </div>

                    {/* Testimonials grid */}
                    <div id="testimonials-section" className="scroll-mt-20">
                        {paginatedTestimonials.length > 0 ? (
                            <>
                                <div className="columns-1 md:columns-2 lg:columns-3 gap-5 mb-8">
                                    {paginatedTestimonials.map((feedback, index) => (
                                        <div key={index} className="mb-5 break-inside-avoid">
                                            <TestimonialCard
                                                name={feedback.name!}
                                                batch={feedback.batch!}
                                                studentId={feedback?.studentId || "N/A"}
                                                testimonial={feedback.testimonial!}
                                                postLink={feedback.post_link!}
                                                index={index}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15 w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_hsl(156_70%_42%/0.12)]">
                                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40 rounded-tl-2xl" />
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40 rounded-tr-2xl" />
                                    <Users className="w-10 h-10 text-primary/40" />
                                </div>
                                <h3 className="text-lg font-semibold text-white/70 mb-2">কোনো পর্যালোচনা পাওয়া যায়নি</h3>
                                <p className="text-white/35 text-sm">নির্বাচিত ব্যাচে কোনো শিক্ষার্থীর মতামত নেই।</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative bg-[#060f0a] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute -top-10 left-1/4 w-[400px] h-[400px] bg-primary/7 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
                    <div className="relative overflow-hidden rounded-3xl
                        bg-gradient-to-br from-[#0a2016] via-[#0d2b1c] to-[#060f0a]
                        border border-primary/25
                        shadow-[0_0_80px_hsl(156_70%_42%/0.18),inset_0_1px_0_hsl(156_70%_42%/0.15)]
                        p-8 md:p-14 text-center">

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl" />
                        <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl" />
                        <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl" />
                        <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-primary/60 rounded-br-3xl" />
                        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                        <div className="absolute -top-10 -left-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative p-[1.5px] rounded-full overflow-hidden">
                                <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                <div className="relative w-16 h-16 rounded-full bg-[#060f0a] flex items-center justify-center">
                                    <GraduationCap className="w-7 h-7 text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-6">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                            <span className="text-xs font-semibold  uppercase text-primary/90">এখনই যোগ দিন</span>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-bold leading-[145%] mb-5">
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/85 bg-clip-text text-transparent pt-4">আপনিও কি আপনার </span>
                            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.5)]">স্বপ্নের যাত্রা</span>
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/85 bg-clip-text text-transparent"> শুরু করতে প্রস্তুত?</span>
                        </h3>

                        <p className="text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed text-base">
                            MISUN Academy-র কম্প্রিহেনসিভ গ্রাফিক ডিজাইন প্রোগ্রাম-এ যুক্ত হয়ে আপনার ক্যারিয়ারে বিপ্লব আনুন।
                            হাজারো সফল শিক্ষার্থীর মতো আপনিও হয়ে উঠুন একজন দক্ষ ডিজাইনার।
                        </p>

                        {/* Divider */}
                        <div className="flex items-center gap-3 w-full max-w-xs mx-auto mb-10">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/checkout">
                                <div className="inline-block relative p-[1.5px] rounded-xl overflow-hidden">
                                    <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                    <button className="relative inline-flex items-center gap-2 bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                                        hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                                        transition-all duration-300 text-white font-bold text-base
                                        px-8 py-3.5 rounded-xl
                                        shadow-[0_0_24px_hsl(156_70%_42%/0.4)] hover:shadow-[0_0_36px_hsl(156_70%_42%/0.6)]
                                        cursor-pointer">
                                        <Award className="w-4 h-4" />
                                        এখনই ভর্তি হন
                                    </button>
                                </div>
                            </Link>

                            <Link href="/courses">
                                <button className="inline-flex items-center gap-2
                                    bg-[#060f0a] border border-primary/30 text-white/70
                                    hover:border-primary/60 hover:text-white
                                    transition-all duration-300
                                    px-8 py-3.5 rounded-xl text-base font-semibold cursor-pointer">
                                    <Heart className="w-4 h-4 text-primary/70" />
                                    বিস্তারিত জানুন
                                </button>
                            </Link>
                        </div>

                        <p className="mt-10 text-xs text-white/30 tracking-wide">✨ সাপোর্ট • ✨ জব প্লেসমেন্ট সহায়তা</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Feedback;
