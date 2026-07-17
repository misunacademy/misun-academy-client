import { useState, useEffect, useCallback } from "react";
import { useLenis } from 'lenis/react';

interface ScrollProgress {
  isVisible: boolean;
  progress: number;
  scrollToTop: () => void;
}

export function useScrollProgress(threshold = 200): ScrollProgress {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.scrollY;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setProgress(scrolled);
      }

      setIsVisible(winScroll > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [lenis]);

  return { isVisible, progress, scrollToTop };
}
