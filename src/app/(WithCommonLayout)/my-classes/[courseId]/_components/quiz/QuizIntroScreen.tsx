"use client";

import { HelpCircle } from "lucide-react";
import OutlineBtn from "../OutlineBtn";
import type { IQuiz } from "@/types/quiz";

interface QuizIntroScreenProps {
  readonly quizInfo: IQuiz;
  readonly error: string | null;
  readonly onStart: () => void;
  readonly starting: boolean;
  readonly maxAttempts: number;
  readonly canReAttempt: boolean;
  readonly remainingAttempts: number;
}

export function QuizIntroScreen({
  quizInfo,
  error,
  onStart,
  starting,
  maxAttempts,
  canReAttempt,
  remainingAttempts,
}: QuizIntroScreenProps) {
  const getAttemptText = () => {
    if (maxAttempts === 0) return "Unlimited attempts";
    if (maxAttempts === 1) return "1 attempt";
    return `${maxAttempts} attempts`;
  };

  return (
    <div
      className="p-8 max-w-xl mx-auto"
      role="region"
      aria-labelledby="quiz-title"
      aria-describedby="quiz-instructions"
    >
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 bg-primary/15 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto mb-4"
          role="img"
          aria-label="Quiz information"
        >
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h2
          id="quiz-title"
          className="text-xl font-bold text-white mb-2"
        >
          {quizInfo.title}
        </h2>
        {quizInfo.description && (
          <p
            id="quiz-instructions"
            className="text-white/50 text-sm"
            dangerouslySetInnerHTML={{ __html: quizInfo.description }}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center"
          role="status"
          aria-label={`${quizInfo.totalQuestions} questions available`}
        >
          <p className="text-2xl font-bold text-white" aria-hidden="true">{quizInfo.totalQuestions}</p>
          <p className="text-xs text-white/40">Questions</p>
        </div>
        <div
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center"
          role="status"
          aria-label={`${quizInfo.totalMarks} marks available`}
        >
          <p className="text-2xl font-bold text-white" aria-hidden="true">{quizInfo.totalMarks}</p>
          <p className="text-xs text-white/40">Marks</p>
        </div>
        {quizInfo.timeLimit !== undefined && quizInfo.timeLimit !== null && quizInfo.timeLimit > 0 && (
          <div
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center"
            role="status"
            aria-label={`${quizInfo.timeLimit} minutes time limit`}
          >
            <p className="text-2xl font-bold text-white" aria-hidden="true">{quizInfo.timeLimit}</p>
            <p className="text-xs text-white/40">Minutes</p>
          </div>
        )}
        <div
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center"
          role="status"
          aria-label={`Passing score is ${quizInfo.passingPercentage ?? 0} percent`}
        >
          <p className="text-2xl font-bold text-white" aria-hidden="true">{quizInfo.passingPercentage ?? 0}%</p>
          <p className="text-xs text-white/40">Pass</p>
        </div>
      </div>

      {maxAttempts > 0 && (
        <div className="text-center text-xs text-white/30 mb-4">
          Allowed Attempts: {getAttemptText()}
          {!canReAttempt && remainingAttempts <= 0 && " - No attempts remaining"}
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center mb-4" role="alert">{error}</p>}

      <OutlineBtn
        className="w-full justify-center py-3"
        onClick={onStart}
        disabled={starting}
        aria-label={starting ? "Starting quiz" : "Start quiz"}
      >
        {starting ? "Starting..." : "Start Quiz"}
      </OutlineBtn>

      {canReAttempt && remainingAttempts > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-white/40">
            You have {remainingAttempts} {remainingAttempts === 1 ? "attempt" : "attempts"} remaining
          </p>
        </div>
      )}
    </div>
  );
}