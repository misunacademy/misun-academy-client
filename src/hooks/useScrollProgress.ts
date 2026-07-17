import { useState, useEffect } from "react";

interface ScrollProgress {
  isVisible: boolean;
  progress: number;
  scrollToTop: () => void;
}

export function useScrollProgress(threshold = 200): ScrollProgress {
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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { isVisible, progress, scrollToTop };
}
