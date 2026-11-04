"use client";

import React from "react";
import { useQuizAttempt } from "./quiz/useQuizAttempt";
import { useQuizEnrollment } from "./quiz/useQuizEnrollment";
import { QuizIntroScreen } from "./quiz/QuizIntroScreen";
import { QuizSummaryScreen } from "./quiz/QuizSummaryScreen";
import { QuizActiveScreen } from "./quiz/QuizActiveScreen";
import { QuizResultView } from "./quiz/QuizResultView";
import OutlineBtn from "./OutlineBtn";
import DarkCard from "./DarkCard";

interface QuizPlayerProps {
  readonly quizId: string;
  readonly courseId: string;
  readonly batchId: string;
  readonly enrollmentId: string;
  readonly onComplete: () => void;
  readonly onBack: () => void;
}

export const QuizPlayer = React.memo(function QuizPlayer({
  quizId,
  courseId,
  batchId,
  enrollmentId,
  onComplete,
  onBack,
}: QuizPlayerProps) {
  const { enrollmentIdFromBatch } = useQuizEnrollment(courseId, enrollmentId);

  const {
    phase,
    questions,
    currentIndex,
    timeRemaining,
    selectedAnswer,
    answeredCount,
    error,
    starting,
    submitting,
    quizInfo,
    lastAttempt,
    completedAttempts,
    maxAttempts,
    canReAttempt,
    reviewAttemptId,
    leaveQuizPending,
    infoLoading,
    attemptsLoading,
    attemptsFetching,
    handleStart,
    handleSelectAnswer,
    handleNext,
    handlePrev,
    handleSubmit,
    handleViewSummary,
    handleReviewAnswers,
    handleBackToSummary,
    handleConfirmLeaveQuiz,
    handleCancelLeaveQuiz,
    canGoNext,
    canGoPrev,
  } = useQuizAttempt(quizId, courseId, batchId, enrollmentIdFromBatch, onComplete, onBack);

  const hasPassed = completedAttempts.some((a) => a.passed);
  const hasInfiniteAttempts = maxAttempts === 0;

  const loading = React.useMemo(
    () => infoLoading || attemptsLoading || attemptsFetching || phase === "loading",
    [infoLoading, attemptsLoading, attemptsFetching, phase]
  );

  const zeroQuestions = React.useMemo(() => questions.length === 0, [questions.length]);

  if (loading) {
    return (
      <div
        className="p-12 flex items-center justify-center min-h-[400px]"
        role="status"
        aria-live="polite"
      >
        <DarkCard className="p-12 flex items-center justify-center">
          <div
            className="h-8 w-8 text-primary animate-spin"
            role="progressbar"
            aria-label="Loading quiz information"
          />
          <span className="sr-only">Loading quiz information...</span>
        </DarkCard>
      </div>
    );
  }

  if (!quizInfo) {
    return (
      <div className="p-8 text-center" role="status">
        <DarkCard className="p-8">
          <p className="text-white/40" aria-live="polite">
            Quiz not found.
          </p>
        </DarkCard>
      </div>
    );
  }

  if (zeroQuestions) {
    return (
      <div className="p-8 text-center">
        <DarkCard className="p-8">
          <h2 className="text-xl font-bold text-white mb-2" aria-live="polite">
            No Questions Available
          </h2>
          <p className="text-white/40 text-sm mb-6" aria-live="polite">
            This quiz has no questions configured. Please contact the instructor for assistance.
          </p>
          <OutlineBtn
            className="justify-center py-2.5"
            onClick={onBack}
            aria-label="Return to course dashboard"
          >
            Back to Dashboard
          </OutlineBtn>
        </DarkCard>
      </div>
    );
  }

  if (hasPassed && !canReAttempt) {
    return (
      <div className="p-8 text-center">
        <DarkCard className="p-8">
          <h2 className="text-xl font-bold text-green-400 mb-2" aria-live="polite">
            Quiz Completed!
          </h2>
          <p className="text-white/40 text-sm mb-4" aria-live="polite">
            You have already passed this quiz. Congratulations!
          </p>
          <OutlineBtn
            className="justify-center py-2.5"
            onClick={onBack}
            aria-label="Return to course dashboard"
          >
            Back to Dashboard
          </OutlineBtn>
        </DarkCard>
      </div>
    );
  }

  return (
    <ErrorBoundary
      error={error}
      onErrorRetry={handleStart}
      errorRetryText="Restart Quiz"
    >
      <div className="space-y-4" role="main" aria-label="Quiz player interface">
        {leaveQuizPending && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-quiz-title"
          >
            <DarkCard className="p-8 max-w-md w-full mx-4">
              <h2 id="leave-quiz-title" className="text-lg font-bold text-white mb-4" aria-live="polite">
                Leave Quiz?
              </h2>
              <p className="text-white/90 text-sm mb-6" aria-live="polite">
                You have unsaved answers. Are you sure you want to leave this quiz?
              </p>
              <div className="flex gap-3 justify-end">
                <OutlineBtn
                  className="px-4 py-2.5"
                  onClick={handleCancelLeaveQuiz}
                  disabled={submitting}
                  aria-label="Cancel leaving quiz"
                >
                  Stay
                </OutlineBtn>
                <OutlineBtn
                  className="px-4 py-2.5 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  onClick={handleConfirmLeaveQuiz}
                  disabled={submitting}
                  aria-label="Confirm leaving quiz"
                >
                  Leave Quiz
                </OutlineBtn>
              </div>
            </DarkCard>
          </div>
        )}

        <section aria-label="Quiz Player" aria-describedby="quiz-status">
          <span
            id="quiz-status"
            className="sr-only"
            aria-live="polite"
          >
            Current phase: {phase}. {questions.length} questions total.{
              hasInfiniteAttempts ? " Unlimited attempts" : `Max ${maxAttempts} attempts`}
          </span>

          <DarkCard className="overflow-hidden">
            {phase === "start" && (
              <QuizIntroScreen
                quizInfo={quizInfo}
                error={error}
                onStart={handleStart}
                starting={starting}
                maxAttempts={maxAttempts}
                canReAttempt={canReAttempt}
                remainingAttempts={
                  hasInfiniteAttempts ? Infinity : maxAttempts - completedAttempts.length
                }
              />
            )}

            {phase === "summary" && (
              <QuizSummaryScreen
                quizInfo={quizInfo}
                lastAttempt={lastAttempt}
                completedCount={completedAttempts.length}
                maxAttempts={maxAttempts}
                canReAttempt={canReAttempt}
                hasPassed={hasPassed}
                onReAttempt={handleStart}
                onReviewAnswers={handleReviewAnswers}
                onContinue={onComplete}
                onBack={onBack}
                isStarting={starting}
                error={error}
              />
            )}

            {phase === "active" && (
              <QuizActiveScreen
                quizInfo={quizInfo}
                questions={questions}
                currentIndex={currentIndex}
                timeRemaining={timeRemaining}
                selectedAnswer={selectedAnswer}
                answeredCount={answeredCount}
                onSelectAnswer={handleSelectAnswer}
                onNext={handleNext}
                onSubmit={handleSubmit}
                onPrev={handlePrev}
                canGoNext={canGoNext}
                canGoPrev={canGoPrev}
                error={error}
                isLastQuestion={currentIndex === questions.length - 1}
                totalQuestions={questions.length}
              />
            )}

            {phase === "submitting" && (
              <div
                className="p-12 flex items-center justify-center min-h-[300px]"
                role="status"
                aria-live="polite"
              >
                <div className="text-center space-y-3">
                  <div
                    className="h-8 w-8 text-primary animate-spin mx-auto"
                    role="progressbar"
                    aria-label="Submitting answers"
                  />
                  <p className="text-white/50 text-sm">Submitting your answers...</p>
                </div>
              </div>
            )}

            {phase === "result" && quizInfo && (
              <QuizResultView
                quizId={quizId}
                attemptId={quizInfo._id}
                questions={questions}
                onViewSummary={handleViewSummary}
                canReAttempt={canReAttempt}
                onReAttempt={handleStart}
                isStarting={starting}
              />
            )}

            {phase === "review" && reviewAttemptId && (
              <QuizResultView
                quizId={quizId}
                attemptId={reviewAttemptId}
                questions={questions}
                onViewSummary={handleBackToSummary}
                canReAttempt={canReAttempt}
                onReAttempt={handleStart}
                isStarting={starting}
              />
            )}
          </DarkCard>
        </section>
      </div>
    </ErrorBoundary>
  );
});

function ErrorBoundary({
  children,
  error,
  onErrorRetry,
  errorRetryText,
}: {
  children: React.ReactNode;
  error: string | null;
  onErrorRetry: () => void;
  errorRetryText: string;
}) {
  if (error) {
    return (
      <div
        className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center"
        role="alert"
        aria-live="assertive"
      >
        <svg
          className="h-12 w-12 text-red-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-white/40 text-sm mb-6">{error ?? "An unexpected error occurred."}</p>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-white/[0.08] hover:bg-white/[0.06] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          onClick={onErrorRetry}
        >
          {errorRetryText}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}