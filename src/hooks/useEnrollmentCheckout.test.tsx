// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEnrollmentCheckout } from "@/hooks/useEnrollmentCheckout";

const mocks = vi.hoisted(() => ({
  enrollments: [] as Array<Record<string, unknown>>,
  initiateEnrollment: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@/redux/api/courseApi", () => ({
  useGetCourseBySlugQuery: () => ({
    data: { data: { _id: "course-1", title: "Course", slug: "course" } },
    isLoading: false,
  }),
}));

vi.mock("@/redux/api/batchApi", () => ({
  useGetCurrentEnrollmentBatchQuery: () => ({
    data: { data: { _id: "batch-1", price: 5000, batchNumber: 1 } },
    isLoading: false,
  }),
  useGetUpcomingBatchesQuery: () => ({ data: { data: [] }, isLoading: false }),
}));

vi.mock("@/redux/api/enrollmentApi", () => ({
  useGetEnrollmentsQuery: () => ({
    data: { data: mocks.enrollments },
    isLoading: false,
  }),
  useInitiateEnrollmentMutation: () => [mocks.initiateEnrollment],
  useEnrollStudentManualMutation: () => [vi.fn()],
}));

beforeEach(() => {
  mocks.enrollments = [];
  mocks.initiateEnrollment.mockReset();
  mocks.initiateEnrollment.mockReturnValue({
    unwrap: () => Promise.resolve({ data: {} }),
  });
});

describe("useEnrollmentCheckout — existing enrollment guard", () => {
  it("exposes no state when the learner has nothing for this batch", () => {
    const { result } = renderHook(() => useEnrollmentCheckout("course"));

    expect(result.current.checkoutState).toBe("none");
    expect(result.current.isCheckoutBlocked).toBe(false);
  });

  it("blocks checkout for an active enrollment and exposes its reference", () => {
    mocks.enrollments = [
      {
        status: "active",
        enrollmentId: "MA-3202600001",
        batchId: { _id: "batch-1", courseId: { _id: "course-1" } },
      },
    ];

    const { result } = renderHook(() => useEnrollmentCheckout("course"));

    expect(result.current.checkoutState).toBe("active");
    expect(result.current.isCheckoutBlocked).toBe(true);
    expect(result.current.checkoutEnrollment?.enrollmentId).toBe("MA-3202600001");
  });

  it("blocks checkout while a manual payment is under review", () => {
    mocks.enrollments = [
      {
        status: "payment-pending",
        enrollmentId: "MA-3202600002",
        batchId: { _id: "batch-1", courseId: { _id: "course-1" } },
      },
    ];

    const { result } = renderHook(() => useEnrollmentCheckout("course"));

    expect(result.current.checkoutState).toBe("under-review");
    expect(result.current.isCheckoutBlocked).toBe(true);
  });

  it("offers resume for an abandoned attempt and re-initiates the same batch", async () => {
    mocks.enrollments = [
      {
        status: "pending",
        enrollmentId: "MA-3202600003",
        batchId: { _id: "batch-1", courseId: { _id: "course-1" } },
      },
    ];

    const { result } = renderHook(() => useEnrollmentCheckout("course"));

    expect(result.current.checkoutState).toBe("resume");
    expect(result.current.isCheckoutBlocked).toBe(false);

    await act(async () => {
      await result.current.resumePayment();
    });

    expect(mocks.initiateEnrollment).toHaveBeenCalledTimes(1);
    expect(mocks.initiateEnrollment).toHaveBeenCalledWith({ batchId: "batch-1" });
  });

  it.each(["payment-failed", "expired"])(
    "ignores a terminal %s attempt so checkout starts fresh",
    (status) => {
      mocks.enrollments = [
        {
          status,
          enrollmentId: "MA-3202600004",
          batchId: { _id: "batch-1", courseId: { _id: "course-1" } },
        },
      ];

      const { result } = renderHook(() => useEnrollmentCheckout("course"));

      expect(result.current.checkoutState).toBe("none");
      expect(result.current.isCheckoutBlocked).toBe(false);
    }
  );
});
