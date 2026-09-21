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
