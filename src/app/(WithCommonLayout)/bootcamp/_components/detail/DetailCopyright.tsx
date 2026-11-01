"use client";

import { ShieldAlert } from "lucide-react";

export function DetailCopyright() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-2">
      <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.04] p-4 sm:items-center">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-300/80" />
        <p className="font-bangla text-xs leading-relaxed text-white/55 sm:text-sm">
          <span className="font-bold text-white/80">© MISUN Academy — সর্বস্বত্ব সংরক্ষিত।</span>{" "}
          এই রেকর্ডিং শুধু আপনার ব্যক্তিগত শেখার জন্য। ডাউনলোড করে শেয়ার, আপলোড বা
          বিক্রি করা কপিরাইট আইনে দণ্ডনীয় অপরাধ।
        </p>
      </div>
    </div>
  );
}
