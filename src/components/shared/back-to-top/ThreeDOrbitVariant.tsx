"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface ThreeDOrbitVariantProps {
  progress: number;
  scrollToTop: () => void;
}

const circ = 2 * Math.PI * 40;
const offset = (p: number) => circ - (p / 100) * circ;

export function ThreeDOrbitVariant({ progress, scrollToTop }: ThreeDOrbitVariantProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-[110px] right-8 w-14 h-14 rounded-full bg-surface-navy border border-white/5 flex items-center justify-center group shadow-[4px_4px_10px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)] active:scale-95 transition-all duration-300 z-40"
      aria-label="Back to top"
    >
      <div className="absolute w-full h-full rounded-full border border-white/5" />
      <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-primary/5" />
        <circle
          cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset(progress)}
          strokeLinecap="round" className="text-primary transition-all duration-100 ease-out"
        />
      </svg>
      <Layers className="w-5 h-5 text-[#dae2fd] group-hover:text-primary transition-colors duration-300" />
    </motion.button>
  );
}
