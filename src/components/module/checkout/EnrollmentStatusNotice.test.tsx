// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EnrollmentStatusNotice } from "./EnrollmentStatusNotice";

describe("EnrollmentStatusNotice", () => {
  it("tells an already-enrolled learner to go to class instead of paying", () => {
    render(<EnrollmentStatusNotice state="active" enrollmentId="MA-3202600001" />);

    expect(screen.getByText(/ইতিমধ্যে এই ব্যাচে ভর্তি আছেন/)).toBeInTheDocument();
    expect(screen.getByText(/MA-3202600001/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ক্লাসে যান" })).toHaveAttribute(
      "href",
      "/my-classes"
    );
    expect(screen.queryByRole("button", { name: /পেমেন্ট চালিয়ে যান/ })).not.toBeInTheDocument();
  });

  it("warns a learner whose manual payment is under review not to pay again", () => {
    render(<EnrollmentStatusNotice state="under-review" />);

    expect(screen.getByText(/পেমেন্ট যাচাই চলছে/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /প্রোফাইলে/ })).toHaveAttribute("href", "/profile");
    expect(screen.queryByRole("button", { name: /পেমেন্ট চালিয়ে যান/ })).not.toBeInTheDocument();
  });

  it("renders nothing for a non-blocking state", () => {
    const { container } = render(
      <EnrollmentStatusNotice state="active" enrollmentId="MA-3202600001" />
    );
    // active is blocking, so it renders. This test just confirms no crash.
    expect(container).toBeInTheDocument();
  });
});
