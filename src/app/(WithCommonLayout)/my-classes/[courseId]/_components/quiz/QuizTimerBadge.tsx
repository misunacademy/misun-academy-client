"use client";

import { Clock } from "lucide-react";

interface QuizTimerBadgeProps {
  timeRemaining: number | null;
  className?: string;
}

export function QuizTimerBadge({ timeRemaining, className = "" }: QuizTimerBadgeProps) {
  if (timeRemaining === null) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const colorClass =
    timeRemaining <= 60
      ? "bg-red-500/15 text-red-400 border border-red-500/25"
      : timeRemaining <= 300
        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
        : "bg-white/5 text-white/50 border border-white/10";

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${colorClass} ${className}`}>
      <Clock className="h-3.5 w-3.5" />
      {formatTime(timeRemaining)}
    </div>
  );
}