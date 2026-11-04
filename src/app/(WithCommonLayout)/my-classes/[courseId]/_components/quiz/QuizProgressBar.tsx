"use client";

interface QuizProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  className?: string;
}

export function QuizProgressBar({ currentIndex, totalQuestions, answeredCount, className = "" }: QuizProgressBarProps) {
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className={`mb-5 space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="text-white/40">{answeredCount} of {totalQuestions} answered</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}