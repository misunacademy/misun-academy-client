import { GraduationCap, Users, Star, TrendingUp, Award, Heart } from "lucide-react";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

export default function FeedbackHeroSection() {
    return (
        <section className="relative overflow-hidden bg-surface">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/7 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 text-center">
                <div className="flex justify-center mb-8">
                    <div className="relative p-[1.5px] rounded-full overflow-hidden">
                        <AnimatedBorder variant="simple" speed="4s" />
                        <div className="relative w-20 h-20 rounded-full bg-surface flex items-center justify-center">
                            <GraduationCap className="w-9 h-9 text-primary" />
                        </div>
                    </div>
                </div>

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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { icon: <Users className="w-6 h-6 text-primary" />, value: "১৫০০+", label: "হ্যাপি শিক্ষার্থী" },
                        { icon: <TrendingUp className="w-6 h-6 text-cyan-400" />, value: "৬ষ্ঠ", label: "ব্যাচ চলছে" },
                        { icon: <Star className="w-6 h-6 text-yellow-400" />, value: "৯৮%", label: "সন্তুষ্টি" },
                        { icon: <Award className="w-6 h-6 text-orange-400" />, value: "৯৪%", label: "কর্মসংস্থান" },
                    ].map((stat, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-2xl
                            bg-surface border border-primary/15 px-5 py-6
                            transition-all duration-300 hover:border-primary/35 hover:-translate-y-0.5
                            hover:shadow-[0_4px_24px_hsl(156_70%_42%/0.15)]"
                        >
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
    );
}
