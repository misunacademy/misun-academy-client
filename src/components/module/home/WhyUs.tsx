'use client';

import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import TimelineItem from './TimelineItem';
import { features, stats } from './whyUsData';

const WhyChooseSection = () => {
  return (
    <section className="relative bg-surface overflow-hidden mb-0 py-24">
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

      {/* ── Ambient light (two cheap gradients instead of four blurred layers) ── */}
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-primary/[0.08] to-transparent pointer-events-none" />

      <div className="container relative max-w-7xl mx-auto px-4">

        {/* ── Heading ── */}
        <FadeIn className="text-center mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-primary/10 border border-primary/25 backdrop-blur-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
            <span className="text-xs font-semibold text-primary-glow font-bangla">
              প্রিমিয়াম গ্রাফিক্স ডিজাইন কোর্স
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-bangla mb-5 text-white">
            কেন{' '}
            <span className="relative inline-block text-primary-glow">
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
          <p className="readable-body max-w-3xl mx-auto font-bangla">
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
                className="flex items-center gap-4 bg-surface border border-primary/20 rounded-2xl px-6 py-4 min-w-[200px]
                  hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                {/* Icon badge */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-darker via-primary to-emerald-dark flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-bangla">
                  <div className="text-2xl font-bold text-primary-glow">
                    {stat.value}
                  </div>
                  <div className="readable-micro-label mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── Timeline: one <li> per feature, each owns its spine segment and curved branch ── */}
        <ol role="list" className="relative m-0 list-none p-0">
          {features.map((feature, index) => (
            <TimelineItem
              key={index}
              feature={feature}
              index={index}
              Icon={feature.icon}
              isFirst={index === 0}
              isLast={index === features.length - 1}
            />
          ))}
        </ol>

        {/* ── CTA ── */}
        <FadeIn delay={0.4} direction="up" className="text-center mt-20">
          <div className="relative bg-surface border border-primary/20 rounded-3xl max-w-2xl mx-auto p-10 overflow-hidden
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
            <p className="readable-body mb-8 font-bangla">
              শত শত সফল শিক্ষার্থীদের মত আপনিও আপনার ক্যারিয়ার পরিবর্তন করুন আমাদের পূর্ণাঙ্গ
              গ্রাফিক্স ডিজাইন প্রোগ্রামে অংশগ্রহণ করে। পান লাইফটাইম অ্যাক্সেস এবং ইন্ডাস্ট্রি
              সার্টিফিকেট।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-bangla">
              <Link href="/checkout" className="group relative overflow-hidden rounded-xl p-[2px]
                  shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                  hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                  hover:scale-105 hover:-translate-y-0.5
                  active:scale-95 active:translate-y-0
                  transition-all duration-300 ease-out">
                  <AnimatedBorder />
                  <span
                    className="relative overflow-hidden
                      w-full sm:w-auto
                      inline-flex items-center justify-center gap-2
                      px-8 py-3.5
                      text-base font-bold tracking-wide rounded-[10px]
                      bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark
                      text-white
                      hover:from-emerald-deep hover:via-emerald-bright hover:to-emerald-deep
                      transition-all duration-300 ease-out"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      এখনই ভর্তি হন
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <span className="absolute inset-0
                      bg-gradient-to-r from-transparent via-white/25 to-transparent
                      -translate-x-full group-hover:translate-x-full
                      transition-transform duration-700 ease-in-out" />
                  </span>
              </Link>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-primary/40 text-white hover:bg-primary/10 hover:border-primary hover:text-white"
              >
                <Link href="/course-details">কারিকুলাম দেখুন</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
      {/* ── Bottom edge separator ── */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};

export default WhyChooseSection;