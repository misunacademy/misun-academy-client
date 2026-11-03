import { describe, it, expect } from "vitest";
import { resolveCheckoutEnrollmentState } from "@/lib/enrollment-checkout";

const batchId = "batch-1";
const courseId = "course-1";

const enrollment = (
  status: string,
  overrides: Record<string, unknown> = {}
) => ({
  _id: `enr-${status}-${Math.random()}`,
  status,
  batchId: { _id: batchId, courseId: { _id: courseId } },
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("resolveCheckoutEnrollmentState", () => {
  it("returns none when the learner has no enrollment for the batch", () => {
    const result = resolveCheckoutEnrollmentState(
      [enrollment("active", { batchId: { _id: "other-batch", courseId: { _id: courseId } } })],
      { batchId, courseId }
    );

    expect(result.state).toBe("none");
    expect(result.enrollment).toBeNull();
  });

  it("treats an active enrollment as blocking", () => {
    const result = resolveCheckoutEnrollmentState([enrollment("active")], {
      batchId,
      courseId,
    });

    expect(result.state).toBe("active");
  });

  it("treats a completed enrollment as blocking", () => {
    expect(
      resolveCheckoutEnrollmentState([enrollment("completed")], { batchId, courseId }).state
    ).toBe("active");
  });

  it("treats a manual payment in review as under-review", () => {
    expect(
      resolveCheckoutEnrollmentState([enrollment("payment-pending", { latestPaymentStatus: "review" })], {
        batchId,
        courseId,
      }).state
    ).toBe("under-review");
  });

  it("does NOT offer resume for cancelled/failed/expired/pending — checkout starts fresh", () => {
    expect(
      resolveCheckoutEnrollmentState(
        [enrollment("pending")],
        { batchId, courseId }
      ).state
    ).toBe("none");
    // A cancelled payment does not resume — fresh checkout.
    expect(
      resolveCheckoutEnrollmentState(
        [enrollment("pending", { latestPaymentStatus: "cancel" })],
        { batchId, courseId }
      ).state
    ).toBe("none");
    expect(
      resolveCheckoutEnrollmentState([enrollment("payment-failed")], {
        batchId,
        courseId,
      }).state
    ).toBe("none");
    expect(
      resolveCheckoutEnrollmentState([enrollment("expired")], {
        batchId,
        courseId,
      }).state
    ).toBe("none");
  });

  it("treats payment-pending with a cancelled payment as none (fresh tran_id, same enrollment)", () => {
    expect(
      resolveCheckoutEnrollmentState(
        [enrollment("payment-pending", { latestPaymentStatus: "cancel" })],
        { batchId, courseId }
      ).state
    ).toBe("none");
  });

  it("treats payment-pending with a manual payment under review as under-review (blocked)", () => {
    expect(
      resolveCheckoutEnrollmentState(
        [enrollment("payment-pending", { latestPaymentStatus: "review" })],
        { batchId, courseId }
      ).state
    ).toBe("under-review");
  });

  it("treats payment-pending with an expired payment as none (fresh checkout)", () => {
    expect(
      resolveCheckoutEnrollmentState(
        [enrollment("payment-pending", { latestPaymentStatus: "expired" })],
        { batchId, courseId }
      ).state
    ).toBe("none");
  });

  it("prefers the blocking row when several rows exist for the batch", () => {
    const result = resolveCheckoutEnrollmentState(
      [enrollment("pending"), enrollment("active")],
      { batchId, courseId }
    );

    expect(result.state).toBe("active");
  });

  it("matches the flat batch/course refs returned by the API", () => {
    const result = resolveCheckoutEnrollmentState(
      [
        {
          status: "active",
          batch: { _id: batchId },
          course: { _id: courseId },
        },
      ],
      { batchId, courseId }
    );

    expect(result.state).toBe("active");
  });

  it("falls back to the course only when no batch is resolved yet", () => {
    const result = resolveCheckoutEnrollmentState(
      [enrollment("active", { batchId: { _id: "other-batch", courseId: { _id: courseId } } })],
      { courseId }
    );

    expect(result.state).toBe("active");
  });

  it("ignores suspended and refunded rows", () => {
    const result = resolveCheckoutEnrollmentState(
      [enrollment("suspended"), enrollment("refunded")],
      { batchId, courseId }
    );

    expect(result.state).toBe("none");
  });

  it("handles missing data", () => {
    expect(resolveCheckoutEnrollmentState(undefined, { batchId }).state).toBe("none");
    expect(resolveCheckoutEnrollmentState([], { courseId }).state).toBe("none");
  });
});
