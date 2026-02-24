"use client"

import { motion } from "framer-motion"
import { FaTools, FaProjectDiagram, FaUserTie } from "react-icons/fa"
import { Button } from '@/components/ui/button';
import Image, { StaticImageData } from 'next/image';
import { IllustratorImg, PhotoshopImg } from '@/assets/images';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';

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
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay, duration: 0.5, type: "spring", stiffness: 180 }}
                    className="group relative cursor-pointer"
                >
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div
                        className="relative w-20 h-20 rounded-2xl bg-[#0d1f14] border border-primary/30 group-hover:border-primary/80 flex items-center justify-center shadow-[0_0_20px_rgba(32,180,134,0.15)] group-hover:shadow-[0_0_35px_rgba(32,180,134,0.45)] transition-all duration-500 animate-float"
                        style={{ animationDelay: `${delay}s` }}
                    >
                        <Image
                            src={image.src}
                            alt={name}
                            width={52}
                            height={52}
                            className="w-12 h-12 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#0d1f14] border border-primary/40 text-primary font-semibold">
                <p>{name}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

//  Data 

const featureCards = [
    {
        icon: <FaTools />,
        title: "ইন্ডাস্ট্রি স্ট্যান্ডার্ড টুলস",
        description: "বিশ্বের সেরা ডিজাইন স্টুডিওগুলো যেসব সফটওয়্যার ব্যবহার করে, সেগুলোই শিখুন।",
    },
    {
        icon: <FaProjectDiagram />,
        title: "হ্যান্ডস-অন প্রজেক্ট",
        description: "বাস্তব জীবনের ডিজাইন চ্যালেঞ্জ ও প্রজেক্ট দিয়ে আপনার পোর্টফোলিও গড়ে তুলুন।",
    },
    {
        icon: <FaUserTie />,
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
        <section className="relative overflow-hidden bg-[#060f0a] py-24 md:py-32">

            {/* Dot-grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />
            {/* Ambient glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[140px]" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-900/20 blur-[180px]" />

            {/* Edge separator lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">

                {/*  Hero block  */}
                <div className="flex flex-col items-center text-center">

                    {/* Premium badge */}
                    <FadeIn delay={0} direction="down">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-1.5 text-sm font-medium text-primary shadow-[0_0_20px_rgba(32,180,134,0.15)] backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            গ্রাফিক্স ডিজাইন কোর্স
                        </div>
                    </FadeIn>

                    {/* Main heading */}
                    <FadeIn delay={0.1} direction="up">
                        <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                            ক্রিয়েটিভ{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                                    ডিজাইন স্কিলস
                                </span>
                                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-primary/80 via-emerald-400/60 to-transparent" />
                            </span>
                        </h2>
                    </FadeIn>

                    {/* Sub-text */}
                    <FadeIn delay={0.2} direction="up">
                        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                            ইন্ডাস্ট্রি-স্ট্যান্ডার্ড ডিজাইন টুল শিখুন এবং আমাদের পূর্ণাঙ্গ গ্রাফিক্স ডিজাইন কোর্সের মাধ্যমে আপনার সৃজনশীলতা উন্মোচন করুন।
                        </p>
                    </FadeIn>

                    {/* Software icons + Desktop CTA */}
                    <FadeIn delay={0.3} direction="up">
                        <div className="mb-12 flex flex-wrap items-center justify-center gap-6">
                            {skills.map((skill, i) => (
                                <div key={skill.name} className="flex flex-col items-center gap-3">
                                    <SkillBadge {...skill} delay={0.4 + i * 0.15} />
                                    <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                                        {skill.name}
                                    </span>
                                </div>
                            ))}
                            <div className="mx-4 hidden h-12 w-px bg-white/10 md:block" />
                            <Link href="/checkout" className="hidden md:inline-block">
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                    {/* Reverse-spin comet border */}
                                    <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                                        shadow-[0_4px_24px_rgba(32,180,134,0.30)]
                                        hover:shadow-[0_8px_36px_rgba(32,180,134,0.55)]
                                        transition-shadow duration-500">
                                        {/* Comet — concentrated bright spot, spins counter-clockwise */}
                                        <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite_reverse] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_35%,hsl(156_85%_70%)_48%,hsl(156_70%_42%)_55%,transparent_65%,transparent_100%)]" />
                                        {/* Soft pulsing glow ring */}
                                        <span className="absolute inset-0 rounded-xl animate-pulse bg-primary/15 blur-sm" />
                                        <button className="group relative overflow-hidden
                                            inline-flex items-center gap-2
                                            px-7 py-[13px]
                                            text-sm font-bold tracking-wide rounded-[10px]
                                            bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                                            text-white
                                            hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                                            transition-all duration-300">
                                            <span className="relative z-10">আপনার ক্রিয়েটিভ যাত্রা শুরু করুন →</span>
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                        </button>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </FadeIn>

                    {/* Decorative divider */}
                    <FadeIn delay={0.35} direction="up">
                        <div className="mb-16 flex w-full items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                            <span className="text-xs font-semibold uppercase tracking-[4px] text-primary/60">যা শিখবেন</span>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                        </div>
                    </FadeIn>
                </div>

                {/* Feature cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {featureCards.map((card, i) => (
                        <FeatureCard key={card.title} {...card} index={i} />
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-12 flex justify-center md:hidden">
                    <Link href="/checkout">
                        <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                            shadow-[0_4px_24px_rgba(32,180,134,0.30)]
                            hover:shadow-[0_8px_36px_rgba(32,180,134,0.55)]
                            transition-shadow duration-500">
                            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite_reverse] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_35%,hsl(156_85%_70%)_48%,hsl(156_70%_42%)_55%,transparent_65%,transparent_100%)]" />
                            <span className="absolute inset-0 rounded-xl animate-pulse bg-primary/15 blur-sm" />
                            <button className="group relative overflow-hidden
                                inline-flex items-center gap-2
                                px-8 py-[13px]
                                text-sm font-bold tracking-wide rounded-[10px]
                                bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                                text-white
                                hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                                transition-all duration-300">
                                <span className="relative z-10">আপনার ক্রিয়েটিভ যাত্রা শুরু করুন →</span>
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
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(32,180,134,0.12)]"
        >
            {/* Top-left corner accent */}
            <span className="pointer-events-none absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-primary/60 to-transparent" />
            <span className="pointer-events-none absolute left-0 top-0 h-1/3 w-px bg-gradient-to-b from-primary/60 to-transparent" />

            {/* Hover fill glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-emerald-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Icon */}
            <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-2xl text-white shadow-[0_4px_20px_rgba(32,180,134,0.40)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(32,180,134,0.65)]">
                {icon}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20" />
            </div>

            {/* Text */}
            <h3 className="mb-3 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-primary">
                {title}
            </h3>
            <p className="text-sm leading-relaxed text-white/45">
                {description}
            </p>

            {/* Bottom-right corner accent (hover) */}
            <span className="pointer-events-none absolute bottom-0 right-0 h-px w-1/3 bg-gradient-to-l from-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-1/3 w-px bg-gradient-to-t from-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </motion.div>
    );
}
