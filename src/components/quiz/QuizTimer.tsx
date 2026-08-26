"use client"

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface QuizTimerProps {
    timeLimit: number
    onTimeUp: () => void
    className?: string
}

export function QuizTimer({ timeLimit, onTimeUp, className }: QuizTimerProps) {
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60)

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp()
            return
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, onTimeUp])

    const isDanger = timeLeft <= 60
    const isWarning = !isDanger && timeLeft <= 300

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }, [])

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold',
                isDanger && 'bg-red-100 text-red-700 animate-pulse',
                isWarning && 'bg-yellow-100 text-yellow-700',
                !isWarning && !isDanger && 'bg-green-100 text-green-700',
                className
            )}
        >
            <span className="text-xl">⏱</span>
            <span>{formatTime(timeLeft)}</span>
        </div>
    )
}
