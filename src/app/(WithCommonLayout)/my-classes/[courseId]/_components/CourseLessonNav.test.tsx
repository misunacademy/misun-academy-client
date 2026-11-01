// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseLessonNav from "./CourseLessonNav";

describe("CourseLessonNav", () => {
  it("renders the lesson label", () => {
    render(
      <CourseLessonNav onPrev={() => {}} onNext={() => {}} canGoPrev canGoNext lessonLabel="Lesson 2 / 5" />
    );
    expect(screen.getByText("Lesson 2 / 5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("disables Previous on the first lesson and Next on the last", () => {
    render(
      <CourseLessonNav
        onPrev={() => {}}
        onNext={() => {}}
        canGoPrev={false}
        canGoNext={false}
        lessonLabel="Lesson 1 / 1"
      />
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("fires onPrev/onNext when enabled and ignores clicks when disabled", () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const { rerender } = render(
      <CourseLessonNav onPrev={onPrev} onNext={onNext} canGoPrev canGoNext lessonLabel="Lesson 1 / 3" />
    );

    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);

    rerender(
      <CourseLessonNav onPrev={onPrev} onNext={onNext} canGoPrev={false} canGoNext={false} lessonLabel="Lesson 1 / 3" />
    );
    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
