"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuizTimerBadge } from "./QuizTimerBadge";
import { QuizProgressBar } from "./QuizProgressBar";
import type { IQuestionPlay, IQuiz } from "@/types/quiz";
import { QuestionCard } from "../QuestionCard";

interface QuizActiveScreenProps {
  readonly quizInfo: IQuiz;
  readonly questions: IQuestionPlay[];
  readonly currentIndex: number;
  readonly timeRemaining: number | null;
  readonly selectedAnswer: string | null;
  readonly answeredCount: number;
  readonly onSelectAnswer: (value: string) => void;
  readonly onNext: () => void;
  readonly onSubmit: () => void;
  readonly onPrev: () => void;
  readonly canGoNext: boolean;
  readonly canGoPrev: boolean;
  readonly error: string | null;
  readonly isLastQuestion: boolean;
  readonly totalQuestions: number;
}

export const QuizActiveScreen = React.memo(function QuizActiveScreen({
  quizInfo,
  questions,
  currentIndex,
  timeRemaining,
  selectedAnswer,
  answeredCount,
  onSelectAnswer,
  onNext,
  onSubmit,
  onPrev,
  canGoNext,
  canGoPrev,
  error,
  isLastQuestion,
  totalQuestions,
}: QuizActiveScreenProps) {
  const currentQuestion = questions[currentIndex];

  return (
    <div 
      className="p-6" 
      role="region" 
      aria-label="Active quiz screen"
      aria-describedby="quiz-progress"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 
            id="quiz-title" 
            className="font-bold text-white"
          >
            {quizInfo.title}
          </h3>
          {timeRemaining !== null && (
            <QuizTimerBadge timeRemaining={timeRemaining} />
          )}
        </div>
      </div>

      <div id="quiz-progress">
        <QuizProgressBar
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
        />
      </div>

      {error && (
        <p 
          className="text-red-400 text-sm mb-4" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {currentQuestion && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            selectedAnswer={selectedAnswer}
            onSelect={onSelectAnswer}
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white/[0.06] text-white/70 enabled:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Go to previous question"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <span 
          className="text-xs text-white/50"
          aria-hidden="true"
        >
          Question {currentIndex + 1} of {totalQuestions}
        </span>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canGoNext}
            title={canGoNext ? "Submit quiz" : `Answer all questions (${answeredCount}/${totalQuestions})`}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={canGoNext ? "Submit quiz" : `Cannot submit: answer all questions first`}
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white/[0.06] text-white/70 enabled:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Go to next question"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
});
