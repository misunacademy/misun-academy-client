"use client"

import { IQuizAttempt } from '@/types/quiz'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface QuizResultProps {
    attempt: IQuizAttempt
    className?: string
}

export function QuizResult({ attempt, className }: QuizResultProps) {
    const averageTimePerQuestion = attempt.timeTaken
        ? Math.round(attempt.timeTaken / (attempt.correctCount + attempt.wrongCount + attempt.unansweredCount))
        : 0

    return (
        <Card className={cn('p-6 space-y-6', className)}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{attempt.correctCount}</div>
                    <div className="text-xs text-green-600 font-medium">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">{attempt.wrongCount}</div>
                    <div className="text-xs text-red-600 font-medium">Wrong</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700">{attempt.unansweredCount}</div>
                    <div className="text-xs text-gray-600 font-medium">Unanswered</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-700">
                        {attempt.zamesEarned}
                    </div>
                    <div className="text-xs text-amber-600 font-medium">Zames Earned</div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Score: {attempt.earnedMarks}/{attempt.totalMarks}</span>
                    <span className="font-semibold">{attempt.percentage}%</span>
                </div>
                <Progress value={attempt.percentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div>
                    <span className="text-muted-foreground">Attempt:</span>{' '}
                    <span className="font-medium">#{attempt.attemptNumber}</span>
                </div>
                {attempt.timeTaken && (
                    <div>
                        <span className="text-muted-foreground">Time:</span>{' '}
                        <span className="font-medium">
                            {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                        </span>
                    </div>
                )}
                <div>
                    <span className="text-muted-foreground">Status:</span>{' '}
                    <span className={cn(
                        'font-medium',
                        attempt.passed ? 'text-green-600' : 'text-red-600'
                    )}>
                        {attempt.passed ? 'Passed' : 'Failed'}
                    </span>
                </div>
            </div>
        </Card>
    )
}
