// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuestionCard } from "./QuestionCard";
import type { IQuestionPlay } from "@/types/quiz";

const baseQuestion = {
  _id: "q1",
  marks: 1,
  orderIndex: 0,
} as IQuestionPlay;

describe("QuestionCard answer values", () => {
  it("submits the option text (the value scoring compares against)", () => {
    const onSelect = vi.fn();
    render(
      <QuestionCard
        question={{
          ...baseQuestion,
          content: { type: "text", text: "Q?" },
          options: [
            { type: "text", text: "3" },
            { type: "text", text: "4" },
          ],
        }}
        index={0}
        selectedAnswer={null}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    expect(onSelect).toHaveBeenCalledWith("4");
  });

  it("falls back to option-<index> for textless options", () => {
    const onSelect = vi.fn();
    render(
      <QuestionCard
        question={{
          ...baseQuestion,
          content: { type: "text", text: "Q?" },
          options: [{ type: "image", imageUrl: "https://img/x.png", altText: "" }],
        }}
        index={0}
        selectedAnswer={null}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onSelect).toHaveBeenCalledWith("option-0");
  });
});
