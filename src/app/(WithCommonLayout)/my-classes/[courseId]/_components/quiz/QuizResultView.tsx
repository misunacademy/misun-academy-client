"use client";

import React from "react";
import { ChevronRight, Loader2, Trophy, AlertTriangle, CheckCircle, XCircle, HelpCircle, RotateCcw } from "lucide-react";
import { useGetAttemptResultQuery } from "@/redux/api/attemptApi";
import type { IAttemptResult, IQuestionReview } from "@/types/quiz";
import { extractApiData } from "@/lib/api-helpers";
import OutlineBtn from "../OutlineBtn";
import { AnswerReviewList } from "./AnswerReviewList";

interface QuizResultViewProps {
  readonly quizId: string;
  readonly attemptId: string;
  readonly questions: IQuestionReview[];
  readonly canReAttempt: boolean;
  readonly isStarting: boolean;
  readonly onViewSummary: () => void;
  readonly onReAttempt: () => void;
}

export const QuizResultView = React.memo(function QuizResultView({
  quizId,
  attemptId,
  questions: attemptQuestions,
  onViewSummary,
  canReAttempt,
  onReAttempt,
  isStarting,
}: QuizResultViewProps) {
  const [showReview, setShowReview] = React.useState(false);
  const { data: resultRaw, isLoading } = useGetAttemptResultQuery({ quizId, attemptId });
  const result = extractApiData<IAttemptResult>(resultRaw);

  if (isLoading || !result) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[300px]" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="sr-only">Loading quiz results...</span>
      </div>
    );
  }

  const { attempt, motivationalMessage, questions: resultQuestions } = result;
  const reviewQuestions = resultQuestions?.length ? resultQuestions : attemptQuestions;
  const canReview = reviewQuestions && reviewQuestions.length > 0;

  return (
    <div 
      className="p-8 max-w-lg mx-auto text-center space-y-6" 
      role="region" 
      aria-labelledby="result-title"
      aria-describedby="result-description"
    >
      <div 
        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          attempt.passed ? "bg-green-500/15" : "bg-red-500/15"
        }`}
        role="img"
        aria-label={attempt.passed ? "Quiz passed" : "Quiz failed"}
      >
        {attempt.passed
          ? <Trophy className="h-10 w-10 text-green-400" />
          : <AlertTriangle className="h-10 w-10 text-red-400" />}
      </div>

      <div>
        <h2 
          id="result-title" 
          className={`text-2xl font-bold ${attempt.passed ? "text-green-400" : "text-red-400"}`}
        >
          {attempt.passed ? "Quiz Completed!" : "Keep Trying!"}
        </h2>
        {motivationalMessage && (
          <p 
            id="result-description" 
            className="text-white/50 text-sm mt-2"
          >
            {motivationalMessage.emoji} {motivationalMessage.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3" role="list" aria-label="Quiz scores">
        <div 
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3" 
          role="listitem"
        >
          <p className="text-xl font-bold text-white">{attempt.earnedMarks ?? 0}/{attempt.totalMarks ?? 0}</p>
          <p className="text-[10px] text-white/40">Score</p>
        </div>
        <div 
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3" 
          role="listitem"
        >
          <p className="text-xl font-bold text-white">{(attempt.percentage ?? 0).toFixed(0)}%</p>
          <p className="text-[10px] text-white/40">Percentage</p>
        </div>
        <div 
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3" 
          role="listitem"
        >
          <p className={`text-xl font-bold ${attempt.passed ? "text-green-400" : "text-red-400"}`}>
            {attempt.passed ? "PASS" : "FAIL"}
          </p>
          <p className="text-[10px] text-white/40">Status</p>
        </div>
      </div>

      <div 
        className="flex items-center justify-center gap-4 text-xs text-white/40"
        role="status"
        aria-label={`Correct: ${attempt.correctCount}, Incorrect: ${attempt.wrongCount}, Unanswered: ${attempt.unansweredCount}`}
      >
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
          {attempt.correctCount}
        </span>
        <span className="flex items-center gap-1">
          <XCircle className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
          {attempt.wrongCount}
        </span>
        <span className="flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
          {attempt.unansweredCount}
        </span>
      </div>

      {attempt.zamesEarned > 0 && (
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5" role="status">
          <Trophy className="h-4 w-4 text-yellow-400" aria-hidden="true" />
          <span className="text-sm font-semibold text-yellow-400">+{attempt.zamesEarned} Zames Points</span>
        </div>
      )}

      {canReview && (
        <button
          type="button"
          onClick={() => setShowReview(!showReview)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-sm font-medium text-white/60 hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-expanded={showReview}
          aria-controls="answer-review"
          aria-label={showReview ? "Hide answer review" : "Review answers"}
        >
          {showReview ? "Hide Answers" : "Review Answers"}
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${showReview ? "rotate-90" : ""}`} aria-hidden="true" />
        </button>
      )}

      {canReAttempt && (
        <OutlineBtn
          className="w-full justify-center py-2.5 mt-2 gap-2"
          onClick={onReAttempt}
          disabled={isStarting}
          aria-label={isStarting ? "Starting quiz" : "Re-attempt quiz"}
        >
          <RotateCcw className="h-4 w-4" />
          {isStarting ? "Starting..." : "Re-attempt Quiz"}
        </OutlineBtn>
      )}

      {showReview && canReview && (
        <div id="answer-review" role="region" aria-label="Answer review">
          <AnswerReviewList questions={reviewQuestions} answers={attempt.answers || []} />
        </div>
      )}

      <OutlineBtn 
        className="w-full justify-center py-2.5" 
        onClick={onViewSummary}
        aria-label="View quiz summary"
      >
        View Summary
      </OutlineBtn>
    </div>
  );
});