"use client";

import { CheckCircle, XCircle } from "lucide-react";
import DarkCard from "../DarkCard";
import { ContentBlockDisplay } from "@/components/quiz/ContentBlockDisplay";
import type { IQuestionReview, IQuizAnswer, IContentBlock } from "@/types/quiz";

interface AnswerReviewListProps {
  questions: IQuestionReview[];
  answers: IQuizAnswer[];
  className?: string;
}

export function AnswerReviewList({ questions, answers, className = "" }: AnswerReviewListProps) {
  const answerMap = new Map((answers || []).map((a: IQuizAnswer) => [a.questionId, a]));

  return (
    <div className={`space-y-4 ${className}`}>
      {questions.map((q: IQuestionReview, idx: number) => {
        const ans = answerMap.get(q._id);
        const selectedValue = ans?.selectedAnswer;
        const correctValue = q.correctAnswer;
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
              {q.options.map((opt: IContentBlock, optIdx: number) => {
                const optionValue = opt.text || `option-${optIdx}`;
                const isSelected = optionValue === selectedValue;
                const isRightAnswer = optionValue === correctValue;
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
  );
}