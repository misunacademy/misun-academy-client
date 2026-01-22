"use client";
import { useState, useMemo } from "react";
import { TestimonialCard } from "@/components/module/testimonial/TestimonialCard";
import { PaginationControls } from "@/components/module/testimonial/PaginationControls";
import { BatchFilter } from "@/components/module/testimonial/BatchFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studentFeedbacks } from "@/constants/studentFeedbacks";
import { GraduationCap, Users, Star, TrendingUp, Award, Heart } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

const Feedback = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBatch, setSelectedBatch] = useState("all");

    // Get unique batches and count testimonials per batch
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

    // Filter testimonials based on selected batch
    const filteredTestimonials = useMemo(() => {
        if (selectedBatch === "all") {
            return [...studentFeedbacks].reverse();
        }
        return studentFeedbacks.filter(feedback => feedback.batch === selectedBatch);
    }, [selectedBatch]);

    // Paginate filtered testimonials
    const paginatedTestimonials = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTestimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTestimonials, currentPage]);

    const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);

    // Reset to first page when filter changes
    const handleBatchChange = (batch: string) => {
        setSelectedBatch(batch);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Smooth scroll to top of testimonials section
        document.getElementById('testimonials-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div className="min-h-screen">
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden bg-gradient-hero py-20 px-4 bg-primary">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm"></div>
                <div className="absolute top-10 left-10 animate-bounce-gentle">
                    <div className="w-20 h-20 bg-primary/10 rounded-full"></div>
                </div>
                <div className="absolute bottom-10 right-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
                    <div className="w-16 h-16 bg-primary-glow/10 rounded-full"></div>
                </div>

                <div className="relative max-w-6xl mx-auto text-center">
                    <div className="flex justify-center mb-8 animate-scale-in">
                        <div className="p-6 bg-primary-foreground/20 rounded-full shadow-glow">
                            <GraduationCap className="w-16 h-16 text-primary-foreground" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in-up">
                        শিক্ষার্থীদের মতামত
                    </h1>

                    <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        MISUN Academy-র শিক্ষার্থীদের বাস্তব অভিজ্ঞতা ও সফলতার গল্প যা আপনাকে অনুপ্রাণিত করবে
                    </p>

                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            <Users className="w-10 h-10 text-primary-foreground mx-auto mb-3" />
                            <div className="text-3xl font-bold text-primary-foreground">১৫০০+</div>
                            <div className="text-primary-foreground/80">হ্যাপি শিক্ষার্থী</div>
                        </div>

                        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                            <TrendingUp className="w-10 h-10 text-primary-foreground mx-auto mb-3" />
                            <div className="text-3xl font-bold text-primary-foreground">৬ষ্ঠ</div>
                            <div className="text-primary-foreground/80">ব্যাচ চলছে</div>
                        </div>

                        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                            <Star className="w-10 h-10 text-primary-foreground mx-auto mb-3" />
                            <div className="text-3xl font-bold text-primary-foreground">৯৮%</div>
                            <div className="text-primary-foreground/80">সন্তুষ্টি</div>
                        </div>

                        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                            <Award className="w-10 h-10 text-primary-foreground mx-auto mb-3" />
                            <div className="text-3xl font-bold text-primary-foreground">৯৪%</div>
                            <div className="text-primary-foreground/80">কর্মসংস্থান</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
                {/* Section Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-4xl font-bold text-foreground mb-6">
                        আমাদের শিক্ষার্থীরা কী বলছে?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        কীভাবে MISUN Academy শিক্ষার্থীদের জীবন পরিবর্তন করেছে—জেনে নিন তাদের মুখে
                    </p>

                    {/* Live Stats */}
                    <div className="flex justify-center items-center mt-8 space-x-6">
                        <div className="flex items-center space-x-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-muted-foreground">
                                মোট পর্যালোচনা: <strong>{filteredTestimonials.length}</strong>
                            </span>
                        </div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="animate-pulse">
                                পৃষ্ঠা {currentPage} / {totalPages}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Batch Filter */}
                <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <BatchFilter
                        batches={batchInfo.batches}
                        selectedBatch={selectedBatch}
                        onBatchChange={handleBatchChange}
                        testimonialCounts={batchInfo.counts}
                    />
                </div>

                {/* Testimonials Grid */}
                <div id="testimonials-section" className="scroll-mt-20">
                    {paginatedTestimonials.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                {paginatedTestimonials.map((feedback, index) => (
                                    <TestimonialCard
                                        key={index}
                                        name={feedback.name!}
                                        batch={feedback.batch!}
                                        studentId={feedback?.studentId || "N/A"}
                                        testimonial={feedback.testimonial!}
                                        postLink={feedback.post_link!}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="animate-fade-in-up">
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                কোনো পর্যালোচনা পাওয়া যায়নি
                            </h3>
                            <p className="text-muted-foreground">
                                নির্বাচিত ব্যাচে কোনো শিক্ষার্থীর মতামত নেই।
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Call to Action */}
            <div className="relative bg-primary py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm"></div>

                {/* Floating elements */}
                <div className="absolute top-5 left-5 w-32 h-32 bg-primary/5 rounded-full animate-bounce-gentle"></div>
                <div className="absolute bottom-5 right-5 w-24 h-24 bg-primary-glow/5 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>

                <div className="relative max-w-5xl mx-auto text-center">
                    <div className="animate-scale-in">
                        <GraduationCap className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6 animate-fade-in-up">
                        আপনিও কি আপনার স্বপ্নের যাত্রা শুরু করতে প্রস্তুত?
                    </h3>

                    <p className="text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        MISUN Academy-র কমপ্রিহেনসিভ গ্রাফিক ডিজাইন প্রোগ্রাম-এ যুক্ত হয়ে আপনার ক্যারিয়ারে বিপ্লব আনুন।
                        হাজারো সফল শিক্ষার্থীর মতো আপনিও হয়ে উঠুন একজন দক্ষ ডিজাইনার।
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <Link href={"/checkout"}>
                            <Button
                                size="lg"
                                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                            >
                                <Award className="w-5 h-5 mr-2" />
                                এখনই ভর্তি হন
                            </Button>
                        </Link>

                        <Link href={"/courses"}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="hover:bg-white hover:text-primary bg-primary text-white border-white hover:border-none transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                            >
                                <Heart className="w-5 h-5 mr-2" />
                                বিস্তারিত জানুন
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 text-sm text-primary-foreground/70 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                        <p>✨ সাপোর্ট • ✨ জব প্লেসমেন্ট সহায়তা</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;