"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Gem,
  Target,
  Flame,
  X,
  Loader2,
  ChevronDown,
  Users,
} from "lucide-react";
import { useGetBatchLeaderboardQuery } from "@/redux/api/gamificationApi";
import type { ILeaderboardEntry } from "@/types/quiz";

type Period = "all_time" | "monthly";

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  currentUserId?: string;
}

export default function LeaderboardDrawer({
  isOpen,
  onClose,
  batchId,
  currentUserId,
}: LeaderboardDrawerProps) {
  const [period, setPeriod] = useState<Period>("all_time");
  const [page, setPage] = useState(1);
  const [allEntries, setAllEntries] = useState<ILeaderboardEntry[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const currentUserRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useGetBatchLeaderboardQuery(
    { batchId, period, page, limit: 20 },
    { skip: !batchId }
  );

  const raw = data as any;
  const entries: ILeaderboardEntry[] = useMemo(() => raw?.data ?? [], [raw]);
  const totalPages: number = useMemo(() => raw?.meta?.totalPages ?? 1, [raw]);

  // Reset when period changes
  useEffect(() => {
    setPage(1);
    setAllEntries([]);
    setHasMore(true);
  }, [period]);

  // Accumulate entries across pages
  useEffect(() => {
    if (entries.length > 0) {
      setAllEntries((prev) => {
        if (page === 1) return entries;
        const existingIds = new Set(prev.map((e) => e.userId._id));
        const newEntries = entries.filter((e) => !existingIds.has(e.userId._id));
        return [...prev, ...newEntries];
      });
      setHasMore(page < totalPages);
    } else if (page === 1) {
      setAllEntries([]);
      setHasMore(false);
    }
  }, [entries, page, totalPages]);

  // Scroll current user into view when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        currentUserRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 400);
    }
  }, [isOpen, allEntries]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((p) => p + 1);
    }
  }, [isFetching, hasMore]);

  // Infinite scroll
  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
        handleLoadMore();
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isOpen, handleLoadMore]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1000] transition-all duration-300 ${
          isOpen
            ? "bg-black/50 backdrop-blur-sm opacity-100"
            : "bg-transparent backdrop-blur-none opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[1001] h-full w-full sm:w-[420px] transition-transform duration-300 ease-out will-change-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-gradient-to-b from-[#0a0f18] via-[#0e1525] to-[#0a0f18] border-l border-white/[0.06] shadow-2xl shadow-black/60 flex flex-col">
          {/* Header */}
          <div className="shrink-0 px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Leaderboard</h2>
                  <p className="text-[11px] text-white/35">Same batch rankings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Period filter */}
            <div className="flex gap-1 mt-3">
              {(["all_time", "monthly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    period === p
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white/40 hover:text-white/60 border border-transparent"
                  }`}
                >
                  {p === "all_time" ? "All Time" : "This Month"}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard list */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/[0.06] scrollbar-track-transparent"
          >
            {!batchId ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Users className="h-10 w-10 text-white/[0.06]" />
                <p className="text-xs text-white/25">No batch enrollment found</p>
              </div>
            ) : isLoading && page === 1 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-7 w-7 text-primary animate-spin" />
                <p className="text-xs text-white/30">Loading...</p>
              </div>
            ) : allEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Trophy className="h-10 w-10 text-white/[0.06]" />
                <p className="text-xs text-white/25">No entries yet in this batch</p>
              </div>
            ) : (
              <div className="py-2 px-3 space-y-1">
                {allEntries.map((entry) => (
                  <LeaderboardRow
                    key={`${entry.rank}-${entry.userId._id}`}
                    entry={entry}
                    currentUserId={currentUserId}
                    ref={
                      currentUserId && entry.userId._id === currentUserId
                        ? currentUserRef
                        : undefined
                    }
                  />
                ))}

                {/* Load more */}
                {hasMore && (
                  <div className="text-center py-4">
                    {isFetching ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin mx-auto" />
                    ) : (
                      <button
                        onClick={handleLoadMore}
                        className="text-xs text-white/30 hover:text-white/60 transition-colors"
                      >
                        Load more
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-5 py-3 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/15 text-center">
              Rankings update after each quiz attempt
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ───── Row Component ───── */
const LeaderboardRow = ({
  entry,
  currentUserId,
  ref: rowRef,
}: {
  entry: ILeaderboardEntry;
  currentUserId?: string;
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const isCurrentUser = currentUserId && entry.userId._id === currentUserId;

  const rankDisplay = (rank: number) => {
    if (rank === 1)
      return <Crown className="h-4 w-4 text-yellow-400" />;
    if (rank === 2)
      return <Medal className="h-4 w-4 text-gray-300" />;
    if (rank === 3)
      return <Medal className="h-4 w-4 text-amber-600" />;
    return (
      <span className="text-xs font-semibold text-white/25 w-4 text-center">
        {rank}
      </span>
    );
  };

  return (
    <div
      ref={rowRef}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        isCurrentUser
          ? "bg-primary/[0.08] border border-primary/25 shadow-sm shadow-primary/5"
          : "hover:bg-white/[0.02] border border-transparent"
      }`}
    >
      {/* Rank */}
      <div className="w-6 flex justify-center shrink-0">{rankDisplay(entry.rank)}</div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0 ring-1 ring-white/10">
        {entry.userId.avatar || entry.userId.image ? (
          <img
            src={entry.userId.avatar || entry.userId.image}
            alt={entry.userId.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-white/40">
            {entry.userId.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/80 truncate flex items-center gap-1.5">
          <span className="truncate">{entry.userId.name}</span>
          {isCurrentUser && (
            <span className="text-[9px] px-1 py-0.5 rounded bg-primary/20 text-primary border border-primary/25 shrink-0 font-semibold">
              You
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs shrink-0">
        <div className="flex items-center gap-1">
          <Gem className="h-3 w-3 text-yellow-400/60" />
          <span className="font-bold text-white/80">{entry.totalZames}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <Target className="h-3 w-3 text-white/20" />
          <span className="font-medium text-white/40">{entry.quizzesCompleted}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <Flame className="h-3 w-3 text-orange-400/30" />
          <span className="font-medium text-white/40">{entry.averageScore}%</span>
        </div>
      </div>
    </div>
  );
};
