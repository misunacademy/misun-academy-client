"use client";

import { CheckCircle, XCircle, HelpCircle, Clock } from "lucide-react";
import DarkCard from "../DarkCard";
import { QuizStatChips } from "./QuizStatChips";
import type { IQuizAttempt } from "@/types/quiz";
import { getMotivationalMessage, formatDuration } from "./quiz.utils";

interface AttemptCardProps {
  attempt: IQuizAttempt;
}

export function AttemptCard({ attempt }: AttemptCardProps) {
  const motivationalMessage = getMotivationalMessage(attempt.percentage);
  const formatDate = (d: string) => new Date(d).toLocaleString();

  return (
    <DarkCard className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${attempt.passed ? "text-green-400" : "text-red-400"}`}>
            {attempt.passed ? "PASS" : "FAIL"}
          </span>
          <span className="text-xs text-white/30">Attempt #{attempt.attemptNumber}</span>
        </div>
        <span className="text-xs text-white/30">{formatDate(attempt.submittedAt || attempt.startedAt)}</span>
      </div>

      {motivationalMessage && (
        <div className="text-center py-2">
          <p className="text-lg">{motivationalMessage.emoji}</p>
          <p className="text-sm font-semibold text-white/80">{motivationalMessage.title}</p>
          <p className="text-xs text-white/40">{motivationalMessage.message}</p>
        </div>
      )}

      <QuizStatChips
        earnedMarks={attempt.earnedMarks ?? 0}
        totalMarks={attempt.totalMarks ?? 0}
        percentage={attempt.percentage ?? 0}
        zamesEarned={attempt.zamesEarned}
      />

      <div className="flex items-center justify-center gap-3 text-xs text-white/40">
        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-400" /> {attempt.correctCount}</span>
        <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> {attempt.wrongCount}</span>
        <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3 text-white/30" /> {attempt.unansweredCount}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-white/30" /> {formatDuration(attempt.timeTaken)}</span>
      </div>
    </DarkCard>
  );
}