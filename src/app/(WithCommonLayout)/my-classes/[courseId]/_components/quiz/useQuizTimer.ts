"use client";

import { useState, useEffect, useRef } from "react";

interface QuizTimerState {
  timeRemaining: number | null;
  deadline: number | null;
  timerActive: boolean;
  formatTime: (seconds: number) => string;
  startTimer: (duration?: number | null) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  cleanup: () => void;
}

export function useQuizTimer(duration?: number | null): QuizTimerState {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pausedDurationRef = useRef<number>(0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startTimer = (duration?: number | null) => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!duration) {
      setTimeRemaining(null);
      setTimerActive(false);
      return;
    }
    const totalMs = duration * 60_000;
    const now = Date.now();
    const newDeadline = now + totalMs;
    setDeadline(newDeadline);
    startedAtRef.current = new Date();
    pausedAtRef.current = null;
    pausedDurationRef.current = 0;
    setTimeRemaining(Math.max(0, totalMs / 1000));
    setTimerActive(true);
  };

  const pauseTimer = () => {
    if (timerActive && timerRef.current !== null && deadline) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerActive(false);
      pausedAtRef.current = Date.now();
      if (startedAtRef.current && deadline) {
        const elapsed = pausedAtRef.current - startedAtRef.current.getTime();
        pausedDurationRef.current = elapsed / 1000;
      }
    }
  };

  const resumeTimer = () => {
    if (!timerActive && deadline && startedAtRef.current) {
      const now = Date.now();
      const remaining = Math.max(0, (deadline - now) / 1000);
      setTimeRemaining(remaining);
      setTimerActive(true);
      const interval = () => {
        if (!timerActive || deadline === null) return;
        const now = Date.now();
        const next = Math.max(0, (deadline - now) / 1000);
        setTimeRemaining(next);
        if (next <= 0) {
          setTimerActive(false);
          setTimeRemaining(0);
        }
      };
      timerRef.current = window.setInterval(interval, 500);
    }
  };

  const resetTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
    setDeadline(null);
    setTimeRemaining(null);
    startedAtRef.current = null;
    pausedAtRef.current = null;
    pausedDurationRef.current = 0;
  };

  const cleanup = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  };

  useEffect(() => {
    if (duration && duration > 0 && timerActive && deadline && startedAtRef.current) {
      const interval = () => {
        if (!timerActive || deadline === null) return;
        const now = Date.now();
        const next = Math.max(0, (deadline - now) / 1000);
        setTimeRemaining(next);
        if (next <= 0) {
          setTimerActive(false);
          setTimeRemaining(0);
        }
      };
      timerRef.current = window.setInterval(interval, 500);
      return () => {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [timerActive, deadline, duration]);

  useEffect(() => {
    return cleanup;
  }, []);

  return {
    timeRemaining,
    deadline,
    timerActive,
    formatTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    cleanup,
  };
}
