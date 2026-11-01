import { describe, it, expect } from "vitest";
import { buildQuestionPayload, questionToFormState } from "@/components/quiz/QuestionForm";
import { QuestionType } from "@/types/enums";
import type { IQuestion } from "@/types/quiz";

const mcq: IQuestion = {
  _id: "q1",
  quizId: "quiz1",
  questionType: QuestionType.MCQ,
  content: { type: "text", text: "What is 2+2?" },
  options: [
    { type: "text", text: "3" },
    { type: "text", text: "4" },
  ],
  correctAnswer: "4",
  explanation: { type: "text", text: "Basic math" },
  marks: 2,
  zamesPoints: 5,
  orderIndex: 0,
};

describe("questionToFormState", () => {
  it("returns blank MCQ defaults for nullish input", () => {
    const state = questionToFormState(null);
    expect(state).toMatchObject({
      questionType: QuestionType.MCQ,
      contentType: "text",
      questionText: "",
      marks: 1,
      zamesPoints: 1,
      correctAnswer: "",
    });
    expect(state.options).toHaveLength(2);
  });

  it("maps a full question into editable state", () => {
    const state = questionToFormState(mcq);
    expect(state).toMatchObject({
      questionType: QuestionType.MCQ,
      contentType: "text",
      questionText: "What is 2+2?",
      explanationText: "Basic math",
      marks: 2,
      zamesPoints: 5,
      correctAnswer: "4",
    });
    expect(state.options.map((o) => o.text)).toEqual(["3", "4"]);
  });

  it("falls back to empty options when the question has none", () => {
    const state = questionToFormState({ ...mcq, options: [] });
    expect(state.options).toHaveLength(2);
  });

  it("copies defaults so callers cannot mutate shared state", () => {
    const a = questionToFormState(null);
    a.options[0].text = "mutated";
    expect(questionToFormState(null).options[0].text).toBe("");
  });
});

describe("buildQuestionPayload", () => {
  it("builds a text question payload", () => {
    const payload = buildQuestionPayload(questionToFormState(mcq));
    expect(payload).toMatchObject({
      questionType: QuestionType.MCQ,
      content: { type: "text", text: "What is 2+2?" },
      correctAnswer: "4",
      marks: 2,
      zamesPoints: 5,
    });
    expect(payload.options).toEqual([
      { type: "text", text: "3" },
      { type: "text", text: "4" },
    ]);
    expect(payload.explanation).toEqual({ type: "text", text: "Basic math" });
  });

  it("omits explanation when empty and maps image content", () => {
    const state = questionToFormState(mcq);
    const payload = buildQuestionPayload({
      ...state,
      contentType: "image",
      questionImage: "https://img/x.png",
      explanationText: "",
    });
    expect(payload.content).toEqual({ type: "image", imageUrl: "https://img/x.png", altText: "" });
    expect(payload.explanation).toBeUndefined();
  });

  it("maps text_image content and image options", () => {
    const state = questionToFormState(mcq);
    const payload = buildQuestionPayload({
      ...state,
      contentType: "text_image",
      questionImage: "https://img/x.png",
      options: [{ type: "image", text: "", imageUrl: "https://img/o.png", altText: "alt" }],
    });
    expect(payload.content).toMatchObject({ type: "text_image", text: "What is 2+2?" });
    expect(payload.options).toEqual([{ type: "image", imageUrl: "https://img/o.png", altText: "alt" }]);
  });
});
