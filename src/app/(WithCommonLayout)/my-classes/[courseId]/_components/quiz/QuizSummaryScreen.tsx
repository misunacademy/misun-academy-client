"use client";

import { RotateCcw } from "lucide-react";
import OutlineBtn from "../OutlineBtn";
import type { IQuiz, IQuizAttempt } from "@/types/quiz";
import { AttemptCard } from "./AttemptCard";

interface QuizSummaryScreenProps {
  readonly quizInfo: IQuiz;
  readonly lastAttempt: IQuizAttempt | undefined;
  readonly completedCount: number;
  readonly maxAttempts: number;
  readonly canReAttempt: boolean;
  readonly hasPassed: boolean;
  readonly onReAttempt: () => void;
  readonly onReviewAnswers: (attemptId: string) => void;
  readonly isStarting: boolean;
  readonly error: string | null;
}

export function QuizSummaryScreen({
  quizInfo,
  lastAttempt,
  completedCount,
  maxAttempts,
  canReAttempt,
  hasPassed,
  onReAttempt,
  onReviewAnswers,
  isStarting,
  error,
}: QuizSummaryScreenProps) {
  const remaining = maxAttempts > 0 ? maxAttempts - completedCount : Infinity;

  return (
    <div 
      className="p-8 max-w-xl mx-auto space-y-6" 
      role="region" 
      aria-labelledby="quiz-summary-title"
    >
      <div className="text-center">
        <h2 
          id="quiz-summary-title" 
          className="text-xl font-bold text-white mb-1"
        >
          {quizInfo.title}
        </h2>
        <p className="text-xs text-white/30">
          Attempt {completedCount}{maxAttempts > 0 ? ` of ${maxAttempts}` : ""}
        </p>
      </div>

      {lastAttempt && <AttemptCard attempt={lastAttempt} />}

      {!lastAttempt && !canReAttempt && (
        <p className="text-white/40 text-sm text-center" role="status">
          No previous attempts found.
        </p>
      )}

      <div 
        className="flex items-center justify-center gap-2 text-xs text-white/30"
        role="status"
        aria-label={`Completed: ${completedCount}${maxAttempts > 0 ? `, Allowed: ${maxAttempts}, Remaining: ${remaining}` : ""}`}
      >
        <span>Completed: {completedCount}</span>
        {maxAttempts > 0 && (
          <>
            <span>&middot;</span>
            <span>Allowed: {maxAttempts}</span>
            <span>&middot;</span>
            <span>Remaining: {remaining}</span>
          </>
        )}
      </div>

      {maxAttempts > 0 && remaining <= 0 && !hasPassed && (
        <p 
          className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-center text-xs leading-relaxed text-amber-200/80"
          role="alert"
        >
          You&apos;ve used all {maxAttempts} attempt{maxAttempts !== 1 ? "s" : ""} without passing.
          Contact your instructor to reset your attempts so you can try again and continue.
        </p>
      )}

      {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {canReAttempt ? (
          <OutlineBtn 
            className="flex-1 justify-center py-2.5 gap-2" 
            onClick={onReAttempt} 
            disabled={isStarting}
            aria-label={isStarting ? "Starting quiz" : "Re-attempt quiz"}
          >
            <RotateCcw className="h-4 w-4" />
            {isStarting ? "Starting..." : "Re-attempt Quiz"}
          </OutlineBtn>
        ) : null}
        {lastAttempt && (
          <OutlineBtn 
            className="flex-1 justify-center py-2.5 gap-2" 
            onClick={() => onReviewAnswers(lastAttempt._id)}
            aria-label="Review answers from last attempt"
          >
            Review Answers
          </OutlineBtn>
        )}
      </div>
    </div>
  );
}
