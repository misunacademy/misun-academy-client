'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeedbacks, type StudentFeedback } from '@/constants/studentFeedbacks';
import { successStories } from './feedbackData';
import { SuccessStoriesCarousel } from './SuccessStoriesCarousel';
import { StudentOpinionsCarousel } from './StudentOpinionsCarousel';
import { FadeIn } from '../../ui/FadeIn';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);

  useEffect(() => {
    getFeedbacks().then(setFeedbacks);
  }, []);

  return (
    <section
      data-dark-section
      className="relative bg-surface overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-[5%] w-[320px] h-[220px] bg-primary/7 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-[5%] w-[280px] h-[200px] bg-primary/6 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[240px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 pt-24 pb-20">

      <SuccessStoriesCarousel successStories={successStories} />

      <div className="mt-4 mb-16 flex items-center gap-4 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
        <div className="flex gap-1.5">
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <div className="w-1 h-1 rounded-full bg-primary/70" />
          <div className="w-1 h-1 rounded-full bg-primary/40" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
      </div>

      <StudentOpinionsCarousel studentFeedbacks={feedbacks} />

      <FadeIn delay={0.4} direction="up" className="w-full flex justify-center mt-10">
        <Link href="/feedback">
          <div className="relative p-[2px] rounded-xl overflow-hidden group">
            <span
              className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 90deg, transparent 20%, hsl(156 70% 42%) 45%, hsl(156 85% 70%) 55%, hsl(156 70% 42%) 70%, transparent 80%)',
              }}
            />
            <button
              className="relative z-10 px-10 py-3.5 rounded-[10px] text-sm md:text-base font-bold text-white
                bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark
                hover:from-emerald-deep hover:via-emerald-bright hover:to-emerald-deep
                transition-all duration-300 tracking-wide
                shadow-lg shadow-primary/30 group-hover:shadow-primary/50 flex gap-2 items-center"
            >
              আরো মতামত দেখো
              <ArrowRight/>
            </button>
          </div>
        </Link>
      </FadeIn>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
