import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import { motion } from "framer-motion"
import { StaticImageData } from 'next/image';
import { IllustratorImg, PhotoshopImg } from '@/assets/images';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { MousePointer2 } from "lucide-react";
import FeatureCard from './FeatureCard';
import SkillBadge from './SkillBadge';
import { featureCards } from './featureCardsData';

export default function GraphicsSkills() {
    const skills: { image: StaticImageData; name: string }[] = [
        { image: PhotoshopImg, name: "ফটোশপ" },
        { image: IllustratorImg, name: "ইলাস্ট্রেটর" },
    ];

    return (
        <section className="relative overflow-hidden bg-surface-darker py-24 selection:bg-primary/30 selection:text-white md:py-32">

            {/* Elegant Background Meshes & Masks */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(32,180,134,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(32,180,134,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Subtle Top Glow */}
            <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[400px] w-[800px] -translate-x-1/2 rounded-[100%] bg-primary/[0.06] blur-[100px]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-[100%] bg-emerald-500/[0.04] blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">

                {/*  Hero Header Block  */}
                <div className="flex flex-col items-center justify-center text-center">

                    {/* Modern Glass Badge */}
                    <FadeIn delay={0.1} direction="up">
                        <div className="mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary backdrop-blur-md transition-colors hover:bg-primary/20">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary/80" />
                            </span>
                            গ্রাফিক্স ডিজাইন কোর্স
                        </div>
                    </FadeIn>

                    {/* Crisp Typography Heading & Floating Accents */}
                    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center">

                        {/* Central Glow behind text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                        {/* Mixed background bubbles */}
                        <motion.div animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -left-12 top-0 h-2 w-2 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(32,180,134,0.6)] z-10 hidden md:block pointer-events-none" />
                        <motion.div animate={{ y: [0, 15, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 5, repeat: Infinity }} className="absolute left-1/4 -bottom-10 h-4 w-4 rounded-full bg-primary/30 shadow-[0_0_15px_rgba(32,180,134,0.5)] z-10 hidden md:block pointer-events-none" />
                        <motion.div animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute right-1/4 -top-8 h-3 w-3 rounded-full bg-primary/50 shadow-[0_0_12px_rgba(32,180,134,0.6)] z-10 hidden md:block pointer-events-none" />
                        <motion.div animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute -right-10 bottom-4 h-2.5 w-2.5 rounded-full bg-primary/60 shadow-[0_0_12px_rgba(32,180,134,0.8)] z-10 hidden md:block pointer-events-none" />

                        {/* Floating Ps Icon (Desktop & Tablet) */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-6 md:-left-12 lg:-left-4 top-40 md:top-44 hidden sm:block z-20"
                        >
                            <SkillBadge image={skills[0].image} name={skills[0].name} delay={1} />
                            {/* Decorative Dot */}
                            <div className="absolute -bottom-4 right-4 h-3 w-3 rounded-full bg-primary/60 shadow-[0_0_15px_rgba(32,180,134,0.8)]" />
                        </motion.div>

                        {/* Floating Ai Icon (Desktop & Tablet) */}
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-6 md:-right-12 lg:-right-4 top-28 md:top-32 hidden sm:block z-20"
                        >
                            <SkillBadge image={skills[1].image} name={skills[1].name} delay={2} />
                            {/* Decorative Dot */}
                            <div className="absolute -top-3 -left-8 h-4 w-4 rounded-full bg-primary/80 shadow-[0_0_20px_rgba(32,180,134,0.8)]" />
                        </motion.div>

                        <FadeIn delay={0.2} direction="up" className="relative z-30 w-full pointer-events-none">
                            <h2 className="mb-6 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-7xl lg:leading-[1.1] pointer-events-auto">
                                ক্রিয়েটিভ{" "}
                                <span className="bg-gradient-to-br from-white via-primary to-emerald-700 bg-clip-text text-transparent">
                                    ডিজাইন স্কিলস
                                </span>
                            </h2>
                        </FadeIn>
                    </div>

                    {/* Subtitle */}
                    <FadeIn delay={0.3} direction="up" className="relative z-10">
                        <p className="mx-auto mb-12 max-w-xl text-base leading-relaxed text-zinc-400/80 md:text-lg hover:text-white/80 transition-colors">
                            ইন্ডাস্ট্রি-স্ট্যান্ডার্ড ডিজাইন টুল শিখুন এবং আমাদের পূর্ণাঙ্গ গ্রাফিক্স ডিজাইন কোর্সের মাধ্যমে আপনার সৃজনশীলতা উন্মোচন করুন।
                        </p>
                    </FadeIn>

                    {/* CTA Group */}
                    <FadeIn delay={0.4} direction="up" className="relative z-10 w-full">
                        <div className="mb-14 flex flex-col items-center justify-center gap-8">

                            {/* Mobile Skills inline fallback */}
                            <div className="flex sm:hidden items-center justify-center gap-6">
                                {skills.map((skill, i) => (
                                    <div key={skill.name} className="flex flex-col items-center gap-3">
                                        <SkillBadge {...skill} delay={i + 1} />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                                            {skill.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 hidden md:inline-flex">
                                <Link href="/checkout">
                                    <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                                              shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                                              hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                                              hover:scale-105 hover:-translate-y-0.5
                                              active:scale-95 active:translate-y-0
                                              transition-all duration-300 ease-out">
                                        <AnimatedBorder />
                                        <button className="group relative overflow-hidden
                                                inline-flex items-center gap-2
                                                px-8 py-3.5
                                                text-base font-bold tracking-wide rounded-[10px]
                                                bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark
                                                text-white
                                                hover:from-emerald-deep hover:via-emerald-bright hover:to-emerald-deep
                                                transition-all duration-300 ease-out">
                                            <span className="relative z-10 flex items-center gap-2">
                                                আপনার যাত্রা শুরু করুন
                                                <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                            </span>
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Minimal Divider */}
                    <FadeIn delay={0.5} direction="up">
                        <div className="mb-14 flex w-full max-w-[800px] items-center gap-4 opacity-70">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                            <div className="flex items-center gap-2">
                                <span className="text-primary/60 text-xl select-none">←</span>
                                <span className="relative inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-md font-medium uppercase text-primary backdrop-blur-md shadow-sm">
                                    চার মাসের পুরো এই জার্নিতে যা শিখবেন
                                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary to-emerald-500 blur-lg" />
                                </span>
                                <span className="text-primary/60 text-xl select-none">→</span>
                            </div>

                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                        </div>
                    </FadeIn>
                </div>

                {/* Elegant Glass Cards Grid */}
                <div className="mx-auto grid max-w-[1000px] gap-6 md:grid-cols-3">
                    {featureCards.map((card, i) => (
                        <FeatureCard key={card.title} {...card} index={i} />
                    ))}
                </div>

                <div className="pt-4 md:hidden  flex justify-center items-center">
                    <Link href="/checkout">
                        <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                                              shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                                              hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                                              hover:scale-105 hover:-translate-y-0.5
                                              active:scale-95 active:translate-y-0
                                              transition-all duration-300 ease-out">
                            <AnimatedBorder />
                            <button className="group relative overflow-hidden
                                                inline-flex items-center gap-2
                                                px-8 py-3.5
                                                text-base font-bold tracking-wide rounded-[10px]
                                                bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark
                                                text-white
                                                hover:from-emerald-deep hover:via-emerald-bright hover:to-emerald-deep
                                                transition-all duration-300 ease-out">
                                <span className="relative z-10 flex items-center gap-2">
                                    আপনার যাত্রা শুরু করুন
                                    <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            </button>
                        </div>
                    </Link>
                </div>
            </div>

            {/* keyframes for illustration float */}
            <style>{`@keyframes floatSlow {
                    0%   { transform: translateY(0px) rotate(-2deg) scale(1); }
                    50%  { transform: translateY(-10px) rotate(2deg) scale(1.02); }
                    100% { transform: translateY(0px) rotate(-2deg) scale(1); }
                }`}</style>
        </section>
    );
}
