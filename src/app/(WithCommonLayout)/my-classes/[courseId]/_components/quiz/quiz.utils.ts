"use client";

export type MotivationalMessage = {
  emoji: string;
  title: string;
  message: string;
  level: string;
};

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${m}m ${sec}s`;
}

export function getMotivationalMessage(percentage: number): MotivationalMessage | null {
  if (percentage >= 90) return { emoji: "🎉", title: "Outstanding!", message: "You\'re mastering this topic. Keep up the excellent work!", level: "outstanding" };
  if (percentage >= 75) return { emoji: "👏", title: "Great Job!", message: "You\'re very close to perfection.", level: "great" };
  if (percentage >= 60) return { emoji: "👍", title: "Good Effort!", message: "Review a few concepts and you\'ll improve quickly.", level: "good" };
  if (percentage >= 40) return { emoji: "💪", title: "Keep Practicing!", message: "You\'re making progress, and another attempt will help.", level: "keep_practicing" };
  return { emoji: "📚", title: "Don\'t Give Up!", message: "Review the lessons and try again—you\'ve got this.", level: "keep_learning" };
}