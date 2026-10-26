'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { MOTION_DURATION, revealVariants, type RevealDirection } from '@/lib/motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  className?: string;
  style?: React.CSSProperties;
  amount?: 'some' | 'all' | number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = MOTION_DURATION.base,
  direction = 'up',
  className,
  style,
  amount = 0.2,
  once = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div ref={ref} className={cn('', className)} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={revealVariants({ direction, duration, delay })}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={cn('', className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}
