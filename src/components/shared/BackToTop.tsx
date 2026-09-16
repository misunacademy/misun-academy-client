"use client";

import { AnimatePresence } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { GlassGlowVariant, MinimalStrokeVariant, ThreeDOrbitVariant, GhostRingVariant } from "./back-to-top";

interface BackToTopProps {
  variant?: "glass-glow" | "minimal-stroke" | "3d-orbit" | "ghost-ring";
  threshold?: number;
}

export default function BackToTop({ variant = "glass-glow", threshold = 200 }: BackToTopProps) {
  const { isVisible, progress, scrollToTop } = useScrollProgress(threshold);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {variant === "glass-glow" && <GlassGlowVariant progress={progress} scrollToTop={scrollToTop} />}
          {variant === "minimal-stroke" && <MinimalStrokeVariant progress={progress} scrollToTop={scrollToTop} />}
          {variant === "3d-orbit" && <ThreeDOrbitVariant progress={progress} scrollToTop={scrollToTop} />}
          {variant === "ghost-ring" && <GhostRingVariant progress={progress} scrollToTop={scrollToTop} />}
        </>
      )}
    </AnimatePresence>
  );
}
