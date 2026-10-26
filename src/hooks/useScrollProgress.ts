import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
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
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const winScroll = window.scrollY;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (height > 0) {
        setProgress((winScroll / height) * 100);
      }

      setIsVisible(winScroll > threshold);
    };

    const handleScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: prefersReducedMotion ? 0 : 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [lenis, prefersReducedMotion]);

  return { isVisible, progress, scrollToTop };
}
