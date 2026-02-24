'use client';

import {
  Headphones,
  Video,
  Target,
  BookOpen,
  Star,
  ArrowRight,
  Users,
  Clock,
  Laptop,
  Search,
  UserCircle,
  Zap,
  PencilRuler,
  Gift,
  FileBadge,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Headphones,
    title: 'প্রতিদিন ৩ বার সাপোর্ট সেশন',
    description:
      'প্রতিদিন তিনটি নির্ধারিত সাপোর্ট সেশনের মাধ্যমে আপনি যেকোনো সমস্যা দ্রুত সমাধান করতে পারবেন এবং শেখার গতি বাড়াতে পারবেন।',
    highlight: 'সাপোর্ট',
  },
  {
    icon: Video,
    title: 'লাইভ ক্লাস',
    description:
      'Zoom এ ইন্টার‌্যাকটিভ ৩৫টি মেইন ক্লাস এবং ৩০টিরও বেশি সাপোর্ট ক্লাসের মাধ্যমে নিশ্চিত শেখা।',
    highlight: 'ইন্টার‌্যাকটিভ শেখা',
  },
  {
    icon: Target,
    title: 'মার্কেটপ্লেস ভিত্তিক প্রজেক্ট',
    description:
      'বাস্তব মার্কেটপ্লেস প্রজেক্টে কাজ করার অভিজ্ঞতা অর্জন করুন, যা আপনাকে পোর্টফোলিও তৈরিতে সহায়তা করবে এবং চাকরি পেতে সহায়ক হবে।',
    highlight: 'বাস্তব প্রজেক্ট',
  },
  {
    icon: BookOpen,
    title: 'গাইডলাইন সেশন',
    description:
      'শিল্পের মানদণ্ড, সেরা অনুশীলন এবং ক্যারিয়ার ডেভেলপমেন্ট নিয়ে প্রাতিষ্ঠানিক গাইডলাইন সেশন।',
    highlight: 'বিশেষজ্ঞ দিকনির্দেশনা',
  },
  {
    icon: Laptop,
    title: '৯০+ প্রবলেম সলভিং ক্লাস',
    description:
      'অতিরিক্ত ৯০টিরও বেশি প্রবলেম সলভিং ক্লাসে অংশগ্রহণ করে স্কিল করুন আরও শানিত।',
    highlight: 'হ্যান্ডস-অন প্র্যাকটিস',
  },
  {
    icon: Search,
    title: 'ক্লাইন্ট হান্টিং সিক্রেট ট্রিক্স',
    description:
      'লোকাল ও আন্তর্জাতিক ক্লায়েন্ট পাওয়ার কার্যকরী টেকনিক ও স্ট্র্যাটেজি শিখবেন হাতে-কলমে।',
    highlight: 'কাজ পাওয়ার গ্যারান্টি',
  },
  {
    icon: UserCircle,
    title: 'পার্সোনাল পোর্টফোলিও বিল্ডিং',
    description:
      'ব্যক্তিগত ব্র্যান্ডিংয়ের জন্য পার্সোনাল পোর্টফোলিও তৈরি করা হবে লাইভ ক্লাসের মাধ্যমে।',
    highlight: 'প্রফেশনাল পরিচিতি',
  },
  {
    icon: Zap,
    title: 'AI হেল্পার মাস্টারক্লাস',
    description:
      'ডিজাইনে এআই টুলস কীভাবে ব্যবহার করবেন, তা নিয়ে থাকবে এক্সক্লুসিভ মাস্টারক্লাস।',
    highlight: 'AI Powered Workflow',
  },
  {
    icon: PencilRuler,
    title: 'ট্রেন্ডি ডিজাইন শেখানো হবে',
    description:
      'বর্তমান মার্কেটের ট্রেন্ডি ডিজাইন শেখানো হবে যাতে আপনি সবাই থেকে এগিয়ে থাকেন।',
    highlight: 'টপ-লেভেল স্কিল',
  },
  {
    icon: Gift,
    title: 'সেরা শিক্ষার্থীর জন্য স্পেশাল গিফট',
    description: 'ব্যাচের সেরা পারফর্মার পাবেন MISUN Academy থেকে একটি বিশেষ উপহার।',
    highlight: 'অভিনন্দন উপহার',
  },
  {
    icon: FileBadge,
    title: 'সার্টিফিকেট প্রদান',
    description: 'কোর্স শেষে একটি অফিসিয়াল সার্টিফিকেট প্রদান করা হবে সফল শিক্ষার্থীদের।',
    highlight: 'অফিশিয়াল স্বীকৃতি',
  },
  {
    icon: Rocket,
    title: '৪টি প্রজেক্ট ভিত্তিক পরীক্ষা',
    description: 'নিজের স্কিল যাচাইয়ের জন্য থাকছে চারটি রিয়েল প্রজেক্ট বেইজড পরীক্ষা।',
    highlight: 'পরীক্ষার মাধ্যমে যাচাই',
  },
  {
    icon: Star,
    title: '৫০০+ প্রিমিয়াম ডিজাইন রিসোর্স',
    description: 'ডিজাইন উন্নয়নে সহায়ক ৫০০+ প্রিমিয়াম রিসোর্স ফ্রি তে পাচ্ছেন।',
    highlight: 'রিসোর্স বুস্ট',
  },
];

const stats = [
  { icon: Users, value: '১৫০০+', label: 'শিক্ষার্থী ভর্তি হয়েছেন' },
  { icon: Star, value: '৪.৯', label: 'কোর্স রেটিং' },
  { icon: Clock, value: '৪ মাস', label: 'মেয়াদ' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const WhyChooseSection = () => {
  return (
    <section className="relative bg-[#060f0a] overflow-hidden mb-0 py-24">
      {/* ── Top edge separator ── */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* ── Dot-grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Ambient glows ── */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[560px] h-[280px] bg-primary/12 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 left-[5%] w-[300px] h-[220px] bg-primary/7 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-[5%] w-[280px] h-[200px] bg-primary/6 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[480px] h-[220px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative max-w-7xl mx-auto px-4">

        {/* ── Heading ── */}
        <FadeIn className="text-center mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-primary/10 border border-primary/25 backdrop-blur-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90 font-bangla">
              প্রিমিয়াম গ্রাফিক্স ডিজাইন কোর্স
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-bangla mb-5
            bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
            কেন{' '}
            <span className="relative inline-block
              bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Misun Academy?
              <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            </span>
          </h2>
          <div className="mt-3 mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
            <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/60" />
            <div className="h-px w-32 bg-gradient-to-r from-primary/60 to-primary/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <div className="h-px w-16 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed font-bangla">
            আপনার সৃজনশীল চিন্তাকে প্রফেশনাল দক্ষতায় রূপান্তর করুন আমাদের সম্পূর্ণ গ্রাফিক্স
            ডিজাইন কোর্সের মাধ্যমে। ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে শিখুন।
          </p>
        </FadeIn>

        {/* ── Stats strip ── */}
        <FadeIn delay={0.15}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-[#060f0a] border border-primary/20 rounded-2xl px-6 py-4 min-w-[200px]
                  hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                {/* Icon badge */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38] flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-bangla">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/55 mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── Timeline ── */}
        <div className="relative">

          {/* Vertical connector line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] hidden md:block"
            style={{
              background: 'linear-gradient(to bottom, transparent, hsl(156 70% 42%) 8%, hsl(156 85% 70%) 50%, hsl(156 70% 42%) 92%, transparent)',
              boxShadow: '0 0 14px hsl(156 70% 42% / 0.6)',
            }}
          />
          {/* Mobile connector line */}
          <div className="absolute left-5 top-0 bottom-0 w-[2px] md:hidden"
            style={{
              background: 'linear-gradient(to bottom, transparent, hsl(156 70% 42%) 5%, hsl(156 70% 42%) 95%, transparent)',
              boxShadow: '0 0 10px hsl(156 70% 42% / 0.5)',
            }}
          />

          <div className="flex flex-col gap-10">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              const Icon = feature.icon;

              return (
                <div key={index} className="relative flex items-center gap-0 md:gap-0">

                  {/* ── Desktop zigzag layout ── */}
                  {/* Left card slot (even index) */}
                  <div className={`hidden md:flex flex-1 ${isEven ? 'justify-end pr-10' : 'justify-end pr-10 invisible pointer-events-none'}`}>
                    {isEven && (
                      <motion.div
                        className="w-full"
                        initial={{ opacity: 0, x: -48 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
                      >
                        <TimelineCard feature={feature} index={index} Icon={Icon} />
                      </motion.div>
                    )}
                  </div>

                  {/* Step circle — centred on the line */}
                  <motion.div
                    className="hidden md:flex flex-shrink-0 relative z-10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38]
                      flex items-center justify-center font-bold text-white text-sm
                      shadow-lg shadow-primary/50 ring-4 ring-[#060f0a]
                      hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                  </motion.div>

                  {/* Right card slot (odd index) */}
                  <div className={`hidden md:flex flex-1 ${!isEven ? 'justify-start pl-10' : 'justify-start pl-10 invisible pointer-events-none'}`}>
                    {!isEven && (
                      <motion.div
                        className="w-full"
                        initial={{ opacity: 0, x: 48 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
                      >
                        <TimelineCard feature={feature} index={index} Icon={Icon} />
                      </motion.div>
                    )}
                  </div>

                  {/* ── Mobile layout ── */}
                  <motion.div
                    className="flex md:hidden items-start gap-5 w-full pl-2"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    {/* Step circle on the line */}
                    <div className="flex-shrink-0 relative z-10 mt-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38]
                        flex items-center justify-center font-bold text-white text-xs
                        shadow-md shadow-primary/40 ring-2 ring-[#060f0a]">
                        {index + 1}
                      </div>
                    </div>
                    {/* Card */}
                    <div className="flex-1">
                      <TimelineCard feature={feature} index={index} Icon={Icon} />
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <FadeIn delay={0.4} direction="up" className="text-center mt-20">
          <div className="relative bg-[#060f0a] border border-primary/20 rounded-3xl max-w-2xl mx-auto p-10 overflow-hidden
            hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            style={{ boxShadow: '0 0 60px hsl(156 70% 42% / 0.10)' }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/15 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/15 rounded-br-3xl" />
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            {/* Top accent line */}
            <div className="w-16 h-[3px] rounded-full bg-gradient-to-r from-primary to-primary-glow mx-auto mb-6" />

            <h3 className="text-2xl font-bold mb-4 text-white font-bangla">
              আপনার ডিজাইন যাত্রা শুরু করতে প্রস্তুত?
            </h3>
            <p className="text-white/60 mb-8 leading-relaxed font-bangla">
              শত শত সফল শিক্ষার্থীদের মত আপনিও আপনার ক্যারিয়ার পরিবর্তন করুন আমাদের পূর্ণাঙ্গ
              গ্রাফিক্স ডিজাইন প্রোগ্রামে অংশগ্রহণ করে। পান লাইফটাইম অ্যাক্সেস এবং ইন্ডাস্ট্রি
              সার্টিফিকেট।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-bangla">
              <Link href="/checkout">
                {/* Spinning glowing border wrapper */}
                <div className="relative p-[2px] rounded-xl overflow-hidden
                  shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                  hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                  hover:scale-105 hover:-translate-y-0.5
                  active:scale-95 active:translate-y-0
                  transition-all duration-300 ease-out">
                  {/* Rotating conic-gradient border */}
                  <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(156_70%_42%)_25%,hsl(156_85%_70%)_50%,hsl(156_70%_42%)_75%,transparent_100%)]" />
                  <button
                    className="group relative overflow-hidden
                      w-full sm:w-auto
                      inline-flex items-center justify-center gap-2
                      px-8 py-3.5
                      text-base font-bold tracking-wide rounded-[10px]
                      bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                      text-white
                      hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                      transition-all duration-300 ease-out"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      এখনই ভর্তি হন
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    {/* Shine sweep */}
                    <span className="absolute inset-0
                      bg-gradient-to-r from-transparent via-white/25 to-transparent
                      -translate-x-full group-hover:translate-x-full
                      transition-transform duration-700 ease-in-out" />
                  </button>
                </div>
              </Link>
              <Link href="/courses">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary/40 text-white hover:bg-primary/10 hover:border-primary hover:text-white"
                >
                  কারিকুলাম দেখুন
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
      {/* ── Bottom edge separator ── */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};

// ─── Timeline Card Sub-component ──────────────────────────────────────────────

interface TimelineCardProps {
  feature: { icon: React.ElementType; title: string; description: string; highlight: string };
  index: number;
  Icon: React.ElementType;
}

function TimelineCard({ feature, Icon }: TimelineCardProps) {
  return (
    <div
      className="group relative w-full md:max-w-[420px] bg-[#060f0a] border border-primary/15 rounded-2xl p-6 overflow-hidden
        hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
        transition-all duration-300 ease-out cursor-default font-bangla"
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-2xl" />
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-start gap-4">
        {/* Icon badge */}
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38]
          flex items-center justify-center
          shadow-md shadow-primary/30
          group-hover:scale-110 group-hover:shadow-primary/50 group-hover:shadow-lg
          transition-all duration-300">
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-white font-semibold text-base leading-snug group-hover:text-primary-glow transition-colors duration-300">
              {feature.title}
            </h3>
            <span className="flex-shrink-0 text-[11px] bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 rounded-full font-medium">
              {feature.highlight}
            </span>
          </div>
          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed group-hover:text-white/75 transition-colors duration-300">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}


export default WhyChooseSection;
