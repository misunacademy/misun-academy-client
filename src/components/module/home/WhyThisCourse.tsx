'use client';

import { useEffect, useRef, useState } from 'react';
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
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
        className="absolute -top-6 -left-10 w-[260px] md:w-[340px] pointer-events-none select-none z-0 opacity-55"
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
        className="absolute bottom-10 -right-8 w-[140px] md:w-[190px] pointer-events-none select-none z-0 opacity-60"
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
      `}</style>

      <Container className="relative z-10 py-24 max-w-7xl mx-auto">

        {/* ── Premium badge ── */}
        <FadeIn>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-primary/10 border border-primary/25 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold  uppercase text-primary/90">
                কোর্স সম্পর্কে
              </span>
            </div>
          </div>
        </FadeIn>

        {/* ── Heading ── */}
        <FadeIn>
          <div className="text-center mb-2">
            <h1 className="text-5xl md:text-6xl font-bangla font-bold uppercase tracking-wide pt-2
              bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
              এই{' '}
              <span className="relative inline-block pt-3
                bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                কোর্সটি
                {/* Underline glow */}
                <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
              </span>{' '}
              কেন করবেন?
            </h1>
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

        {/* ── Video banner ── */}
        <FadeIn delay={0.2} direction="up">
          {/* Outer glow wrapper */}
          <div className="relative mt-14 mx-auto">
            {/* Ambient glow behind video */}
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl scale-105 pointer-events-none" />

            {/* Spinning border wrapper */}
            <div className="relative p-[2px] rounded-2xl overflow-hidden
              w-[360px] md:w-full h-[504px] lg:h-full aspect-[2.16/1] mx-auto">
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

                    {/* Text content */}
                    <div className="w-[132px] md:w-72 lg:w-[410px] text-white mx-6 md:mx-12 lg:mx-24 mt-12 md:mt-20 lg:mt-24 relative z-10">
                      <h2 className="text-xl md:text-3xl lg:text-5xl font-bold leading-[120%] tracking-[0%] font-bangla drop-shadow-md">
                        এই কোর্সে সহজ বাংলায় হাতে-কলমে{' '}
                        <span className="font-bold text-primary drop-shadow-[0_0_12px_hsl(156_70%_42%/0.6)]">গ্রাফিক্স ডিজাইন</span> শিখে ঘরে বসেই
                        ফ্রিল্যান্সিং বা পেশাদার ক্যারিয়ার গড়ার সুযোগ পাবেন।
                      </h2>
                      <div className="mt-20">
                        <h2 className="text-xl md:text-2xl font-bold font-bangla text-white/90">
                          ভিডিওতে বিস্তারিত দেখুন
                        </h2>
                      </div>
                    </div>

                    {/* Play button */}
                    <div className="flex items-center justify-start relative z-10">
                      <PlayButton
                        size="lg"
                        variant="gradient"
                        className="hidden md:block group-hover:scale-110 transition-transform duration-300 animate-glow"
                      />
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
        <div ref={sectionRef}>
          <StaggerContainer className="font-monaExpanded max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {stats.map((stat, i) => (
              <StatCard
                key={i}
                icon={stat.icon}
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
                animate={animate}
                delay={i * 120}
              />
            ))}
          </StaggerContainer>
        </div>

      </Container>

      {/* ── Bottom edge separator ── */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
