import type { Variants } from 'framer-motion';

export const EASE_OUT = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

export const MOTION_DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
} as const;

export const MOTION_OFFSET = {
  xs: 20,
  sm: 40,
  md: 60,
} as const;

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

const DIRECTION_OFFSETS: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: MOTION_OFFSET.sm },
  down: { x: 0, y: -MOTION_OFFSET.sm },
  left: { x: MOTION_OFFSET.sm, y: 0 },
  right: { x: -MOTION_OFFSET.sm, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealOptions {
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  delay?: number;
}

export function revealVariants({
  direction = 'up',
  distance,
  duration = MOTION_DURATION.base,
  delay = 0,
}: RevealOptions = {}): Variants {
  const offset = DIRECTION_OFFSETS[direction];
  const x = distance === undefined ? offset.x : Math.sign(offset.x) * distance;
  const y = distance === undefined ? offset.y : Math.sign(offset.y) * distance;

  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: EASE_OUT },
    },
  };
}

export function staggerContainerVariants(
  staggerChildren = 0.1,
  delayChildren = 0.1
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: MOTION_OFFSET.xs },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATION.base, ease: EASE_OUT },
  },
};
