"use client";

import { motion } from "framer-motion";
import { ArrowUpToLine } from "lucide-react";

interface GlassGlowVariantProps {
  progress: number;
  scrollToTop: () => void;
}

const circ = 2 * Math.PI * 46;
const offset = (p: number) => circ - (p / 100) * circ;

export function GlassGlowVariant({ progress, scrollToTop }: GlassGlowVariantProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-[150px] right-8 w-16 h-16 rounded-full bg-surface-navy/70 backdrop-blur-xl border border-white/10 flex items-center justify-center group shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-110 active:scale-95 z-40 overflow-hidden"
      aria-label="Back to top"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-primary/10" />
        <circle
          cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset(progress)}
          strokeLinecap="round" className="text-primary transition-all duration-100 ease-out"
        />
      </svg>
      <ArrowUpToLine className="w-5 h-5 text-primary group-hover:-translate-y-1 transition-transform duration-300" />
      <div className="absolute -bottom-1 w-full text-center">
        <span className="text-[8px] tracking-wider text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">TOP</span>
      </div>
    </motion.button>
  );
}
