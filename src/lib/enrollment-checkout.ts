import * as z from "zod";

/**
 * Shared step-one checkout schema (course + bootcamp checkouts).
 * Previously duplicated inline in both places and already drifting.
 */
export const enrollmentCheckoutSchema = z.object({
  batchId: z.string().min(1, "Please select a batch"),
  paymentMethod: z
    .enum(["SSLCommerz", "phonePay"])
    .refine((val) => !!val, { message: "Please select a payment method" }),
});

export type EnrollmentCheckoutForm = z.infer<typeof enrollmentCheckoutSchema>;

type BatchLike = {
  enrollmentStartDate?: unknown;
  enrollmentEndDate?: unknown;
  batchNumber?: unknown;
  title?: unknown;
} | null | undefined;

/**
 * Single enrollment-window policy for every checkout. Missing or unparsable
 * dates mean "no constraint on that side" (matches the server, which only
 * rejects past enrollmentEndDate) — never a silent permanent block.
 */
export function isBatchEnrollmentOpen(batch: BatchLike, now: number = Date.now()): boolean {
  if (!batch || typeof batch !== "object") return false;
  const parse = (v: unknown, fallback: number) => {
    if (v === undefined || v === null || v === "") return fallback;
    const t = Date.parse(String(v));
    return Number.isNaN(t) ? fallback : t;
  };
  const start = parse(batch.enrollmentStartDate, Number.NEGATIVE_INFINITY);
  const end = parse(batch.enrollmentEndDate, Number.POSITIVE_INFINITY);
  return now >= start && now <= end;
}

/**
 * Stable user-facing payment reference for a batch. The server builds
 * enrollment ids from the batch NUMBER — never from the title — so prefer
 * batchNumber and only fall back to the legacy "second word of the title"
 * convention. Returns "" when neither exists (callers must then hide the
 * reference line instead of printing "MA-undefined").
 */
export function resolveBatchRef(batch: BatchLike): string {
  if (!batch || typeof batch !== "object") return "";
  const n = (batch as { batchNumber?: unknown }).batchNumber;
  if (n !== undefined && n !== null && String(n).trim() !== "") return String(n);
  const title = (batch as { title?: unknown }).title;
  if (typeof title === "string") return title.split(" ")[1] ?? "";
  return "";
}

/**
 * What the checkout should show for the learner's existing enrollment on the
 * batch they are about to buy.
 *
 *   none        — no prior enrollment; the normal form is shown.
 *   active      — already enrolled (or access revoked); never sell again.
 *   under-review— manual payment is in the admin queue; never sell again.
 *   resume      — an abandoned/failed attempt; offer to resume it.
 *
 * `suspended` / `refunded` rows are ignored on purpose: they are handled by
 * support, and the server's (userId, batchId) unique index still blocks a
 * duplicate purchase if one slips through.
 */
export type CheckoutEnrollmentState = "none" | "active" | "under-review" | "resume";

type EnrollmentRef = { _id?: string } | string | null | undefined;

export interface CheckoutEnrollmentLike {
  status?: string;
  enrollmentId?: string;
  batchId?: EnrollmentRef | { _id?: string; courseId?: EnrollmentRef };
  batch?: { _id?: string } | null;
  courseId?: { _id?: string } | null;
  course?: { _id?: string } | null;
  createdAt?: string | Date;
}

const refId = (ref: unknown): string | undefined => {
  if (typeof ref === "string") return ref;
  if (ref && typeof ref === "object" && "_id" in ref) {
    const id = (ref as { _id?: unknown })._id;
    return typeof id === "string" ? id : undefined;
  }
  return undefined;
};

const enrollmentBatchId = (enrollment: CheckoutEnrollmentLike): string | undefined =>
  refId(enrollment.batchId) ?? refId(enrollment.batch);

const enrollmentCourseId = (enrollment: CheckoutEnrollmentLike): string | undefined => {
  const batch = enrollment.batchId;
  const nested =
    batch && typeof batch === "object" && !Array.isArray(batch)
      ? refId((batch as { courseId?: EnrollmentRef }).courseId)
      : undefined;

  return nested ?? refId(enrollment.courseId) ?? refId(enrollment.course);
};

const enrollmentPriority = (status: string | undefined): number => {
  switch (status) {
    case "active":
    case "completed":
      return 0;
    case "payment-pending":
      return 1;
    case "pending":
    case "payment-failed":
      return 2;
    default:
      return -1;
  }
};

const stateForStatus = (status: string): Exclude<CheckoutEnrollmentState, "none"> => {
  if (status === "active" || status === "completed") return "active";
  if (status === "payment-pending") return "under-review";
  return "resume";
};

const createdAtValue = (value: string | Date | undefined): number => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export function resolveCheckoutEnrollmentState<T extends CheckoutEnrollmentLike>(
  enrollments: T[] | null | undefined,
  target: { batchId?: string | null; courseId?: string | null }
): { state: CheckoutEnrollmentState; enrollment: T | null } {
  const list = Array.isArray(enrollments) ? enrollments : [];

  // Match the batch being purchased. Only fall back to the course when the
  // checkout has no batch yet — a learner may legitimately own another batch
  // of the same course.
  const relevant = target.batchId
    ? list.filter((enrollment) => enrollmentBatchId(enrollment) === target.batchId)
    : target.courseId
      ? list.filter((enrollment) => enrollmentCourseId(enrollment) === target.courseId)
      : [];

  const candidates = relevant
    .map((enrollment) => ({
      enrollment,
      priority: enrollmentPriority(enrollment.status),
    }))
    .filter((entry) => entry.priority >= 0)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return createdAtValue(b.enrollment.createdAt) - createdAtValue(a.enrollment.createdAt);
    });

  const best = candidates[0];
  if (!best) {
    return { state: "none", enrollment: null };
  }

  return {
    state: stateForStatus(best.enrollment.status as string),
    enrollment: best.enrollment,
  };
}
