"use client"

import { cn } from '@/lib/utils'

interface MotivationalMessageProps {
    emoji: string
    title: string
    message: string
    level: string
    percentage: number
}

export function MotivationalMessage({ emoji, title, message, level, percentage }: MotivationalMessageProps) {
    const colors = {
        outstanding: 'bg-green-50 border-green-300 text-green-800',
        great: 'bg-blue-50 border-blue-300 text-blue-800',
        good: 'bg-yellow-50 border-yellow-300 text-yellow-800',
        keep_practicing: 'bg-orange-50 border-orange-300 text-orange-800',
        keep_learning: 'bg-red-50 border-red-300 text-red-800',
    }

    return (
        <div className={cn('border-2 rounded-xl p-6 text-center space-y-3', colors[level as keyof typeof colors] || colors.keep_learning)}>
            <div className="text-5xl">{emoji}</div>
            <div className="text-3xl font-bold">{percentage}%</div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm opacity-80">{message}</p>
        </div>
    )
}
