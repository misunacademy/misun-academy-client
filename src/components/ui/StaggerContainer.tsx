'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

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
    return (
        <motion.div
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerChildren,
                        delayChildren: delayChildren,
                    },
                },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: once, amount: viewportAmount }}
            className={cn('', className)}
        >
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return (
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.5,
                                    ease: [0.21, 0.47, 0.32, 0.98],
                                }
                            },
                        }}
                    >
                        {child}
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
