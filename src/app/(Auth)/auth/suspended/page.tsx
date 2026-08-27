import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "অ্যাকাউন্ট স্থগিত | Misun Academy",
  description: "আপনার অ্যাকাউন্ট বর্তমানে স্থগিত রয়েছে।",
};

function SuspendedContent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <svg
            className="h-7 w-7 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-xl font-bold">অ্যাকাউন্ট স্থগিত</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          আপনার অ্যাকাউন্টটি বর্তমানে স্থগিত রয়েছে। কোর্সে ভর্তি ও ক্লাস অ্যাক্সেস সাময়িকভাবে বন্ধ আছে।
          বিস্তারিত জানতে অনুগ্রহ করে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default function AccountSuspendedPage() {
  return (
    <Suspense fallback={null}>
      <SuspendedContent />
    </Suspense>
  );
}
