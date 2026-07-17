import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import { motion } from "framer-motion"
import { Mic, Pencil, MousePointer2 } from "lucide-react"
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { SkillBadge } from './EnglishSkillsSkillBadge';
import { featureCards } from './englishSkillsData';

//  Section 

export default function EnglishSkills() {
    const skills = [
        { icon: <Mic />, name: "স্পোকেন" },
        { icon: <Pencil />, name: "রাইটিং" },
    ];

    return (
        <section className="relative overflow-hidden bg-surface-darker py-24 selection:bg-blue-400/30 selection:text-white md:py-32">

            {/* Elegant Background Meshes & Masks */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Subtle Top Glow */}
            <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[400px] w-[800px] -translate-x-1/2 rounded-[100%] bg-blue-400/[0.06] blur-[100px]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-[100%] bg-emerald-500/[0.04] blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">

                {/*  Hero Header Block  */}
                <div className="flex flex-col items-center justify-center text-center">

                    {/* Modern Glass Badge */}
                    <FadeIn delay={0.1} direction="up">
                        <div className="mb-8 flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-400 backdrop-blur-md transition-colors hover:bg-blue-400/20">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400/80" />
                            </span>
                            ইংরেজি ভাষা কোর্স
                        </div>
                    </FadeIn>

                    {/* Crisp Typography Heading & Floating Accents */}
                    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center">

                        {/* Central Glow behind text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-400/20 blur-[80px] rounded-full pointer-events-none" />

                        {/* Mixed background bubbles */}
                        <motion.div animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -left-12 top-0 h-2 w-2 rounded-full bg-blue-400/40 shadow-[0_0_10px_rgba(59,130,246,0.6)] z-10 hidden md:block pointer-events-none" />
                        <motion.div animate={{ y: [0, 15, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 5, repeat: Infinity }} className="absolute left-1/4 -bottom-10 h-4 w-4 rounded-full bg-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 hidden md:block pointer-events-none" />
                        <motion.div animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute right-1/4 -top-8 h-3 w-3 rounded-full bg-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.6)] z-10 hidden md:block pointer-events-none" />
                        <motion.div animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute -right-10 bottom-4 h-2.5 w-2.5 rounded-full bg-blue-400/60 shadow-[0_0_12px_rgba(59,130,246,0.8)] z-10 hidden md:block pointer-events-none" />

                        {/* Floating Spoken Icon (Desktop & Tablet) */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-6 md:-left-12 lg:-left-4 top-40 md:top-44 hidden sm:block z-20"
                        >
                            <SkillBadge icon={skills[0].icon} name={skills[0].name} delay={1} />
                            {/* Decorative Dot */}
                            <div className="absolute -bottom-4 right-4 h-3 w-3 rounded-full bg-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                        </motion.div>

                        {/* Floating Writing Icon (Desktop & Tablet) */}
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-6 md:-right-12 lg:-right-4 top-28 md:top-32 hidden sm:block z-20"
                        >
                            <SkillBadge icon={skills[1].icon} name={skills[1].name} delay={2} />
                            {/* Decorative Dot */}
                            <div className="absolute -top-3 -left-8 h-4 w-4 rounded-full bg-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                        </motion.div>

                        <FadeIn delay={0.2} direction="up" className="relative z-30 w-full pointer-events-none">
                            <h2 className="mb-6 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-7xl lg:leading-[1.1] pointer-events-auto drop-shadow-lg">
                                আপনার{" "}
                                <span className="bg-gradient-to-br from-white via-blue-400 to-emerald-700 bg-clip-text text-transparent">
                                    ইংরেজি স্কিলস
                                </span>
                            </h2>
                        </FadeIn>
                    </div>

                    {/* Subtitle */}
                    <FadeIn delay={0.3} direction="up" className="relative z-10">
                        <p className="mx-auto mb-12 max-w-xl text-base leading-relaxed text-zinc-400/80 md:text-lg hover:text-white/80 transition-colors">
                            বিশ্বের সাথে তাল মিলিয়ে চলতে স্পোকেন ইংলিশ, আইইএলটিএস এবং কর্পোরেট কমিউনিকেশনে নিজেকে তৈরি করুন।
                        </p>
                    </FadeIn>

                    {/* CTA Group */}
                    <FadeIn delay={0.4} direction="up" className="relative z-10 w-full">
                        <div className="mb-20 flex flex-col items-center justify-center gap-8">

                            {/* Mobile Skills inline fallback */}
                            <div className="flex sm:hidden items-center justify-center gap-6">
                                {skills.map((skill, i) => (
                                    <div key={skill.name} className="flex flex-col items-center gap-3">
                                        <SkillBadge {...skill} delay={i + 1} />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/60">
                                            {skill.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                                <div className="pt-4 hidden md:inline-flex">
                                <Link href="/checkout">
                                    {/* Spinning glowing border wrapper */}
                                    <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                                              shadow-[0_4px_24px_rgba(59,130,246,0.35)]
                                              hover:shadow-[0_8px_36px_rgba(59,130,246,0.60)]
                                              hover:scale-105 hover:-translate-y-0.5
                                              active:scale-95 active:translate-y-0
                                              transition-all duration-300 ease-out">
                                        <AnimatedBorder variant="blue-branded" speed="3s" />
                                        <button className="group relative overflow-hidden
                                                inline-flex items-center gap-2
                                                px-8 py-3.5
                                                text-base font-bold tracking-wide rounded-[10px]
                                                bg-gradient-to-r from-blue-800 via-blue-400 to-blue-700
                                                text-white
                                                hover:from-blue-700 hover:via-blue-300 hover:to-blue-700
                                                transition-all duration-300 ease-out">
                                            <span className="relative z-10 flex items-center gap-2">
                                                আপনার যাত্রা শুরু করুন
                                                <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                            </span>
                                            {/* Shine sweep */}
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
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
                            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-blue-400/60">যা শিখবেন</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
                        </div>
                    </FadeIn>
                </div>

                {/* Elegant Glass Cards Grid */}
                <div className="mx-auto grid max-w-[1000px] gap-6 md:grid-cols-3">
                    {featureCards.map((card, i) => (
                        <FeatureCard key={card.title} {...card} index={i} />
                    ))}
                </div>

                    <div className="pt-4 md:hidden flex justify-center items-center">
                                    <Link href="/checkout">
                                        {/* Spinning glowing border wrapper */}
                                        <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                                                              shadow-[0_4px_24px_rgba(59,130,246,0.35)]
                                                              hover:shadow-[0_8px_36px_rgba(59,130,246,0.60)]
                                                              hover:scale-105 hover:-translate-y-0.5
                                                              active:scale-95 active:translate-y-0
                                                              transition-all duration-300 ease-out">
                                            <AnimatedBorder />
                                            <button className="group relative overflow-hidden
                                                                inline-flex items-center gap-2
                                                                px-8 py-3.5
                                                                text-base font-bold tracking-wide rounded-[10px]
                                                                bg-gradient-to-r from-blue-800 via-blue-400 to-blue-700
                                                                text-white
                                                                hover:from-blue-700 hover:via-blue-300 hover:to-blue-700
                                                                transition-all duration-300 ease-out">
                                                <span className="relative z-10 flex items-center gap-2">
                                                   আপনার যাত্রা শুরু করুন
                                                    <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                                </span>
                                                {/* Shine sweep */}
                                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                            </button>
                                        </div>
                                    </Link>
                                </div>

            </div>
        </section>
    );
}

//  Feature Card 

function FeatureCard({
    icon,
    title,
    description,
    index,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.06)]"
        >
            {/* Animated Glowing Border Background */}
            <AnimatedBorder variant="blue-accent" speed="4s" />

            {/* Inner Card Background */}
            <div className="relative h-full w-full rounded-[15px] bg-surface-darker p-8 border border-white/[0.02] backdrop-blur-md transition-colors duration-500 group-hover:bg-surface">

                {/* Top Shine (Subtle hover effect) */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Icon Box */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/[0.15] bg-blue-400/[0.05] text-blue-400 transition-colors duration-500 group-hover:bg-blue-400/[0.1] group-hover:text-[hsl(var(--primary-glow))]">
                    {icon}
                </div>

                {/* Content */}
                <h3 className="mb-3 text-[17px] font-semibold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-white">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}
