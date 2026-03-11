"use client"

import { motion } from "framer-motion"
import { FaTools, FaProjectDiagram, FaUserTie } from "react-icons/fa"
import Image, { StaticImageData } from 'next/image';
import { IllustratorImg, PhotoshopImg } from '@/assets/images';
import WorkspaceIllustration from '@/assets/3d-elements/graphic-design-workplace-illustration.png';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { MousePointer2 } from "lucide-react";

//  Skill Badge 

interface SkillBadgeProps {
    image: StaticImageData;
    name: string;
    delay?: number;
}

const SkillBadge = ({ image, name, delay = 0 }: SkillBadgeProps) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="group relative cursor-pointer"
                >
                    <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/[0.1] bg-primary/[0.02] backdrop-blur-md transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-primary/[0.25] group-hover:bg-primary/[0.05] group-hover:shadow-[0_8px_30px_rgba(32,180,134,0.15)] z-10">
                        <Image
                            src={image.src}
                            alt={name}
                            width={44}
                            height={44}
                            className="h-11 w-11 object-contain drop-shadow transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                    </div>
                </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="rounded-lg border border-primary/[0.15] bg-[#060f0a] px-3 py-1.5 font-medium text-primary shadow-xl">
                <p>{name}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

//  Data 

const featureCards = [
    {
        icon: <FaTools className="h-5 w-5" />,
        title: "ইন্ডাস্ট্রি স্ট্যান্ডার্ড টুলস",
        description: "বিশ্বের সেরা ডিজাইন স্টুডিওগুলো যেসব সফটওয়্যার ব্যবহার করে, সেগুলোই শিখুন।",
    },
    {
        icon: <FaProjectDiagram className="h-5 w-5" />,
        title: "হ্যান্ডস-অন প্রজেক্ট",
        description: "বাস্তব জীবনের ডিজাইন চ্যালেঞ্জ ও প্রজেক্ট দিয়ে আপনার পোর্টফোলিও গড়ে তুলুন।",
    },
    {
        icon: <FaUserTie className="h-5 w-5" />,
        title: "এক্সপার্ট মেন্টরশিপ",
        description: "অভিজ্ঞ ডিজাইনার ও ইন্ডাস্ট্রি প্রফেশনালদের গাইডলাইন নিন সরাসরি।",
    },
];

//  Section 

export default function GraphicsSkills() {
    const skills = [
        { image: PhotoshopImg, name: "ফটোশপ" },
        { image: IllustratorImg, name: "ইলাস্ট্রেটর" },
    ];

    return (
        <section className="relative overflow-hidden bg-[#040a07] py-24 selection:bg-primary/30 selection:text-white md:py-32">

            {/* 3D workspace illustration */}
            {/* <div
                className="pointer-events-none absolute top-15 left-0 z-0 w-[300px] md:w-[400px] opacity-60"
                style={{ animation: 'floatSlow 8s ease-in-out infinite' }}
            >
             green glow behind the image 
                <div
                    className="absolute inset-0 scale-90 rounded-full blur-2xl opacity-30"
                    style={{
                        background:
                            'radial-gradient(ellipse, hsl(156 70% 42% / 0.6) 0%, transparent 70%)',
                    }}
                />
                <Image
                    src={WorkspaceIllustration}
                    alt=""
                    className="w-full h-auto drop-shadow-[0_8px_32px_hsl(156_70%_42%/0.35)]"
                    priority={false}
                />
            </div> */}

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

                            {/* Premium Shimmer/Glass CTA (Desktop only here, mobile is below) */}
                            {/* <Link href="/checkout" className="group hidden relative md:inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px]">
                                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="relative inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-[#0d1f14]/80 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-[#112a1b] group-hover:shadow-[0_0_20px_rgba(32,180,134,0.15)]">
                                    <span>আপনার যাত্রা শুরু করুন</span>
                                    <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </div>
                            </Link> */}
                            <div className="pt-4 hidden md:inline-flex">
                                <Link href="/checkout">
                                    {/* Spinning glowing border wrapper */}
                                    <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                                              shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                                              hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                                              hover:scale-105 hover:-translate-y-0.5
                                              active:scale-95 active:translate-y-0
                                              transition-all duration-300 ease-out">
                                        {/* Rotating conic-gradient border */}
                                        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(156_70%_42%)_25%,hsl(156_85%_70%)_50%,hsl(156_70%_42%)_75%,transparent_100%)]" />
                                        <button className="group relative overflow-hidden
                                                inline-flex items-center gap-2
                                                px-8 py-3.5
                                                text-base font-bold tracking-wide rounded-[10px]
                                                bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                                                text-white
                                                hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
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
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                            {/* premium badge with side decor */}
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

                {/* Premium CTA (Mobile) */}
                {/* <div className="mt-12 flex justify-center md:hidden">
                    <Link href="/checkout" className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px]">
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-[#0d1f14]/80 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-[#112a1b] hover:shadow-[0_0_20px_rgba(32,180,134,0.15)]">
                            <span>আপনার যাত্রা শুরু করুন</span>
                            <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </div>
                    </Link>
                </div> */}
                <div className="pt-4 md:hidden  flex justify-center items-center">
                    <Link href="/checkout">
                        {/* Spinning glowing border wrapper */}
                        <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                                              shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                                              hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                                              hover:scale-105 hover:-translate-y-0.5
                                              active:scale-95 active:translate-y-0
                                              transition-all duration-300 ease-out">
                            {/* Rotating conic-gradient border */}
                            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(156_70%_42%)_25%,hsl(156_85%_70%)_50%,hsl(156_70%_42%)_75%,transparent_100%)]" />
                            <button className="group relative overflow-hidden
                                                inline-flex items-center gap-2
                                                px-8 py-3.5
                                                text-base font-bold tracking-wide rounded-[10px]
                                                bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                                                text-white
                                                hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
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

            {/* keyframes for illustration float */}
            <style>{`@keyframes floatSlow {
                    0%   { transform: translateY(0px) rotate(-2deg) scale(1); }
                    50%  { transform: translateY(-10px) rotate(2deg) scale(1.02); }
                    100% { transform: translateY(0px) rotate(-2deg) scale(1); }
                }`}</style>
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
            className="group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(32,180,134,0.06)]"
        >
            {/* Animated Glowing Border Background */}
            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_40%,hsl(156_70%_42%/0.4)_50%,transparent_60%,transparent_100%)]" />

            {/* Inner Card Background */}
            <div className="relative h-full w-full rounded-[15px] bg-[#040a07] p-8 border border-white/[0.02] backdrop-blur-md transition-colors duration-500 group-hover:bg-[#060f0a]">

                {/* Top Shine (Subtle hover effect) */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Icon Box */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/[0.15] bg-primary/[0.05] text-primary transition-colors duration-500 group-hover:bg-primary/[0.1] group-hover:text-[hsl(var(--primary-glow))]">
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
