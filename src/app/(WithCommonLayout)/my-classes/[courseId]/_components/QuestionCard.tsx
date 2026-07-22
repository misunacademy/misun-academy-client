"use client";

import { Check } from "lucide-react";
import { ContentBlockDisplay } from "@/components/quiz/ContentBlockDisplay";
import type { IQuestionPlay } from "@/types/quiz";

interface QuestionCardProps {
  question: IQuestionPlay;
  index: number;
  selectedAnswer: string | null;
  onSelect: (value: string) => void;
}

export function QuestionCard({ question, index, selectedAnswer, onSelect }: QuestionCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <span className="shrink-0 w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-sm font-bold text-primary">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0 pt-1">
          <ContentBlockDisplay content={question.content} className="text-white/90" />
        </div>
        <span className="shrink-0 text-xs text-white/30">{question.marks} mark{question.marks !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt, optIdx) => {
          const value = String(optIdx);
          const isSelected = selectedAnswer === value;
          return (
            <button
              key={optIdx}
              onClick={() => onSelect(value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 group
                ${isSelected
                  ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_12px_hsl(156_70%_42%/0.12)]"
                  : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-white/80"}`}
            >
              <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${isSelected ? "border-primary bg-primary" : "border-white/20 group-hover:border-white/40"}`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <ContentBlockDisplay content={opt} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
