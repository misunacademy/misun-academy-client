"use client";
import { useState, useMemo } from "react";
import { TestimonialCard } from "@/components/module/testimonial/TestimonialCard";
import { PaginationControls } from "@/components/module/testimonial/PaginationControls";
import { BatchFilter } from "@/components/module/testimonial/BatchFilter";
import { studentFeedbacks } from "@/constants/studentFeedbacks";
import { Users } from "lucide-react";
import FeedbackHeroSection from "./_components/FeedbackHeroSection";
import FeedbackCtaSection from "./_components/FeedbackCtaSection";

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
        <div className="min-h-screen bg-surface">
            <FeedbackHeroSection />

            <section className="relative bg-surface">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
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

                        <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
                                <span className="text-xs text-white/55">মোট পর্যালোচনা: <strong className="text-white/80">{filteredTestimonials.length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
                                <span className="text-xs text-white/55">পৃষ্ঠা <strong className="text-primary">{currentPage}</strong> / {totalPages}</span>
                            </div>
                        </div>

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

                    <div className="mb-10">
                        <BatchFilter
                            batches={batchInfo.batches}
                            selectedBatch={selectedBatch}
                            onBatchChange={handleBatchChange}
                            testimonialCounts={batchInfo.counts}
                        />
                    </div>

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
                                <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15 w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_hsl(156_70%_42%/0.12)]">
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

            <FeedbackCtaSection />
        </div>
    );
};

export default Feedback;
