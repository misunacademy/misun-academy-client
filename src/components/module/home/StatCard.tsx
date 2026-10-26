'use client';

import { memo } from 'react';
import Counter from '@/components/shared/Counter';

interface StatCardProps {
  icon: React.ReactNode;
  target: number;
  suffix: string;
  label: string;
  delay?: number;
}

export const StatCard = memo(function StatCard({ icon, target, suffix, label, delay = 0 }: StatCardProps) {
  return (
    <div
      className="relative p-[2px] rounded-2xl overflow-hidden mx-12 md:mx-0 group
        transition-all duration-500 hover:-translate-y-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] motion-reduce:animate-none"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, transparent 25%, hsl(156 70% 42% / 0.6) 38%, hsl(156 80% 58%) 48%, hsl(156 90% 80%) 53%, hsl(0 0% 100% / 0.9) 56%, hsl(156 90% 80%) 59%, hsl(156 80% 58%) 64%, hsl(156 70% 42% / 0.4) 72%, transparent 82%)',
        }}
      />

      <div className="relative flex flex-col items-center justify-center pt-10 pb-10 px-6 rounded-2xl bg-surface border border-primary/10 overflow-hidden
        group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">

        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />

        <div className="absolute inset-0 bg-gradient-to-b from-primary/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 w-16 h-16 rounded-2xl
          bg-gradient-to-br from-emerald-darker via-primary to-emerald-dark
          flex items-center justify-center
          shadow-lg shadow-primary/40
          group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/50
          transition-all duration-500 rotate-3 group-hover:rotate-0">
          <div className="text-white">{icon}</div>
        </div>

        <span className="relative z-10 text-5xl md:text-6xl font-bold mt-5 tabular-nums text-primary-glow">
          <Counter
            value={target}
            suffix={suffix}
            locale="bn-BD"
            fontSize="inherit"
            fontWeight="inherit"
            textColor="inherit"
          />
        </span>

        <span className="relative z-10 mt-3 text-base md:text-lg font-medium text-white/85 font-bangla text-center leading-relaxed">
          {label}
        </span>
      </div>
    </div>
  );
});
