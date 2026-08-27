"use client"

import { cn } from '@/lib/utils'

interface ZamesBadgeProps {
    points: number
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
    className?: string
}

export function ZamesBadge({ points, size = 'md', animate = false, className }: ZamesBadgeProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5 gap-1',
        md: 'text-sm px-3 py-1 gap-1.5',
        lg: 'text-lg px-4 py-2 gap-2',
    }

    const iconSize = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-2xl',
    }

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-sm',
                animate && 'animate-pulse',
                sizeClasses[size],
                className
            )}
        >
            <span className={iconSize[size]}>★</span>
            <span>{points.toLocaleString()} Zames</span>
        </div>
    )
}
