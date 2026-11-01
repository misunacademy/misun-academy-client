'use client';

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, Loader2 } from "lucide-react";
import type { CheckoutEnrollmentState } from "@/lib/enrollment-checkout";

type NoticeState = Exclude<CheckoutEnrollmentState, "none">;

interface EnrollmentStatusNoticeProps {
  state: NoticeState;
  /** Only used by the `resume` variant. */
  onResume?: () => void;
  isResuming?: boolean;
  enrollmentId?: string;
}

/**
 * Shown before the payment form when the learner already has a row for this
 * batch. Prevents the two worst outcomes: paying twice for an active course and
 * opening a second manual payment while the first is still under verification.
 */
export function EnrollmentStatusNotice({
  state,
  onResume,
  isResuming = false,
  enrollmentId,
}: EnrollmentStatusNoticeProps) {
  if (state === "active") {
    return (
      <NoticeCard
        tone="success"
        icon={<CheckCircle2 className="w-5 h-5" />}
        title="আপনি ইতিমধ্যে এই ব্যাচে ভর্তি আছেন"
        description="আর পেমেন্ট করার প্রয়োজন নেই। আপনার ক্লাসে গিয়ে পড়া শুরু করতে পারেন।"
        reference={enrollmentId}
        action={
          <Link
            href="/my-classes"
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            ক্লাসে যান
          </Link>
        }
      />
    );
  }

  if (state === "under-review") {
    return (
      <NoticeCard
        tone="warning"
        icon={<Clock3 className="w-5 h-5" />}
        title="আপনার পেমেন্ট যাচাই চলছে"
        description="ম্যানুয়াল পেমেন্ট সাধারণত ১২–২৪ ঘণ্টার মধ্যে যাচাই করা হয়। অনুমোদন হলে এনরোলমেন্ট স্বয়ংক্রিয়ভাবে চালু হবে — এখন আবার পেমেন্ট করবেন না।"
        reference={enrollmentId}
        action={
          <Link
            href="/profile"
            className="inline-flex w-full items-center justify-center rounded-xl border border-primary/30 px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-primary/60 hover:text-white"
          >
            প্রোফাইলে স্ট্যাটাস দেখুন
          </Link>
        }
      />
    );
  }

  return (
    <NoticeCard
      tone="warning"
      icon={<AlertTriangle className="w-5 h-5" />}
      title="অসম্পূর্ণ এনরোলমেন্ট পাওয়া গেছে"
      description="আপনার আগের পেমেন্টটি সম্পন্ন হয়নি। নতুন করে শুরু না করে আগের এনরোলমেন্টটাই চালিয়ে নিতে পারেন।"
      reference={enrollmentId}
      action={
        <button
          type="button"
          onClick={onResume}
          disabled={isResuming}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-darker disabled:text-white disabled:ring-1 disabled:ring-inset disabled:ring-primary/25"
        >
          {isResuming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              প্রসেস হচ্ছে...
            </>
          ) : (
            "পেমেন্ট চালিয়ে যান"
          )}
        </button>
      }
    />
  );
}

function NoticeCard({
  tone,
  icon,
  title,
  description,
  reference,
  action,
}: {
  tone: "success" | "warning";
  icon: React.ReactNode;
  title: string;
  description: string;
  reference?: string;
  action: React.ReactNode;
}) {
  const palette =
    tone === "success"
      ? {
          card: "border-primary/25 bg-primary/8",
          badge: "bg-primary/15 border-primary/30 text-primary",
          title: "text-white/90",
        }
      : {
          card: "border-yellow-500/25 bg-yellow-500/8",
          badge: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
          title: "text-yellow-50",
        };

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 ${palette.card}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${palette.badge}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className={`font-bangla text-base font-semibold ${palette.title}`}>
            {title}
          </h3>
          <p className="font-bangla text-sm leading-relaxed text-white/70">
            {description}
          </p>
          {reference && (
            <p className="text-xs font-mono text-white/45">Enrollment ID: {reference}</p>
          )}
        </div>
      </div>
      <div className="mt-4">{action}</div>
    </div>
  );
}
