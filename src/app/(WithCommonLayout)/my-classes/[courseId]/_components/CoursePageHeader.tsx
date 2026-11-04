"use client";

import Link from "next/link";
import { Gem, Trophy, ChevronLeft } from "lucide-react";
import NotificationBell from "@/components/shared/NotificationBell";

interface CoursePageHeaderProps {
  courseTitle: string;
  instructorName: string;
  totalZames: number;
  batchId?: string | null;
  onLeaderboardClick: () => void;
}

export function CoursePageHeader({ courseTitle, instructorName, totalZames, batchId, onLeaderboardClick }: CoursePageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Link href="/my-classes">
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white/70 border border-white/[0.12] hover:bg-white/[0.06] hover:text-white hover:border-white/[0.20] transition-colors duration-200">
          <ChevronLeft className="h-4 w-4 text-white/70 hover:text-white transition-colors duration-200" />
          My Classes
        </button>
      </Link>
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug truncate">{courseTitle}</h1>
        <p className="text-sm text-white/40 mt-0.5">by {instructorName}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onLeaderboardClick}
          disabled={!batchId}
          aria-label="Open leaderboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Gem className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold text-emerald-300">{totalZames}</span>
          <div className="ml-1 w-[1px] h-4 bg-emerald-500/20" />
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
        </button>
        <NotificationBell />
      </div>
    </div>
  );
}