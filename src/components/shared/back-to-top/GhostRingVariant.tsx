"use client";

import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

interface GhostRingVariantProps {
  progress: number;
  scrollToTop: () => void;
}

const circ = 2 * Math.PI * 40;
const offset = (p: number) => circ - (p / 100) * circ;

export function GhostRingVariant({ progress, scrollToTop }: GhostRingVariantProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-[110px] right-8 w-12 h-12 flex items-center justify-center group active:scale-95 transition-all duration-300 z-40"
      aria-label="Back to top"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <circle
          cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="2"
          strokeDasharray={circ} strokeDashoffset={offset(progress)}
          className="text-primary transition-all duration-100 ease-out"
        />
      </svg>
      <div className="flex flex-col items-center justify-center">
        <ChevronUp className="w-4 h-4 text-sage group-hover:text-primary transition-colors duration-300" />
        <span className="text-[8px] font-medium font-mono text-sage/60 group-hover:text-primary transition-colors duration-300">
          {Math.round(progress)}%
        </span>
      </div>
    </motion.button>
  );
}
