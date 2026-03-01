'use client';

import { useEffect, useRef, useState } from 'react';
import Container from '@/components/ui/container';
import WhyThisCourseModal from './WhyThisCourseModal';
import { VideoThumb, Bg1 } from '@/assets/images';
import { FolderArchive, NotebookPen, Projector } from 'lucide-react';
import PlayButton from '@/components/shared/PlayButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { StaggerContainer } from '@/components/ui/StaggerContainer';

// ── Count-up hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  target: number;
  suffix: string;
  label: string;
  animate: boolean;
  delay?: number;
}

function StatCard({ icon, target, suffix, label, animate, delay = 0 }: StatCardProps) {
  const count = useCountUp(target, 1800, animate);

  return (
    <div
      className="relative p-[2px] rounded-2xl overflow-hidden mx-12 md:mx-0 group
        transition-all duration-500 hover:-translate-y-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* ── Spinning comet border ── */}
      <span
        className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, transparent 25%, hsl(156 70% 42% / 0.6) 38%, hsl(156 80% 58%) 48%, hsl(156 90% 80%) 53%, hsl(0 0% 100% / 0.9) 56%, hsl(156 90% 80%) 59%, hsl(156 80% 58%) 64%, hsl(156 70% 42% / 0.4) 72%, transparent 82%)',
        }}
      />

      {/* ── Card body ── */}
      <div className="relative flex flex-col items-center justify-center pt-10 pb-10 px-6 rounded-2xl bg-[#060f0a] border border-primary/10 overflow-hidden
        group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />

        {/* Background glow blob */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Icon badge */}
        <div className="relative z-10 w-16 h-16 rounded-2xl
          bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38]
          flex items-center justify-center
          shadow-lg shadow-primary/40
          group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/50
          transition-all duration-500 rotate-3 group-hover:rotate-0">
          <div className="text-white">{icon}</div>
        </div>

        {/* Animated number */}
        <span className="relative z-10 text-5xl md:text-6xl font-bold mt-5 tabular-nums
          bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
          {count}{suffix}
        </span>

        {/* Label */}
        <span className="relative z-10 mt-3 text-base md:text-lg font-medium text-white/60 group-hover:text-white/90 transition-colors duration-300 font-bangla text-center leading-relaxed">
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
const stats = [
  { icon: <Projector size={28} />, target: 60, suffix: '+', label: 'অনলাইন ক্লাস' },
  { icon: <NotebookPen size={28} />, target: 35, suffix: '+', label: 'অ্যাসাইনমেন্ট' },
  { icon: <FolderArchive size={28} />, target: 20, suffix: '+', label: 'রিসোর্স ফোল্ডার' },
];

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
// bg-[#060f0a]
  return (
    <section
      data-dark-section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${Bg1.src})`,
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

      <Container className="relative z-10 py-24 max-w-7xl mx-auto">

        {/* ── Premium badge ── */}
        <FadeIn>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-primary/10 border border-primary/25 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">
                কোর্স সম্পর্কে
              </span>
            </div>
          </div>
        </FadeIn>

        {/* ── Heading ── */}
        <FadeIn>
          <div className="text-center mb-2">
            <h1 className="text-5xl md:text-6xl font-bangla font-bold uppercase tracking-wide pt-2
              bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent !text-black">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060f0a]/85 via-[#060f0a]/20 to-transparent pointer-events-none rounded-2xl" />

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
