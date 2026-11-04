'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
  viewportAmount?: 'some' | 'all' | number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  delayChildren = 0.1,
  staggerChildren = 0.1,
  className,
  viewportAmount = 0.2,
  once = true,
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn('', className)}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainerVariants(staggerChildren, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount }}
      className={cn('', className)}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return <motion.div variants={staggerItemVariants}>{child}</motion.div>;
      })}
    </motion.div>
  );
}
