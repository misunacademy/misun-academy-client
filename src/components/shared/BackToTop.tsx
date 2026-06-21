"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowUpToLine, ChevronUp, Layers } from "lucide-react";

interface BackToTopProps {
  variant?: "glass-glow" | "minimal-stroke" | "3d-orbit" | "ghost-ring";
  threshold?: number;
}

export default function BackToTop({
  variant = "glass-glow",
  threshold = 200,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setProgress(scrolled);
      }

      if (winScroll > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial call to set visibility/progress if page loaded scrolled
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG Circumference calculations: 2 * Math.PI * radius
  // Glass Glow: r=46 -> C≈289
  const circGlassGlow = 2 * Math.PI * 46;
  const offsetGlassGlow = circGlassGlow - (progress / 100) * circGlassGlow;

  // Minimal Stroke: r=48 -> C≈301.59
  const circMinimal = 2 * Math.PI * 48;
  const offsetMinimal = circMinimal - (progress / 100) * circMinimal;

  // 3D Orbit: r=40 -> C≈251.32
  const circOrbit = 2 * Math.PI * 40;
  const offsetOrbit = circOrbit - (progress / 100) * circOrbit;

  // Ghost Ring: r=40 -> C≈251.32
  const circGhost = 2 * Math.PI * 40;
  const offsetGhost = circGhost - (progress / 100) * circGhost;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Variant 1: The Glass Glow */}
          {variant === "glass-glow" && (
            <motion.button
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-[150px] right-10 w-16 h-16 rounded-full bg-[#171f33]/70 backdrop-blur-xl border border-white/10 flex items-center justify-center group shadow-[0_0_20px_rgba(75,226,118,0.2)] hover:shadow-[0_0_25px_rgba(75,226,118,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 z-40 overflow-hidden"
              aria-label="Back to top"
            >
              <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="transparent"
                  stroke="rgba(75, 226, 119, 0.1)"
                  strokeWidth="4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="transparent"
                  stroke="#4be277"
                  strokeWidth="4"
                  strokeDasharray={circGlassGlow}
                  strokeDashoffset={offsetGlassGlow}
                  strokeLinecap="round"
                  className="transition-all duration-100 ease-out"
                />
              </svg>
              <ArrowUpToLine className="w-5 h-5 text-[#4be277] group-hover:-translate-y-1 transition-transform duration-300" />
              <div className="absolute -bottom-1 w-full text-center">
                <span className="text-[8px] tracking-wider text-[#4be277] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  TOP
                </span>
              </div>
            </motion.button>
          )}

          {/* Variant 2: The Minimal Stroke */}
          {variant === "minimal-stroke" && (
            <motion.button
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-[110px] right-8 w-14 h-14 rounded-full border border-white/10 bg-transparent flex items-center justify-center group hover:border-[#4be277] hover:bg-[#4be277]/5 active:scale-95 transition-all duration-300 z-40"
              aria-label="Back to top"
            >
              <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="transparent"
                  stroke="#4be277"
                  strokeWidth="1.5"
                  strokeDasharray={circMinimal}
                  strokeDashoffset={offsetMinimal}
                  className="transition-all duration-100 ease-out"
                />
              </svg>
              <ArrowUp className="w-4 h-4 text-[#bccbb9] group-hover:text-[#4be277] transition-colors duration-300" />
            </motion.button>
          )}

          {/* Variant 3: The 3D Orbit */}
          {variant === "3d-orbit" && (
            <motion.button
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-[110px] right-8 w-14 h-14 rounded-full bg-[#171f33] border border-white/5 flex items-center justify-center group shadow-[4px_4px_10px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(74,226,118,0.2)] active:scale-95 transition-all duration-300 z-40"
              aria-label="Back to top"
            >
              {/* Spinning orbiting ring */}
              <div className="absolute w-full h-full rounded-full border border-white/5"></div>
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 origin-center animate-[spin_8s_linear_infinite]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(75, 226, 119, 0.05)"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4be277"
                  strokeWidth="3"
                  strokeDasharray={circOrbit}
                  strokeDashoffset={offsetOrbit}
                  strokeLinecap="round"
                  className="transition-all duration-100 ease-out"
                />
              </svg>
              <Layers className="w-5 h-5 text-[#dae2fd] group-hover:text-[#4be277] transition-colors duration-300" />
            </motion.button>
          )}

          {/* Variant 4: The Ghost Ring */}
          {variant === "ghost-ring" && (
            <motion.button
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-[110px] right-8 w-12 h-12 flex items-center justify-center group active:scale-95 transition-all duration-300 z-40"
              aria-label="Back to top"
            >
              <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4be277"
                  strokeWidth="2"
                  strokeDasharray={circGhost}
                  strokeDashoffset={offsetGhost}
                  className="transition-all duration-100 ease-out"
                />
              </svg>
              <div className="flex flex-col items-center justify-center">
                <ChevronUp className="w-4 h-4 text-[#bccbb9] group-hover:text-[#4be277] transition-colors duration-300" />
                <span className="text-[8px] font-medium font-mono text-[#bccbb9]/60 group-hover:text-[#4be277] transition-colors duration-300">
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.button>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
