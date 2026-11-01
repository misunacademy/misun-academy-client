// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QuizPlayer } from "./QuizPlayer";

const { submitMock } = vi.hoisted(() => ({
  // RTK triggers return { unwrap } synchronously (not a promise of it).
  submitMock: vi.fn(() => ({
    unwrap: async () => ({ _id: "att1", status: "completed" }),
  })),
}));

vi.mock("@/redux/api/attemptApi", () => ({
  useGetQuizInfoQuery: () => ({
    data: {
      data: {
        _id: "quiz1",
        title: "Sample Quiz",
        totalQuestions: 2,
        totalMarks: 2,
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
          questions: [
            { _id: "q1", content: { type: "text", text: "Q1?" }, options: [{ type: "text", text: "A" }, { type: "text", text: "B" }], marks: 1, orderIndex: 0 },
            { _id: "q2", content: { type: "text", text: "Q2?" }, options: [{ type: "text", text: "C" }, { type: "text", text: "D" }], marks: 1, orderIndex: 1 },
          ],
          quiz: { _id: "quiz1", title: "Sample Quiz", totalMarks: 2 },
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
  await screen.findByText("Question 1 of 2");
};

const answerCurrent = (label: string) => {
  fireEvent.click(screen.getByRole("button", { name: label }));
};

describe("QuizPlayer submit guards", () => {
  beforeEach(() => submitMock.mockClear());

  it("disables Submit until every question is answered", async () => {
    await startQuiz();
    answerCurrent("A");
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Question 2 of 2");

    const submit = screen.getByRole("button", { name: /submit/i });
    expect(submit).toBeDisabled();

    answerCurrent("D");
    await waitFor(() => expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled());
  });

  it("blocks dot-jumps to unanswered questions but allows answered ones", async () => {
    await startQuiz();
    answerCurrent("A");

    const dots = screen.getAllByRole("button", { name: /go to question/i });
    expect(dots).toHaveLength(2);
    expect(dots[1]).toBeDisabled();

    fireEvent.click(dots[1]);
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Question 2 of 2");
    answerCurrent("C");

    fireEvent.click(screen.getAllByRole("button", { name: /go to question/i })[0]);
    await screen.findByText("Question 1 of 2");
  });

  it("submits exactly once on double-click", async () => {
    await startQuiz();
    answerCurrent("A");
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Question 2 of 2");
    answerCurrent("C");

    const submit = await screen.findByRole("button", { name: /submit/i });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);
    fireEvent.click(submit);

    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));
  });
});
