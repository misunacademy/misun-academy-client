"use client";

interface QuizStatChipsProps {
  earnedMarks: number;
  totalMarks: number;
  percentage: number;
  zamesEarned: number;
  className?: string;
}

export function QuizStatChips({ earnedMarks, totalMarks, percentage, zamesEarned, className = "" }: QuizStatChipsProps) {
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-center">
        <p className="text-lg font-bold text-white">{earnedMarks}/{totalMarks}</p>
        <p className="text-[10px] text-white/40">Score</p>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-center">
        <p className="text-lg font-bold text-white">{(percentage ?? 0).toFixed(0)}%</p>
        <p className="text-[10px] text-white/40">Percentage</p>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-center">
        <p className="text-lg font-bold text-yellow-400">+{zamesEarned}</p>
        <p className="text-[10px] text-white/40">Zames</p>
      </div>
    </div>
  );
}