"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useGetQuizInfoQuery,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
  useGetUserAttemptsQuery,
} from "@/redux/api/attemptApi";
import { useGetEnrollmentsQuery, EnrollmentResponse } from "@/redux/api/enrollmentApi";
import type { IQuiz, IQuizAttempt, IQuestionPlay, QuizAttemptStart } from "@/types/quiz";
import { extractApiData, getApiErrorMessage } from "@/lib/api-helpers";

interface UseQuizAttemptReturn {
  phase: Phase;
  questions: IQuestionPlay[];
  currentIndex: number;
  answers: Record<string, string | null>;
  attemptId: string | null;
  timeRemaining: number | null;
  error: string | null;
  reviewAttemptId: string | null;
  leaveQuizPending: boolean;
  infoLoading: boolean;
  attemptsLoading: boolean;
  attemptsFetching: boolean;
  starting: boolean;
  submitting: boolean;
  quizInfo: IQuiz | undefined;
  attempts: IQuizAttempt[];
  completedAttempts: IQuizAttempt[];
  lastAttempt: IQuizAttempt | undefined;
  hasPreviousAttempts: boolean;
  maxAttempts: number;
  remainingAttempts: number;
  canReAttempt: boolean;
  timerRef: React.RefObject<number | null>;
  startedAtRef: React.RefObject<Date | null>;
  submittingRef: React.RefObject<boolean>;
  startingRef: React.RefObject<boolean>;
  autoSubmitTriggered: React.RefObject<boolean>;
  autoSubmitRetries: React.RefObject<number>;
  autoSubmitBackoffTimer: React.RefObject<number | null>;
  deadlineRef: React.RefObject<number | null>;
  setPhase: (phase: Phase) => void;
  setQuestions: (questions: IQuestionPlay[]) => void;
  setCurrentIndex: (index: number) => void;
  setAnswers: (answers: Record<string, string | null>) => void;
  setAttemptId: (id: string | null) => void;
  setTimeRemaining: (time: number | null) => void;
  setError: (error: string | null) => void;
  setReviewAttemptId: (id: string | null) => void;
  setLeaveQuizPending: (pending: boolean) => void;
  startAttempt: () => Promise<void>;
  submitAttempt: () => Promise<void>;
  refetchAttempts: () => void;
  handleStart: () => void;
  handleSelectAnswer: (value: string) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: () => Promise<void>;
  handleViewSummary: () => void;
  handleReviewAnswers: (attemptId: string) => void;
  handleBackToSummary: () => void;
  handleLeaveQuiz: () => void;
  handleConfirmLeaveQuiz: () => void;
  handleCancelLeaveQuiz: () => void;
  currentQuestion: IQuestionPlay | null;
  selectedAnswer: string | null;
  answeredCount: number;
  progress: number;
  isLastQuestion: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  canJumpTo: (idx: number) => boolean;
  allAnswered: boolean;
}

type Phase = "loading" | "start" | "summary" | "active" | "submitting" | "result" | "review";

export function useQuizAttempt(
  quizId: string,
  courseId: string,
  batchId: string,
  enrollmentId: string,
  onComplete: () => void,
  onBack: () => void
): UseQuizAttemptReturn {
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<IQuestionPlay[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);
  const [leaveQuizPending, setLeaveQuizPending] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const submittingRef = useRef(false);
  const startingRef = useRef(false);
  const autoSubmitTriggered = useRef(false);
  const autoSubmitRetries = useRef(0);
  const autoSubmitBackoffTimer = useRef<number | null>(null);
  const deadlineRef = useRef<number | null>(null);

  const {
    data: quizInfoRaw,
    isLoading: infoLoading,
  } = useGetQuizInfoQuery(quizId);
  const {
    data: attemptsRaw,
    isLoading: attemptsLoading,
    isFetching: attemptsFetching,
    refetch: refetchAttempts,
  } = useGetUserAttemptsQuery(quizId);
  const [startAttemptMutation, { isLoading: starting }] = useStartAttemptMutation();
  const [submitAttemptMutation, { isLoading: submitting }] = useSubmitAttemptMutation();
  const { data: enrollments } = useGetEnrollmentsQuery(undefined);

  const quizInfo = extractApiData<IQuiz>(quizInfoRaw);
  const attempts: IQuizAttempt[] = React.useMemo(
    () => extractApiData<IQuizAttempt[]>(attemptsRaw) ?? [],
    [attemptsRaw]
  );
  const completedAttempts = React.useMemo(
    () => attempts.filter((a) => a.status === "completed"),
    [attempts]
  );
  const lastAttempt = completedAttempts[0];
  const hasPreviousAttempts = completedAttempts.length > 0;
  const maxAttempts = quizInfo?.maxAttempts ?? 0;
  const remainingAttempts = maxAttempts > 0 ? maxAttempts - completedAttempts.length : Infinity;
  const canReAttempt = remainingAttempts > 0;

  const enrollment = React.useMemo<EnrollmentResponse | undefined>(() => {
    if (!enrollments?.data) return undefined;
    const list = enrollments.data;
    const matches = (e: EnrollmentResponse) => {
      const courseRef = e.batchId?.courseId;
      const cId = typeof courseRef === "object" && courseRef !== null ? courseRef._id : courseRef;
      const slug = typeof courseRef === "object" && courseRef !== null ? courseRef.slug : undefined;
      return (cId === courseId || slug === courseId) && e.status === "active";
    };
    return list.find(matches) || undefined;
  }, [enrollments, courseId]);
  const enrollmentIdFromBatch = enrollment?._id || enrollmentId || "";

  const handleStart = useCallback(async () => {
    if (!enrollmentIdFromBatch) {
      setError("You are not enrolled in this course.");
      return;
    }
    if (!batchId) {
      setError("No batch found for this enrollment.");
      return;
    }
    if (startingRef.current) return;
    startingRef.current = true;
    setError(null);
    autoSubmitTriggered.current = false;
    try {
      const res = await startAttemptMutation({
        quizId,
        enrollmentId: enrollmentIdFromBatch,
      }).unwrap();
      const data = extractApiData<QuizAttemptStart>(res);
      if (!data?.attempt?._id || !data.questions || !data.quiz) {
        setError("Failed to start quiz");
        return;
      }
      setAttemptId(data.attempt._id);
      setQuestions(data.questions);
      setCurrentIndex(0);
      let restored = {};
      try {
        const saved = sessionStorage.getItem(`quiz_answers_${data.attempt._id}`);
        if (saved) restored = JSON.parse(saved);
      } catch {}
      setAnswers(restored);
      setReviewAttemptId(null);
      startedAtRef.current = new Date(data.attempt.startedAt);
      if (data.quiz.timeLimit) {
        const elapsed = Math.max(
          0,
          Math.floor((Date.now() - new Date(data.attempt.startedAt).getTime()) / 1000)
        );
        setTimeRemaining(Math.max(0, data.quiz.timeLimit * 60 - elapsed));
      } else {
        setTimeRemaining(null);
      }
      setPhase("active");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to start quiz"));
    } finally {
      startingRef.current = false;
    }
  }, [enrollmentIdFromBatch, batchId, startAttemptMutation, quizId]);

  const handleSelectAnswer = useCallback((value: string) => {
    const cq = questions[currentIndex];
    if (!cq) return;
    setAnswers((prev) => {
      const next = { ...prev, [cq._id]: value };
      if (attemptId) {
        try {
          sessionStorage.setItem(`quiz_answers_${attemptId}`, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  }, [questions, currentIndex, attemptId]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submittingRef.current || autoSubmitTriggered.current) return;
    submittingRef.current = true;
    setError(null);
    setPhase("submitting");
    try {
      const timeLimit = quizInfo?.timeLimit || 0;
      const timeTaken =
        timeLimit > 0
          ? Math.round(Math.max(0, timeLimit * 60 - (timeRemaining ?? 0)))
          : undefined;
      await submitAttemptMutation({
        quizId,
        attemptId,
        data: {
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId: String(questionId),
            selectedAnswer: selectedAnswer === null ? null : String(selectedAnswer),
          })),
          ...(timeTaken !== undefined ? { timeTaken } : {}),
        },
      }).unwrap();
      autoSubmitTriggered.current = true;
      autoSubmitRetries.current = 0;
      await refetchAttempts();
      setPhase("result");
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to submit quiz");
      const isExpired =
        typeof msg === "string" &&
        (msg.toLowerCase().includes("expired") ||
          msg.toLowerCase().includes("already been submitted"));
      if (isExpired) {
        autoSubmitTriggered.current = true;
        setError(msg);
        await refetchAttempts();
        setPhase("summary");
      } else {
        setError(msg);
        setPhase("active");
        if (autoSubmitRetries.current < 3) {
          autoSubmitRetries.current += 1;
          const delay = Math.min(8000, 2000 * Math.pow(2, autoSubmitRetries.current - 1));
          if (autoSubmitBackoffTimer.current !== null)
            clearTimeout(autoSubmitBackoffTimer.current);
          autoSubmitBackoffTimer.current = window.setTimeout(() => {
            autoSubmitBackoffTimer.current = null;
            if (
              phase === "active" &&
              !autoSubmitTriggered.current &&
              !submittingRef.current
            ) {
              handleSubmit();
            }
          }, delay);
        }
      }
    } finally {
      submittingRef.current = false;
    }
  }, [attemptId, answers, quizInfo, quizId, submitAttemptMutation, timeRemaining, refetchAttempts, phase]);

  const handleViewSummary = useCallback(() => {
    setPhase("summary");
  }, []);

  const handleReviewAnswers = useCallback((attemptId: string) => {
    setReviewAttemptId(attemptId);
    setPhase("review");
  }, []);

  const handleBackToSummary = useCallback(() => {
    setReviewAttemptId(null);
    setPhase("summary");
  }, []);

  const handleLeaveQuiz = useCallback(() => {
    if (phase === "active") {
      setLeaveQuizPending(true);
    } else {
      onBack();
    }
  }, [phase, onBack]);

  const handleConfirmLeaveQuiz = useCallback(() => {
    setLeaveQuizPending(false);
    onBack();
  }, [onBack]);

  const handleCancelLeaveQuiz = useCallback(() => {
    setLeaveQuizPending(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    if (infoLoading || attemptsLoading || attemptsFetching) return;
    if (!quizInfo) return;
    const determinedPhase: Phase = hasPreviousAttempts ? "summary" : "start";
    setPhase(determinedPhase);
  }, [infoLoading, attemptsLoading, attemptsFetching, quizInfo, hasPreviousAttempts, phase]);

  const timerActive = phase === "active" && timeRemaining !== null && timeRemaining > 0;

  useEffect(() => {
    if (!timerActive) return;
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (startedAtRef.current && quizInfo?.timeLimit) {
      deadlineRef.current = startedAtRef.current.getTime() + quizInfo.timeLimit * 60_000;
    } else {
      deadlineRef.current = null;
    }
    let remaining = Math.max(0, (quizInfo?.timeLimit ?? 0) * 60);
    if (deadlineRef.current !== null) {
      remaining = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
    }
    setTimeRemaining(remaining);
    timerRef.current = window.setInterval(() => {
      const ts = Date.now();
      if (deadlineRef.current === null) return;
      const next = Math.max(0, (deadlineRef.current - ts) / 1000);
      setTimeRemaining(next);
      if (next <= 0 && timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 500);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive, quizInfo?.timeLimit]);

  useEffect(() => {
    const onVis = () => {
      if (!document.hidden && timerActive && deadlineRef.current !== null) {
        setTimeRemaining(Math.max(0, (deadlineRef.current! - Date.now()) / 1000));
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [timerActive]);

  useEffect(() => {
    if (timeRemaining !== 0 || phase !== "active" || autoSubmitTriggered.current || submittingRef.current)
      return;
    autoSubmitTriggered.current = true;
    handleSubmit();
  }, [timeRemaining, phase, handleSubmit]);

  useEffect(() => {
    if (phase !== "result") return;
    const id = setTimeout(() => setPhase("summary"), 1000);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (phase === "active" && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase, answers]);

  useEffect(() => {
    return () => {
      setReviewAttemptId(null);
    };
  }, []);

  const currentQuestion = questions[currentIndex] || null;
  const selectedAnswer = currentQuestion ? answers[currentQuestion._id] ?? null : null;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const isLastQuestion = currentIndex === questions.length - 1;
  const canGoNext = selectedAnswer !== null;
  const canGoPrev = currentIndex > 0;
  const canJumpTo = (idx: number) =>
    idx === currentIndex || answers[questions[idx]?._id] !== undefined;
  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q._id] !== undefined && answers[q._id] !== null);

  const startAttempt = async () => {
    try {
      const res = await startAttemptMutation({
        quizId,
        enrollmentId: enrollmentIdFromBatch,
      }).unwrap();
      const data = extractApiData<QuizAttemptStart>(res);
      if (!data?.attempt?._id || !data.questions || !data.quiz) {
        setError("Failed to start quiz");
        return;
      }
      setAttemptId(data.attempt._id);
      setQuestions(data.questions);
      setCurrentIndex(0);
      let restored = {};
      try {
        const saved = sessionStorage.getItem(`quiz_answers_${data.attempt._id}`);
        if (saved) restored = JSON.parse(saved);
      } catch {}
      setAnswers(restored);
      setReviewAttemptId(null);
      startedAtRef.current = new Date(data.attempt.startedAt);
      if (data.quiz.timeLimit) {
        const elapsed = Math.max(
          0,
          Math.floor((Date.now() - new Date(data.attempt.startedAt).getTime()) / 1000)
        );
        setTimeRemaining(Math.max(0, data.quiz.timeLimit * 60 - elapsed));
      } else {
        setTimeRemaining(null);
      }
      setPhase("active");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to start quiz"));
    }
  };

  const submitAttempt = async () => {
    if (!attemptId) return;
    try {
      const timeLimit = quizInfo?.timeLimit || 0;
      const timeTaken =
        timeLimit > 0
          ? Math.round(Math.max(0, timeLimit * 60 - (timeRemaining ?? 0)))
          : undefined;
      await submitAttemptMutation({
        quizId,
        attemptId,
        data: {
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId: String(questionId),
            selectedAnswer: selectedAnswer === null ? null : String(selectedAnswer),
          })),
          ...(timeTaken !== undefined ? { timeTaken } : {}),
        },
      }).unwrap();
      autoSubmitTriggered.current = true;
      autoSubmitRetries.current = 0;
      await refetchAttempts();
      setPhase("result");
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to submit quiz");
      const isExpired =
        typeof msg === "string" &&
        (msg.toLowerCase().includes("expired") ||
          msg.toLowerCase().includes("already been submitted"));
      if (isExpired) {
        autoSubmitTriggered.current = true;
        setError(msg);
        await refetchAttempts();
        setPhase("summary");
      } else {
        setError(msg);
        setPhase("active");
      }
    }
  };

  return {
    phase,
    questions,
    currentIndex,
    answers,
    attemptId,
    timeRemaining,
    error,
    reviewAttemptId,
    leaveQuizPending,
    infoLoading,
    attemptsLoading,
    attemptsFetching,
    starting,
    submitting,
    quizInfo,
    attempts,
    completedAttempts,
    lastAttempt,
    hasPreviousAttempts,
    maxAttempts,
    remainingAttempts,
    canReAttempt,
    timerRef,
    startedAtRef,
    submittingRef,
    startingRef,
    autoSubmitTriggered,
    autoSubmitRetries,
    autoSubmitBackoffTimer,
    deadlineRef,
    setPhase,
    setQuestions,
    setCurrentIndex,
    setAnswers,
    setAttemptId,
    setTimeRemaining,
    setError,
    setReviewAttemptId,
    setLeaveQuizPending,
    startAttempt,
    submitAttempt,
    refetchAttempts,
    handleStart,
    handleSelectAnswer,
    handleNext,
    handlePrev,
    handleSubmit,
    handleViewSummary,
    handleReviewAnswers,
    handleBackToSummary,
    handleLeaveQuiz,
    handleConfirmLeaveQuiz,
    handleCancelLeaveQuiz,
    currentQuestion,
    selectedAnswer,
    answeredCount,
    progress,
    isLastQuestion,
    canGoNext,
    canGoPrev,
    canJumpTo,
    allAnswered,
  };
}
