'use client';

import Clock from "@/assets/icons/Clock";
import Container from "@/components/ui/container";
import WorkflowCard from "./WorkFlowCard";
import { Duration, Scic, SearchOnline, Session, SubmitAssignment, SupportSession, WeekCourse } from "@/assets/icons";
import Link from "next/link";

const workflowSteps = [
    {
        title: "১:১ মেন্টরশিপ",
        description: "আপনার প্রতিটি সমস্যায় গাইড করবে একজন অভিজ্ঞ মেন্টর।",
        icon: <Clock />,

        glowColor: "hsl(156 70% 42%)",
        accentColor: "hsl(156 70% 42%)",
    },
    {
        title: "ডেইলি ৩ বেলা লাইভ সাপোর্ট সেশন",
        description: "সকাল, বিকেল ও রাতে প্রতিদিন সরাসরি লাইভ সাপোর্ট পাওয়া যাবে।",
        icon: <Scic />,
        glowColor: "hsl(192 91% 44%)",
        accentColor: "hsl(192 91% 44%)",
    },
    {
        title: "২৪/৭ WhatsApp প্রাইভেট গ্রুপ সাপোর্ট",
        description: "যেকোনো সময়ে WhatsApp গ্রুপ থেকে দ্রুত সাহায্য ও গাইডলাইন পাবেন।",
        icon: <SearchOnline />,
        glowColor: "hsl(263 70% 65%)",
        accentColor: "hsl(263 70% 65%)",
    },
    {
        title: "১:১ ফিডব্যাক সেশন",
        description: "আপনার ডিজাইনের ওপর পার্সোনাল রিভিউ এবং উন্নতির পরামর্শ দেওয়া হবে।",
        icon: <Session />,
        glowColor: "hsl(24 95% 53%)",
        accentColor: "hsl(24 95% 53%)",
    },
    {
        title: "জব এর জন্য সরাসরি হেল্প",
        description: "ফ্রিল্যান্সিং কিংবা লোকাল মার্কেটে কাজ পাওয়ার জন্য সরাসরি সহায়তা প্রদান করা হবে।",
        icon: <SupportSession />,
        glowColor: "hsl(350 89% 60%)",
        accentColor: "hsl(350 89% 60%)",
    },
    {
        title: "৪ মাস লেগে থাকা স্টুডেন্টদের জন্য ১০০% সফলতার গ্যারান্টি",
        description: "পুরোপুরি লেগে থাকলে ডিজাইন সেক্টরে সফল হওয়ার পথ নিশ্চিত।",
        icon: <SubmitAssignment />,
        glowColor: "hsl(48 96% 47%)",
        accentColor: "hsl(48 96% 47%)",
    },
    {
        title: "এজেন্সিতে কাজ করার সুযোগ",
        description: "লেগে থাকা স্টুডেন্টরা আমাদের এজেন্সিতে কাজ করার সুযোগ পাবেন।",
        icon: <WeekCourse />,
        glowColor: "hsl(217 91% 60%)",
        accentColor: "hsl(217 91% 60%)",
    },
    {
        title: "সেরা স্টুডেন্টদের জন্য MISUN টিমে কাজের সুযোগ",
        description: "সেরা পারফর্মাররা আমাদের টিমের সঙ্গে যুক্ত হয়ে কাজ করার সুযোগ পাবেন।",
        icon: <Duration />,
        glowColor: "hsl(173 80% 40%)",
        accentColor: "hsl(173 80% 40%)",
    }
]

export default function CourseWorkflow() {
    return (
        <section className="relative bg-[#060f0a] overflow-hidden">

            {/* Dot-grid texture */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            {/* Ambient glows */}
            <div className="absolute -top-20 right-1/4 w-96 h-96 bg-primary/7 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            {/* Edge separators */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <Container className="relative z-10 pb-20 pt-16 max-w-7xl mx-auto">
                <div className="p-4">
                    <div className="text-center">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">কোর্স পরিচালনা</span>
                        </div>

                        <h2 className="text-3xl lg:text-5xl font-bold font-bangla uppercase leading-[150%] bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                            কোর্স যেভাবে{' '}
                            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.4)]">পরিচালিত</span>
                            {' '}হবে
                        </h2>

                        <p className="mt-4 text-white/60 text-center font-bangla max-w-2xl mx-auto">
                            AI-এর যুগে ডিজাইন করা হয়েছে সহজ, কিন্তু সাফল্যের চাবিকাঠি এখন সঠিক জিনিসটা শিখে, সঠিক জায়গায় প্রয়োগ করা। এই কোর্সে আপনি শুধু সফটওয়্যার শেখা নয়, বরং একদম প্রফেশনাল লেভেলের বাস্তব কাজ শেখার সুযোগ পাবেন।
                        </p>

                        {/* Enroll CTA */}
                        <div className="mt-8 mb-10">
                            <Link href="/checkout">
                                <div className="inline-block relative p-[1.5px] rounded-xl overflow-hidden">
                                    <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                    <button className="relative bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41] transition-all duration-300 text-white font-semibold font-bangla text-base px-10 py-3 rounded-xl shadow-[0_0_20px_hsl(156_70%_42%/0.35)] cursor-pointer">
                                        এনরোল করুন
                                    </button>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative divider */}
                <div className="flex items-center gap-3 w-full max-w-xs mx-auto mb-10">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {workflowSteps.map((step, index) => (
                        <WorkflowCard
                            key={index}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                            glowColor={step.glowColor}
                            accentColor={step.accentColor}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}