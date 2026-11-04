'use client';

import Image from 'next/image';
import Container from '@/components/ui/container';
import WhyThisCourseModal from './WhyThisCourseModal';
import { VideoThumb } from '@/assets/images';
import AbstractLiquid from '@/assets/3d-elements/3d-abstract-colorful-twisted-liquid-shapes.png';
import FluidShape from '@/assets/3d-elements/3d-abstract-fluid-shape-icon.png';
import PlayButton from '@/components/shared/PlayButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { StaggerContainer } from '@/components/ui/StaggerContainer';
import { StatCard } from './StatCard';
import { stats } from './statsData';

export default function WhyThisCourse() {
  return (
    <section
      data-dark-section
      className="relative overflow-hidden bg-surface-darker"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[520px] h-[260px] bg-primary/12 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-[10%] w-[300px] h-[200px] bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[260px] h-[180px] bg-primary/6 rounded-full blur-[70px] pointer-events-none" />

      {/* ── 3D Element: twisted liquid shapes — top-left decorative ── */}
      <div
        className="float-left-deco hidden md:block absolute -top-6 -left-10 w-[340px] pointer-events-none select-none z-0 opacity-55"
        style={{ animation: 'floatLeft 7s ease-in-out infinite' }}
      >
        {/* Green glow behind it */}
        <div className="absolute inset-0 scale-75 rounded-full blur-2xl opacity-30" style={{ background: 'radial-gradient(ellipse, hsl(156 70% 42% / 0.6) 0%, transparent 70%)' }} />
        <Image
          src={AbstractLiquid}
          alt=""
          className="w-full h-auto drop-shadow-[0_8px_32px_hsl(156_70%_42%/0.35)] mix-blend-luminosity"
          priority={false}
        />
      </div>

      {/* ── 3D Element: fluid shape icon — bottom-right decorative ── */}
      <div
        className="float-right-deco absolute bottom-10 -right-8 w-[140px] md:w-[190px] pointer-events-none select-none z-0 opacity-60"
        style={{ animation: 'floatRight 5.5s ease-in-out infinite' }}
      >
        <div className="absolute inset-0 scale-90 rounded-full blur-xl opacity-40" style={{ background: 'radial-gradient(ellipse, hsl(156 75% 50% / 0.55) 0%, transparent 70%)' }} />
        <Image
          src={FluidShape}
          alt=""
          className="w-full h-auto drop-shadow-[0_6px_24px_hsl(156_75%_48%/0.4)]"
          priority={false}
        />
      </div>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes floatLeft {
          0%   { transform: translateY(0px) rotate(-4deg) scale(1); }
          35%  { transform: translateY(-18px) rotate(2deg) scale(1.03); }
          70%  { transform: translateY(-8px) rotate(-6deg) scale(0.98); }
          100% { transform: translateY(0px) rotate(-4deg) scale(1); }
        }
        @keyframes floatRight {
          0%   { transform: translateY(0px) rotate(8deg) scale(1); }
          40%  { transform: translateY(-14px) rotate(-4deg) scale(1.05); }
          75%  { transform: translateY(-5px) rotate(12deg) scale(0.97); }
          100% { transform: translateY(0px) rotate(8deg) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .float-left-deco, .float-right-deco { animation: none !important; }
        }
      `}</style>

      <Container className="relative z-10 py-24 max-w-7xl mx-auto">

        {/* ── Premium badge ── */}
        <FadeIn>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-primary/10 border border-primary/25 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary-glow">
                কোর্স সম্পর্কে
              </span>
            </div>
          </div>
        </FadeIn>

        {/* ── Heading ── */}
        <FadeIn>
          <div className="text-center mb-2">
            <h2 className="text-5xl md:text-6xl font-bangla font-bold tracking-wide pt-2 text-white">
              এই{' '}
              <span className="relative inline-block pt-3 text-primary-glow">
                কোর্সটি
                {/* Underline glow */}
                <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
              </span>{' '}
              কেন করবেন?
            </h2>
            {/* Decorative divider */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
              <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/60" />
              <div className="h-px w-32 bg-gradient-to-r from-primary/60 to-primary/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <div className="h-px w-16 bg-gradient-to-r from-primary/20 to-transparent" />
            </div>
          </div>
        </FadeIn>

        {/* ── Mobile summary (keeps long Bangla copy readable) ── */}
        <FadeIn delay={0.15} direction="up">
          <p className="md:hidden readable-body max-w-prose mx-auto mt-8 text-center">
            এই কোর্সে সহজ বাংলায় হাতে-কলমে{' '}
            <span className="font-semibold text-primary-glow">গ্রাফিক্স ডিজাইন</span> শিখে ঘরে বসেই
            ফ্রিল্যান্সিং বা পেশাদার ক্যারিয়ার গড়ার সুযোগ পাবেন।
          </p>
        </FadeIn>

        {/* ── Video banner ── */}
        <FadeIn delay={0.2} direction="up">
          {/* Outer glow wrapper */}
          <div className="relative mt-8 md:mt-14 mx-auto">
            {/* Ambient glow behind video */}
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl scale-105 pointer-events-none" />

            {/* Spinning border wrapper */}
            <div className="relative p-[2px] rounded-2xl overflow-hidden
              w-full max-w-[360px] md:max-w-none h-[210px] sm:h-[300px] md:h-auto md:aspect-[2.16/1] mx-auto">
              {/* Spinning conic border */}
              <span
                className="absolute inset-[-100%] animate-[spin_6s_linear_infinite]"
                style={{
                  background:
                    'conic-gradient(from 90deg, transparent 20%, hsl(156 70% 42% / 0.5) 38%, hsl(156 80% 65%) 50%, hsl(156 70% 42% / 0.5) 62%, transparent 80%)',
                }}
              />

              {/* Video card body */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group
                border border-white/5
                hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <WhyThisCourseModal>
                  <div
                    className="grid grid-cols-2 bg-cover bg-no-repeat bg-center sm:bg-top w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    style={{ backgroundImage: `url(${VideoThumb.src})` }}
                  >
                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/20 to-transparent pointer-events-none rounded-2xl" />

                    {/* Text content — desktop only; mobile copy is rendered above the card */}
                    <div className="hidden md:block w-72 lg:w-[410px] text-white mx-12 lg:mx-24 mt-20 lg:mt-24 relative z-10">
                      <h2 className="text-3xl lg:text-5xl font-bold leading-[1.25] font-bangla text-white">
                        এই কোর্সে সহজ বাংলায় হাতে-কলমে{' '}
                        <span className="font-bold text-primary-glow">গ্রাফিক্স ডিজাইন</span> শিখে ঘরে বসেই
                        ফ্রিল্যান্সিং বা পেশাদার ক্যারিয়ার গড়ার সুযোগ পাবেন।
                      </h2>
                      <div className="mt-20">
                        <p className="text-2xl font-bold font-bangla text-white">
                          ভিডিওতে বিস্তারিত দেখুন
                        </p>
                      </div>
                    </div>

                    {/* Play button — centered on mobile, left column on desktop */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 md:static md:flex-row md:items-center md:justify-start md:gap-0 z-10">
                      <PlayButton
                        size="lg"
                        variant="gradient"
                        className="group-hover:scale-110 transition-transform duration-300 animate-glow"
                      />
                      <span className="md:hidden text-sm font-semibold text-white">ভিডিওতে বিস্তারিত দেখুন</span>
                    </div>

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 rounded-2xl pointer-events-none" />
                  </div>
                </WhyThisCourseModal>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Decorative divider before stat cards ── */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary/40" />
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/70" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
          </div>
          <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        {/* ── Stat cards ── */}
        <StaggerContainer className="font-monaExpanded max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              icon={stat.icon}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 120}
            />
          ))}
        </StaggerContainer>

      </Container>

      {/* ── Bottom edge separator ── */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
