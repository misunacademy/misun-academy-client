import { describe, it, expect } from "vitest";
import {
  isLessonCompleted,
  isLessonUnlocked,
  isQuizCompleted,
  isQuizUnlocked,
  type CompletedLesson,
  type CompletedQuiz,
  type LockableModule,
} from "@/lib/curriculum-locks";

const curriculum: LockableModule[] = [
  { moduleId: "m1", lessons: [{ lessonId: "m1-l1" }], quizzes: [] },
  {
    moduleId: "m2",
    lessons: [{ lessonId: "m2-l1" }, { lessonId: "m2-l2" }],
    quizzes: [{ quizId: "m2-q1" }, { quizId: "m2-q2" }],
  },
  { moduleId: "m3", lessons: [{ lessonId: "m3-l1" }] },
];

const done = (moduleId: string, lessonId: string): CompletedLesson => ({ moduleId, lessonId });
const qdone = (moduleId: string, quizId: string): CompletedQuiz => ({ moduleId, quizId });

describe("isLessonCompleted / isQuizCompleted", () => {
  it("matches on module + lesson/quiz id pairs", () => {
    expect(isLessonCompleted([done("m1", "m1-l1")], "m1", "m1-l1")).toBe(true);
    expect(isLessonCompleted([done("m1", "m1-l1")], "m1", "other")).toBe(false);
    expect(isLessonCompleted([done("m1", "m1-l1")], "other", "m1-l1")).toBe(false);
    expect(isLessonCompleted(undefined, "m1", "m1-l1")).toBe(false);
    expect(isQuizCompleted([qdone("m2", "m2-q1")], "m2", "m2-q1")).toBe(true);
    expect(isQuizCompleted([qdone("m2", "m2-q1")], "m2", "m2-q2")).toBe(false);
    expect(isQuizCompleted(undefined, "m2", "m2-q1")).toBe(false);
  });
});

describe("isLessonUnlocked", () => {
  it("unlocks the very first lesson with no progress", () => {
    expect(isLessonUnlocked(curriculum, [], [], 0, 0)).toBe(true);
  });

  it("locks later lessons in the same module until earlier ones complete", () => {
    expect(isLessonUnlocked(curriculum, [], [], 1, 1)).toBe(false);
    expect(isLessonUnlocked(curriculum, [done("m1", "m1-l1"), done("m2", "m2-l1")], [], 1, 1)).toBe(true);
  });

  it("locks a module until every lesson AND quiz of previous modules complete", () => {
    const lessonsOnly: CompletedLesson[] = [done("m1", "m1-l1"), done("m2", "m2-l1"), done("m2", "m2-l2")];
    // m2 quizzes still open -> m3 stays locked
    expect(isLessonUnlocked(curriculum, lessonsOnly, [], 2, 0)).toBe(false);

    const quizzes: CompletedQuiz[] = [qdone("m2", "m2-q1"), qdone("m2", "m2-q2")];
    expect(isLessonUnlocked(curriculum, lessonsOnly, quizzes, 2, 0)).toBe(true);
  });

  it("returns false for out-of-range modules", () => {
    expect(isLessonUnlocked(curriculum, [], [], 9, 0)).toBe(false);
    expect(isLessonUnlocked([], [], [], 0, 0)).toBe(false);
  });
});

describe("isQuizUnlocked", () => {
  it("requires all module lessons before the first quiz", () => {
    expect(isQuizUnlocked(curriculum, [done("m1", "m1-l1")], [], 1, 0)).toBe(false);
    expect(
      isQuizUnlocked(curriculum, [done("m1", "m1-l1"), done("m2", "m2-l1"), done("m2", "m2-l2")], [], 1, 0)
    ).toBe(true);
  });

  it("requires earlier quizzes in the same module", () => {
    const lessons = [done("m1", "m1-l1"), done("m2", "m2-l1"), done("m2", "m2-l2")];
    expect(isQuizUnlocked(curriculum, lessons, [], 1, 1)).toBe(false);
    expect(isQuizUnlocked(curriculum, lessons, [qdone("m2", "m2-q1")], 1, 1)).toBe(true);
  });

  it("locks quizzes behind incomplete previous modules", () => {
    expect(isQuizUnlocked(curriculum, [], [], 1, 0)).toBe(false);
  });
});
