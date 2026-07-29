"use client";

import React from "react";
import {
  ChevronLeft, ChevronRight, HelpCircle, Clock,
  Trophy, AlertTriangle, CheckCircle, XCircle, Loader2, RotateCcw
} from "lucide-react";
import { useGetQuizInfoQuery, useStartAttemptMutation, useSubmitAttemptMutation, useGetAttemptResultQuery, useGetUserAttemptsQuery } from "@/redux/api/attemptApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import type { IQuestionPlay, IQuizAttempt, IAttemptResult } from "@/types/quiz";
import { ContentBlockDisplay } from "@/components/quiz/ContentBlockDisplay";
import { QuestionCard } from "./QuestionCard";
import DarkCard from "./DarkCard";
import OutlineBtn from "./OutlineBtn";

interface QuizPlayerProps {
  quizId: string;
  courseId: string;
  moduleIndex: number;
  onComplete: () => void;
  onBack: () => void;
}

type Phase = "loading" | "start" | "summary" | "active" | "submitting" | "result" | "review";

export function QuizPlayer({ quizId, courseId, moduleIndex, onComplete, onBack }: QuizPlayerProps) {
  const { data: quizInfoRaw, isLoading: infoLoading } = useGetQuizInfoQuery(quizId);
  const quizInfo = quizInfoRaw?.data ?? quizInfoRaw;
  const { data: enrollments } = useGetEnrollmentsQuery(undefined);
  const { data: attemptsRaw } = useGetUserAttemptsQuery(quizId);
  const [startAttempt, { isLoading: starting }] = useStartAttemptMutation();
  const [submitAttempt, { isLoading: submitting }] = useSubmitAttemptMutation();

  const attempts: IQuizAttempt[] = (attemptsRaw as any)?.data ?? attemptsRaw ?? [];
  const completedAttempts = React.useMemo(
    () => (attempts || []).filter((a: any) => a.status === "completed"),
    [attempts]
  );
  const lastAttempt = completedAttempts[0] as IQuizAttempt | undefined;
  const hasPreviousAttempts = completedAttempts.length > 0;

  const enrollment = React.useMemo(() => {
    if (!enrollments?.data) return undefined;
    return enrollments.data.find((e: any) => {
      const cId = e.batchId?.courseId?._id || e.batchId?.courseId;
      return cId === courseId;
    });
  }, [enrollments, courseId]);
  const enrollmentId = enrollment?._id || "";

  const maxAttempts = quizInfo?.maxAttempts ?? 0;
  const remainingAttempts = maxAttempts > 0 ? maxAttempts - completedAttempts.length : Infinity;
  const canReAttempt = remainingAttempts > 0;

  const determinedPhase: Phase = React.useMemo(() => {
    if (hasPreviousAttempts) return "summary";
    return "start";
  }, [hasPreviousAttempts]);

  const [phase, setPhase] = React.useState<Phase>("loading");
  const [questions, setQuestions] = React.useState<IQuestionPlay[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string | null>>({});
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [lastResultId, setLastResultId] = React.useState<string | null>(null);
  const [reviewAttemptId, setReviewAttemptId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (phase !== "loading") return;
    if (infoLoading) return;
    if (!quizInfo) return;
    setPhase(determinedPhase);
  }, [phase, infoLoading, quizInfo, determinedPhase]);

  const timerActive = phase === "active" && timeRemaining !== null && timeRemaining > 0;

  React.useEffect(() => {
    if (!timerActive) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive]);

  React.useEffect(() => {
    if (timeRemaining === 0 && phase === "active") {
      handleSubmit();
    }
  }, [timeRemaining]);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion._id] ?? null : null;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = async () => {
    if (!enrollmentId) { setError("You are not enrolled in this course."); return; }
    setError(null);
    try {
      const res: any = await startAttempt({ quizId, enrollmentId }).unwrap();
      const data = res.data ?? res;
      setAttemptId(data.attempt._id);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers({});
      if (data.quiz.timeLimit) {
        setTimeRemaining(data.quiz.timeLimit * 60);
      }
      setPhase("active");
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || err?.message || "Failed to start quiz";
      setError(msg);
    }
  };

  const handleSelectAnswer = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion._id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setPhase("submitting");
    try {
      const timeTaken = quizInfo?.timeLimit
        ? quizInfo.timeLimit * 60 - (timeRemaining ?? 0)
        : undefined;
      await submitAttempt({
        quizId,
        attemptId,
        data: {
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          })),
          timeTaken,
        },
      }).unwrap();
      setLastResultId(attemptId);
      setPhase("result");
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || err?.message || "Failed to submit quiz";
      setError(msg);
      setPhase("active");
    }
  };

  const handleViewSummary = () => {
    setPhase("summary");
  };

  const handleReviewAnswers = (attemptId: string) => {
    setReviewAttemptId(attemptId);
    setPhase("review");
  };

  const handleBackToSummary = () => {
    setReviewAttemptId(null);
    setPhase("summary");
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const canGoNext = selectedAnswer !== null;
  const canGoPrev = currentIndex > 0;

  if (infoLoading || phase === "loading") {
    return (
      <DarkCard className="p-12 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </DarkCard>
    );
  }

  if (!quizInfo) {
    return (
      <DarkCard className="p-8 text-center">
        <p className="text-white/40">Quiz not found.</p>
      </DarkCard>
    );
  }

  return (
    <div className="space-y-4">
      <section aria-label="Quiz Player">
        <DarkCard className="overflow-hidden">
          {phase === "start" && (
            <QuizIntroScreen quizInfo={quizInfo} error={error} onStart={handleStart} starting={starting} />
          )}

          {phase === "summary" && (
            <QuizSummaryScreen
              quizInfo={quizInfo}
              lastAttempt={lastAttempt}
              completedCount={completedAttempts.length}
              maxAttempts={maxAttempts}
              canReAttempt={canReAttempt}
              onReAttempt={handleStart}
              onReviewAnswers={handleReviewAnswers}
              onContinue={onComplete}
              onBack={onBack}
              isStarting={starting}
              error={error}
            />
          )}

          {phase === "active" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white">{quizInfo.title}</h3>
                  {timeRemaining !== null && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      timeRemaining <= 60
                        ? "bg-red-500/15 text-red-400 border border-red-500/25"
                        : timeRemaining <= 300
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-white/5 text-white/50 border border-white/10"
                    }`}>
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(timeRemaining)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-white/40">{answeredCount} of {questions.length} answered</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex gap-1">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={` flex-1 rounded-full transition-all duration-200 ${
                        idx === currentIndex
                          ? "bg-primary"
                          : answers[questions[idx]._id] !== undefined
                            ? "bg-primary/40"
                            : "bg-white/[0.08] hover:bg-white/[0.12]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              {currentQuestion && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <QuestionCard
                    question={currentQuestion}
                    index={currentIndex}
                    selectedAnswer={selectedAnswer}
                    onSelect={handleSelectAnswer}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                <button
                  onClick={handlePrev}
                  disabled={!canGoPrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white/[0.06] text-white/70 enabled:hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="text-xs text-white/50">Question {currentIndex + 1}</span>

                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-all disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white/[0.06] text-white/70 enabled:hover:text-white"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === "submitting" && (
            <div className="p-12 flex items-center justify-center min-h-[300px]">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                <p className="text-white/50 text-sm">Submitting your answers...</p>
              </div>
            </div>
          )}

          {phase === "result" && attemptId && (
            <QuizResultView
              quizId={quizId}
              attemptId={attemptId}
              questions={questions}
              onViewSummary={handleViewSummary}
            />
          )}

          {phase === "review" && reviewAttemptId && (
            <QuizResultView
              quizId={quizId}
              attemptId={reviewAttemptId}
              questions={questions}
              onViewSummary={handleBackToSummary}
            />
          )}
        </DarkCard>
      </section>
    </div>
  );
}

function QuizIntroScreen({ quizInfo, error, onStart, starting }: { quizInfo: any; error: string | null; onStart: () => void; starting: boolean }) {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/15 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{quizInfo.title}</h2>
        {quizInfo.description && <p className="text-white/50 text-sm">{quizInfo.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{quizInfo.totalQuestions}</p>
          <p className="text-xs text-white/40">Questions</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{quizInfo.totalMarks}</p>
          <p className="text-xs text-white/40">Marks</p>
        </div>
        {quizInfo.timeLimit && (
          <>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{quizInfo.timeLimit}</p>
              <p className="text-xs text-white/40">Minutes</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{quizInfo.passingPercentage}%</p>
              <p className="text-xs text-white/40">Pass</p>
            </div>
          </>
        )}
      </div>

      {quizInfo.maxAttempts > 0 && (
        <div className="text-center text-xs text-white/30 mb-4">
          Allowed Attempts: {quizInfo.maxAttempts}
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      <OutlineBtn className="w-full justify-center py-3" onClick={onStart} disabled={starting}>
        {starting ? "Starting..." : "Start Quiz"}
      </OutlineBtn>
    </div>
  );
}

function QuizSummaryScreen({
  quizInfo, lastAttempt, completedCount, maxAttempts, canReAttempt,
  onReAttempt, onReviewAnswers, onContinue, onBack, isStarting, error
}: {
  quizInfo: any;
  lastAttempt: IQuizAttempt | undefined;
  completedCount: number;
  maxAttempts: number;
  canReAttempt: boolean;
  onReAttempt: () => void;
  onReviewAnswers: (attemptId: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isStarting: boolean;
  error: string | null;
}) {
  const remaining = maxAttempts > 0 ? maxAttempts - completedCount : Infinity;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">{quizInfo.title}</h2>
        <p className="text-xs text-white/30">
          Attempt {completedCount}{maxAttempts > 0 ? ` of ${maxAttempts}` : ""}
        </p>
      </div>

      {lastAttempt && (
        <AttemptCard attempt={lastAttempt} />
      )}

      {!lastAttempt && !canReAttempt && (
        <p className="text-white/40 text-sm text-center">No previous attempts found.</p>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-white/30">
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

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {canReAttempt ? (
          <OutlineBtn className="flex-1 justify-center py-2.5 gap-2" onClick={onReAttempt} disabled={isStarting}>
            <RotateCcw className="h-4 w-4" />
            {isStarting ? "Starting..." : "Re-attempt Quiz"}
          </OutlineBtn>
        ) : null}
        {lastAttempt && (
          <OutlineBtn className="flex-1 justify-center py-2.5 gap-2" onClick={() => onReviewAnswers(lastAttempt._id)}>
            Review Answers
          </OutlineBtn>
        )}
        <OutlineBtn className="flex-1 justify-center py-2.5" onClick={onContinue}>
          Continue Lesson
        </OutlineBtn>
        <OutlineBtn className="flex-1 justify-center py-2.5" onClick={onBack}>
          Back to Module
        </OutlineBtn>
      </div>
    </div>
  );
}

function AttemptCard({ attempt }: { attempt: IQuizAttempt }) {
  const motivationalMessage = getMotivationalMessage(attempt.percentage);
  const formatDate = (d: string) => new Date(d).toLocaleString();
  const formatDuration = (s?: number) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

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

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-white">{attempt.earnedMarks}/{attempt.totalMarks}</p>
          <p className="text-[10px] text-white/40">Score</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-white">{attempt.percentage.toFixed(0)}%</p>
          <p className="text-[10px] text-white/40">Percentage</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-yellow-400">+{attempt.zamesEarned}</p>
          <p className="text-[10px] text-white/40">Zames</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-xs text-white/40">
        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-400" /> {attempt.correctCount}</span>
        <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> {attempt.wrongCount}</span>
        <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3 text-white/30" /> {attempt.unansweredCount}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-white/30" /> {formatDuration(attempt.timeTaken)}</span>
      </div>
    </DarkCard>
  );
}

function QuizResultView({
  quizId, attemptId, questions: attemptQuestions, onViewSummary
}: {
  quizId: string;
  attemptId: string;
  questions: IQuestionPlay[];
  onViewSummary: () => void;
}) {
  const [showReview, setShowReview] = React.useState(false);
  const { data: resultRaw, isLoading } = useGetAttemptResultQuery({ quizId, attemptId });
  const result: any = (resultRaw as any)?.data ?? resultRaw;

  if (isLoading || !result) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const { attempt, motivationalMessage, questions: resultQuestions } = result;
  const questions = resultQuestions?.length > 0 ? resultQuestions : attemptQuestions;
  const answerMap = new Map((attempt.answers || []).map((a: any) => [a.questionId, a]));
  const canReview = questions && questions.length > 0;

  return (
    <div className="p-8 max-w-lg mx-auto text-center space-y-6">
      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
        attempt.passed ? "bg-green-500/15" : "bg-red-500/15"
      }`}>
        {attempt.passed
          ? <Trophy className="h-10 w-10 text-green-400" />
          : <AlertTriangle className="h-10 w-10 text-red-400" />}
      </div>

      <div>
        <h2 className={`text-2xl font-bold ${attempt.passed ? "text-green-400" : "text-red-400"}`}>
          {attempt.passed ? "Quiz Completed!" : "Keep Trying!"}
        </h2>
        {motivationalMessage && (
          <p className="text-white/50 text-sm mt-2">
            {motivationalMessage.emoji} {motivationalMessage.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <p className="text-xl font-bold text-white">{attempt.earnedMarks}/{attempt.totalMarks}</p>
          <p className="text-[10px] text-white/40">Score</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <p className="text-xl font-bold text-white">{attempt.percentage.toFixed(0)}%</p>
          <p className="text-[10px] text-white/40">Percentage</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <p className={`text-xl font-bold ${attempt.passed ? "text-green-400" : "text-red-400"}`}>
            {attempt.passed ? "PASS" : "FAIL"}
          </p>
          <p className="text-[10px] text-white/40">Status</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-green-400" /> {attempt.correctCount}</span>
        <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-red-400" /> {attempt.wrongCount}</span>
        <span className="flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5 text-white/30" /> {attempt.unansweredCount}</span>
      </div>

      {attempt.zamesEarned > 0 && (
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">+{attempt.zamesEarned} Zames Points</span>
        </div>
      )}

      {canReview && (
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-sm font-medium text-white/60 hover:text-white/80"
        >
          {showReview ? "Hide Answers" : "Review Answers"}
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${showReview ? "rotate-90" : ""}`} />
        </button>
      )}

      {showReview && canReview && (
        <div className="space-y-4 text-left">
          {questions.map((q: any, idx: number) => {
            const ans: any = answerMap.get(q._id);
            const selectedIdx = ans?.selectedAnswer;
            const correctIdx = q.correctAnswer;
            const isCorrect = ans?.isCorrect;

            return (
              <DarkCard key={q._id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrect ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <ContentBlockDisplay content={q.content} />
                  </div>
                </div>

                <div className="space-y-1.5 pl-9">
                  {q.options.map((opt: any, optIdx: number) => {
                    const isSelected = String(optIdx) === selectedIdx;
                    const isRightAnswer = String(optIdx) === correctIdx;
                    let style = "border-white/[0.06] text-white/50";
                    if (isRightAnswer) style = "border-green-500/40 bg-green-500/8 text-green-300";
                    else if (isSelected && !isCorrect) style = "border-red-500/40 bg-red-500/8 text-red-300";

                    return (
                      <div key={optIdx} className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 ${style}`}>
                        {isRightAnswer && <CheckCircle className="h-3 w-3 shrink-0 text-green-400" />}
                        {isSelected && !isCorrect && <XCircle className="h-3 w-3 shrink-0 text-red-400" />}
                        <ContentBlockDisplay content={opt} />
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="pl-9 pt-1 border-t border-white/[0.04]">
                    <p className="text-[11px] text-white/30 font-semibold mb-1">Explanation</p>
                    <ContentBlockDisplay content={q.explanation} />
                  </div>
                )}
              </DarkCard>
            );
          })}
        </div>
      )}

      <OutlineBtn className="w-full justify-center py-2.5" onClick={onViewSummary}>
        View Summary
      </OutlineBtn>
    </div>
  );
}

function getMotivationalMessage(percentage: number) {
  if (percentage >= 90) return { emoji: "🎉", title: "Outstanding!", message: "You're mastering this topic. Keep up the excellent work!", level: "outstanding" };
  if (percentage >= 75) return { emoji: "👏", title: "Great Job!", message: "You're very close to perfection.", level: "great" };
  if (percentage >= 60) return { emoji: "👍", title: "Good Effort!", message: "Review a few concepts and you'll improve quickly.", level: "good" };
  if (percentage >= 40) return { emoji: "💪", title: "Keep Practicing!", message: "You're making progress, and another attempt will help.", level: "keep_practicing" };
  return { emoji: "📚", title: "Don't Give Up!", message: "Review the lessons and try again—you've got this.", level: "keep_learning" };
}
