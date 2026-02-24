
import { Target, Eye, Users, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Debbroto, Mithun, Nurnobi } from "@/assets/images";
import Link from "next/link";

const teamMembers = [
    {
        name: "Mithun Sarkar",
        role: "Founder & CEO",
        company: "MISUN Academy",
        image: Mithun,
        description: "ভিশনারি লিডার যিনি ডিজিটাল শিক্ষার নতুন দিগন্ত তৈরি করছেন।",
        expertise: ["Leadership", "Digital Strategy", "Business Development"],
        experience: "৫+ বছর",
    },
    {
        name: "Debbroto Biswas",
        role: "Senior Design Executive",
        company: "MISUN Academy",
        image: Debbroto,
        description: "ডেটা সায়েন্স ও স্ট্র্যাটেজিক ডিজাইনে বিশেষজ্ঞ।",
        expertise: ["Data Science", "Design", "Analytics"],
        experience: "২+ বছর",
    },
    {
        name: "Nurnobi Hossen Shagor",
        role: "Design Executive",
        company: "MISUN Academy",
        image: Nurnobi,
        description: "আধুনিক ডিজিটাল স্কিল ও UI/UX ডিজাইনে দক্ষ।",
        expertise: ["UI/UX Design", "Digital Skills", "Technology"],
        experience: "১+ বছর",
    },
];

const missionItems = [
    "বাংলাদেশের যুব সমাজকে আন্তর্জাতিক মানের ডিজিটাল দক্ষতা শেখানো।",
    "বাস্তব ভিত্তিক (hands-on) শেখার অভিজ্ঞতা প্রদান করা।",
    "ফ্রিল্যান্সিং ও রিমোট ক্যারিয়ার গড়ার জন্য আত্মবিশ্বাসী করে তোলা।",
    "প্রযুক্তি নির্ভর একটি আত্মনির্ভরশীল প্রজন্ম গড়ে তোলা।",
];

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#060f0a] font-bangla overflow-hidden">

            {/* ── HERO ── */}
            <section className="relative bg-[#060f0a] overflow-hidden">
                {/* Dot-grid */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                {/* Ambient glows */}
                <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/7 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-10 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* Bottom separator */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-28 text-center">
                    {/* Icon ring */}
                    <div className="flex justify-center mb-8">
                        <div className="relative p-[1.5px] rounded-full overflow-hidden">
                            <span className="absolute inset-[-100%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                            <div className="relative w-20 h-20 rounded-full bg-[#060f0a] flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">MISUN Academy</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-[140%] mb-6">
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">আমাদের </span>
                        <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_24px_hsl(156_70%_42%/0.5)]">সম্পর্কে</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
                        ভবিষ্যৎ প্রজন্মের জন্য ডিজিটাল শিক্ষার নতুন দিগন্ত
                    </p>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-3 w-full max-w-xs mx-auto mt-10">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                    </div>
                </div>
            </section>

            {/* ── TEAM ── */}
            <section className="relative bg-[#060f0a] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute -top-10 right-1/3 w-96 h-96 bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">Our Team</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-[140%]">
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Meet Our </span>
                            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.45)]">Visionary Team</span>
                        </h2>
                        <p className="mt-4 text-white/50 max-w-2xl mx-auto">
                            ডিজিটাল শিক্ষার রূপান্তরের পেছনে MISUN Academy&apos;র প্রতিভাবান টিমের সদস্যরা
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {teamMembers.map((member, index) => (
                            <div key={index}
                                className="group relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15
                                    p-8 text-center
                                    transition-all duration-300 hover:-translate-y-1
                                    hover:border-primary/40 hover:shadow-[0_8px_40px_hsl(156_70%_42%/0.2)]">

                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />
                                {/* Top shimmer */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                                {/* Photo with dual conic-spin border */}
                                <div className="relative flex justify-center mb-8">
                                    <div className="relative p-[2px] rounded-full overflow-hidden w-36 h-36
                                        shadow-[0_0_30px_hsl(156_70%_42%/0.2)]">
                                        <span className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_50%,hsl(156_70%_42%/0.8)_70%,transparent_100%)]" />
                                        <span className="absolute inset-[-100%] animate-[spin_10s_linear_infinite_reverse] bg-[conic-gradient(from_180deg,transparent_70%,hsl(156_85%_70%/0.4)_90%,transparent_100%)]" />
                                        <div className="relative rounded-full overflow-hidden w-full h-full bg-[#060f0a] p-[2px]">
                                            <div className="relative rounded-full overflow-hidden w-full h-full">
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/15 via-transparent to-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experience badge */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                                        <div className="relative p-[1px] rounded-full overflow-hidden">
                                            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                            <div className="relative bg-[#060f0a] rounded-full px-3 py-1">
                                                <span className="text-xs font-bold text-primary">{member.experience}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-4">
                                    <h3 className="text-xl font-bold text-white/90 group-hover:text-white transition-colors mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm font-semibold text-primary/80 mb-0.5">{member.role}</p>
                                    <p className="text-xs text-white/35 mb-4">{member.company}</p>
                                    <p className="text-sm text-white/50 leading-relaxed mb-5">{member.description}</p>

                                    {/* Expertise tags */}
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {member.expertise.map((tag, i) => (
                                            <span key={i} className="px-2.5 py-0.5 rounded-full bg-primary/8 border border-primary/20 text-[11px] text-primary/70">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OUR STORY ── */}
            <section className="relative bg-[#060f0a] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute -top-10 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">আমাদের গল্প</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold leading-[140%]">
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">কীভাবে শুরু হলো </span>
                            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.4)]">MISUN Academy</span>
                        </h2>
                    </div>

                    {/* Story card */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#060f0a] border border-primary/15
                        p-8 md:p-12
                        shadow-[0_0_60px_hsl(156_70%_42%/0.10)]">

                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-3xl" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-3xl" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-3xl" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-3xl" />
                        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                        <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8">
                            <strong className="text-primary font-semibold">MISUN Academy</strong> একটি উদ্ভাবনী ডিজিটাল লার্নিং প্ল্যাটফর্ম, যা ভবিষ্যৎ প্রজন্মকে দক্ষ ও কর্মক্ষম করে গড়ে তোলার লক্ষ্য নিয়ে প্রতিষ্ঠিত হয়েছে। আমাদের মূল লক্ষ্য—বাংলাদেশসহ বিশ্বের যে কোনো প্রান্তে থাকা শিক্ষার্থীদের আধুনিক প্রযুক্তি ও ডিজিটাল স্কিল (যেমন: গ্রাফিক ডিজাইন, ফ্রিল্যান্সিং, ডিজিটাল মার্কেটিং, ভিডিও এডিটিং ইত্যাদি) শেখার সুযোগ করে দেওয়া।
                        </p>

                        {/* Highlighted quote */}
                        <div className="relative pl-5 border-l-2 border-primary/50">
                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary/70" />
                            <p className="text-base md:text-lg text-white/70 leading-relaxed italic">
                                আমরা বিশ্বাস করি, প্রত্যেকের মধ্যেই সৃজনশীলতা আছে—সঠিক দিকনির্দেশনা আর প্র্যাকটিক্যাল স্কিল শেখার মাধ্যমে সেই প্রতিভা জাগ্রত করা সম্ভব। MISUN Academy সেই লক্ষ্যেই কাজ করে যাচ্ছে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MISSION & VISION ── */}
            <section className="relative bg-[#060f0a] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">Mission & Vision</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold leading-[140%]">
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">আমাদের </span>
                            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.4)]">লক্ষ্য ও দর্শন</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Mission */}
                        <div className="group relative overflow-hidden rounded-3xl
                            bg-gradient-to-br from-[#0a2016] via-[#0d2b1c] to-[#060f0a]
                            border border-primary/25 p-10
                            shadow-[0_0_50px_hsl(156_70%_42%/0.12)]
                            transition-all duration-300 hover:shadow-[0_0_70px_hsl(156_70%_42%/0.22)] hover:-translate-y-1">

                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl" />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/60 rounded-br-3xl" />
                            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                            <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="text-center mb-8">
                                <div className="relative inline-flex p-[1.5px] rounded-full overflow-hidden mb-5">
                                    <span className="absolute inset-[-100%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                    <div className="relative w-16 h-16 rounded-full bg-[#0a2016] flex items-center justify-center">
                                        <Target className="w-7 h-7 text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold">
                                    <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Our </span>
                                    <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">Mission</span>
                                </h3>
                                <p className="text-primary/70 text-sm font-semibold mt-2 tracking-wide uppercase">Skill First, Career Next.</p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

                            <p className="text-white/55 text-sm mb-6">আমাদের মিশন হলো:</p>
                            <ul className="space-y-4">
                                {missionItems.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center mt-0.5">
                                            <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-sm text-white/65 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Vision */}
                        <div className="group relative overflow-hidden rounded-3xl
                            bg-gradient-to-br from-[#0a2016] via-[#0d2b1c] to-[#060f0a]
                            border border-primary/25 p-10
                            shadow-[0_0_50px_hsl(156_70%_42%/0.12)]
                            transition-all duration-300 hover:shadow-[0_0_70px_hsl(156_70%_42%/0.22)] hover:-translate-y-1">

                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl" />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/60 rounded-br-3xl" />
                            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                            <div className="absolute -top-8 -right-8 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

                            <div className="text-center mb-8">
                                <div className="relative inline-flex p-[1.5px] rounded-full overflow-hidden mb-5">
                                    <span className="absolute inset-[-100%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_180deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                    <div className="relative w-16 h-16 rounded-full bg-[#0a2016] flex items-center justify-center">
                                        <Eye className="w-7 h-7 text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold">
                                    <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Our </span>
                                    <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">Vision</span>
                                </h3>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

                            <p className="text-white/55 text-sm mb-6">আমাদের ভিশন হলো:</p>
                            <p className="text-sm text-white/65 leading-relaxed mb-6">
                                সবার জন্য সাশ্রয়ী, মানসম্মত এবং প্রাসঙ্গিক ডিজিটাল শিক্ষা নিশ্চিত করা, যা তাদের একটি স্বাধীন ও আত্মনির্ভরশীল জীবনের দিকে এগিয়ে নিতে পারে।
                            </p>

                            {/* Highlighted quote box */}
                            <div className="relative overflow-hidden rounded-2xl bg-primary/8 border border-primary/20 p-6">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40 rounded-tl-2xl" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40 rounded-tr-2xl" />
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                                <p className="text-sm text-white/60 leading-relaxed text-center italic">
                                    আমরা এমন একটি কমিউনিটি গড়ে তুলতে চাই, যেখানে শেখা মানেই শুধু সার্টিফিকেট নয়, বরং বাস্তবে কাজ করার দক্ষতা অর্জন।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative bg-[#060f0a] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute -top-10 left-1/4 w-[400px] h-[400px] bg-primary/7 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">এখনই যোগ দিন</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold leading-[145%] mb-5">
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/85 bg-clip-text text-transparent">আপনার ক্যারিয়ার </span>
                        <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.5)]">এখনই শুরু করুন</span>
                    </h2>

                    <p className="text-white/50 mb-10 leading-relaxed">
                        হাজারো শিক্ষার্থীর মতো আপনিও MISUN Academy-র সাথে যুক্ত হয়ে ডিজিটাল স্কিল অর্জন করুন এবং ফ্রিল্যান্সিং বা লোকাল মার্কেটে সফল হোন।
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

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/checkout">
                            <div className="inline-block relative p-[1.5px] rounded-xl overflow-hidden">
                                <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                <button className="relative bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                                    hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                                    transition-all duration-300 text-white font-bold text-base
                                    px-8 py-3.5 rounded-xl
                                    shadow-[0_0_24px_hsl(156_70%_42%/0.4)] hover:shadow-[0_0_36px_hsl(156_70%_42%/0.6)]
                                    cursor-pointer">
                                    এখনই এনরোল করুন
                                </button>
                            </div>
                        </Link>
                        <Link href="/courses">
                            <button className="inline-flex items-center gap-2
                                bg-[#060f0a] border border-primary/30 text-white/70
                                hover:border-primary/60 hover:text-white
                                transition-all duration-300
                                px-8 py-3.5 rounded-xl text-base font-semibold cursor-pointer">
                                <ArrowRight className="w-4 h-4 text-primary/70" />
                                কোর্স দেখুন
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
