// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QuizPlayer } from "./QuizPlayer";

// Simulates a quiz with shuffleOptions ON: the server returns options in
// shuffled order (cccc first), exactly like the reported quiz-1 case.
const { submitMock } = vi.hoisted(() => ({
  submitMock: vi.fn(() => ({
    unwrap: async () => ({ _id: "att1", status: "completed" }),
  })),
}));

const shuffledQuestions = [
  { _id: "q1", content: { type: "text", text: "Q1?" }, options: [{ type: "text", text: "cccc" }, { type: "text", text: "aaaa" }, { type: "text", text: "bbbb" }, { type: "text", text: "dddd" }], marks: 1, orderIndex: 0 },
  { _id: "q2", content: { type: "text", text: "Q2?" }, options: [{ type: "text", text: "cccc" }, { type: "text", text: "aaaa" }, { type: "text", text: "bbbb" }, { type: "text", text: "dddd" }], marks: 1, orderIndex: 1 },
  { _id: "q3", content: { type: "text", text: "Q3?" }, options: [{ type: "text", text: "cccc" }, { type: "text", text: "aaaa" }, { type: "text", text: "bbbb" }, { type: "text", text: "dddd" }], marks: 1, orderIndex: 2 },
];

vi.mock("@/redux/api/attemptApi", () => ({
  useGetQuizInfoQuery: () => ({
    data: {
      data: {
        _id: "quiz1",
        title: "Sample Quiz",
        totalQuestions: 3,
        totalMarks: 3,
        passingPercentage: 50,
        maxAttempts: 0,
      },
    },
    isLoading: false,
  }),
  useGetUserAttemptsQuery: () => ({ data: { data: [] } }),
  useStartAttemptMutation: () => [
    () => ({
      unwrap: async () => ({
        data: {
          attempt: { _id: "att1", attemptNumber: 1, quizId: "quiz1", startedAt: "", status: "in_progress" },
          questions: shuffledQuestions,
          quiz: { _id: "quiz1", title: "Sample Quiz", totalMarks: 3 },
        },
      }),
    }),
    { isLoading: false },
  ],
  useSubmitAttemptMutation: () => [submitMock, { isLoading: false }],
  useGetAttemptResultQuery: () => ({ data: undefined, isLoading: false }),
}));

vi.mock("@/redux/api/enrollmentApi", () => ({
  useGetEnrollmentsQuery: () => ({
    data: { data: [{ _id: "enr1", batchId: { courseId: "c1" } }] },
  }),
}));

const renderPlayer = () =>
  render(<QuizPlayer quizId="quiz1" courseId="c1" onComplete={() => {}} onBack={() => {}} />);

const startQuiz = async () => {
  renderPlayer();
  fireEvent.click(await screen.findByRole("button", { name: /start quiz/i }));
  await screen.findByText("Question 1 of 3");
};

const goNext = async (n: number) => {
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  await screen.findByText(`Question ${n} of 3`);
};

const submittedAnswers = () => {
  const call = (submitMock.mock.calls[0] as unknown as [{ data: { answers: { questionId: string; selectedAnswer: string }[] } }] | undefined);
  if (!call) throw new Error("submit was not called");
  return call[0].data.answers;
};

describe("QuizPlayer recording under shuffled options", () => {
  beforeEach(() => submitMock.mockClear());

  it("records the tapped TEXT (A,A,C) not the row position", async () => {
    await startQuiz();
    // Tap by visible text: aaaa, aaaa, cccc — even though cccc is the top row.
    fireEvent.click(screen.getByRole("button", { name: "aaaa" }));
    await goNext(2);
    fireEvent.click(screen.getByRole("button", { name: "aaaa" }));
    await goNext(3);
    fireEvent.click(screen.getByRole("button", { name: "cccc" }));

    const submit = await screen.findByRole("button", { name: /submit/i });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));
    expect(submittedAnswers()).toEqual([
      { questionId: "q1", selectedAnswer: "aaaa" },
      { questionId: "q2", selectedAnswer: "aaaa" },
      { questionId: "q3", selectedAnswer: "cccc" },
    ]);
  });

  it("tapping the top row records cccc when shuffle put cccc on top (position != value)", async () => {
    await startQuiz();
    // Tap the FIRST option row on each question without reading the text.
    const TEXTS = ["aaaa", "bbbb", "cccc", "dddd"];
    const tapTopRow = () => {
      const top = screen
        .getAllByRole("button")
        .find((b) => TEXTS.some((t) => b.textContent?.includes(t)));
      fireEvent.click(top!);
    };
    tapTopRow();
    await goNext(2);
    tapTopRow();
    await goNext(3);
    tapTopRow();

    const submit = await screen.findByRole("button", { name: /submit/i });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));
    // All three top rows display cccc after the shuffle — that is what is
    // faithfully recorded, even though the tapper hit "row A" every time.
    expect(submittedAnswers().map((a) => a.selectedAnswer)).toEqual(["cccc", "cccc", "cccc"]);
  });
});
