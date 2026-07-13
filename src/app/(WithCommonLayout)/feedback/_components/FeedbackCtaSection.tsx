import Link from "next/link";
import { GraduationCap, Award, Heart } from "lucide-react";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

export default function FeedbackCtaSection() {
    return (
        <section className="relative bg-surface overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute -top-10 left-1/4 w-[400px] h-[400px] bg-primary/7 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
                <div className="relative overflow-hidden rounded-3xl
                    bg-gradient-to-br from-[#0a2016] via-[#0d2b1c] to-surface
                    border border-primary/25
                    shadow-[0_0_80px_hsl(156_70%_42%/0.18),inset_0_1px_0_hsl(156_70%_42%/0.15)]
                    p-8 md:p-14 text-center"
                >
                    <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-primary/60 rounded-br-3xl" />
                    <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                    <div className="absolute -top-10 -left-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex justify-center mb-6">
                        <div className="relative p-[1.5px] rounded-full overflow-hidden">
                            <AnimatedBorder variant="simple" speed="4s" />
                            <div className="relative w-16 h-16 rounded-full bg-surface flex items-center justify-center">
                                <GraduationCap className="w-7 h-7 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold uppercase text-primary/90">এখনই যোগ দিন</span>
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

                    <div className="flex items-center gap-3 w-full max-w-xs mx-auto mb-10">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/checkout">
                            <div className="inline-block relative p-[1.5px] rounded-xl overflow-hidden">
                                <AnimatedBorder variant="simple" speed="3s" />
                                <button className="relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark
                                    hover:from-emerald-deep hover:via-emerald-bright hover:to-emerald-deep
                                    transition-all duration-300 text-white font-bold text-base
                                    px-8 py-3.5 rounded-xl
                                    shadow-[0_0_24px_hsl(156_70%_42%/0.4)] hover:shadow-[0_0_36px_hsl(156_70%_42%/0.6)]
                                    cursor-pointer"
                                >
                                    <Award className="w-4 h-4" />
                                    এখনই ভর্তি হন
                                </button>
                            </div>
                        </Link>

                        <Link href="/courses">
                            <button className="inline-flex items-center gap-2
                                bg-surface border border-primary/30 text-white/70
                                hover:border-primary/60 hover:text-white
                                transition-all duration-300
                                px-8 py-3.5 rounded-xl text-base font-semibold cursor-pointer"
                            >
                                <Heart className="w-4 h-4 text-primary/70" />
                                বিস্তারিত জানুন
                            </button>
                        </Link>
                    </div>

                    <p className="mt-10 text-xs text-white/30 tracking-wide">✨ সাপোর্ট • ✨ জব প্লেসমেন্ট সহায়তা</p>
                </div>
            </div>
        </section>
    );
}
