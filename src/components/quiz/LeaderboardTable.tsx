"use client"

import { ILeaderboardEntry } from '@/types/quiz'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface LeaderboardTableProps {
    entries: ILeaderboardEntry[]
    currentUserId?: string
    className?: string
}

export function LeaderboardTable({ entries, currentUserId, className }: LeaderboardTableProps) {
    const getRankStyle = (rank: number) => {
        if (rank === 1) return 'bg-yellow-50 border-yellow-300'
        if (rank === 2) return 'bg-gray-50 border-gray-300'
        if (rank === 3) return 'bg-orange-50 border-orange-300'
        return ''
    }

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇'
        if (rank === 2) return '🥈'
        if (rank === 3) return '🥉'
        return `#${rank}`
    }

    return (
        <div className={cn('space-y-2', className)}>
            {entries.map((entry) => {
                const isCurrentUser = currentUserId && entry.userId._id === currentUserId
                return (
                    <Card
                        key={entry.rank}
                        className={cn(
                            'flex items-center gap-4 p-4 border',
                            getRankStyle(entry.rank),
                            isCurrentUser && 'ring-2 ring-primary'
                        )}
                    >
                        <div className="w-12 text-center text-lg font-bold">
                            {getRankBadge(entry.rank)}
                        </div>

                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={entry.userId.avatar || entry.userId.image}
                                alt={entry.userId.name}
                            />
                            <AvatarFallback>
                                {entry.userId.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                                {entry.userId.name}
                                {isCurrentUser && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                        You
                                    </Badge>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                                <p className="font-bold text-lg">{entry.totalZames}</p>
                                <p className="text-xs text-muted-foreground">Zames</p>
                            </div>
                            <div className="text-center hidden sm:block">
                                <p className="font-semibold">{entry.quizzesCompleted}</p>
                                <p className="text-xs text-muted-foreground">Quizzes</p>
                            </div>
                            <div className="text-center hidden md:block">
                                <p className="font-semibold">{entry.averageScore}%</p>
                                <p className="text-xs text-muted-foreground">Avg</p>
                            </div>
                        </div>
                    </Card>
                )
            })}

            {entries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No entries yet. Complete a quiz to get on the leaderboard!
                </div>
            )}
        </div>
    )
}
