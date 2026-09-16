"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface MinimalStrokeVariantProps {
  progress: number;
  scrollToTop: () => void;
}

const circ = 2 * Math.PI * 48;
const offset = (p: number) => circ - (p / 100) * circ;

export function MinimalStrokeVariant({ progress, scrollToTop }: MinimalStrokeVariantProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-[110px] right-8 w-14 h-14 rounded-full border border-white/10 bg-transparent flex items-center justify-center group hover:border-primary hover:bg-primary/5 active:scale-95 transition-all duration-300 z-40"
      aria-label="Back to top"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <circle
          cx="50" cy="50" r="48" fill="transparent" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray={circ} strokeDashoffset={offset(progress)}
          className="text-primary transition-all duration-100 ease-out"
        />
      </svg>
      <ArrowUp className="w-4 h-4 text-sage group-hover:text-primary transition-colors duration-300" />
    </motion.button>
  );
}
