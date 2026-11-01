"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { BootcampCatalogItem } from "@/redux/api/bootcampApi";

interface Props {
  bootcamp: BootcampCatalogItem;
  hasPurchased: boolean;
  onBuy: () => void;
  watchUrl: string;
}

export function DetailValueCard({ bootcamp, hasPurchased, onBuy, watchUrl }: Props) {
  if (hasPurchased && !bootcamp.guaranteeNote) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border border-[#ffd60a]/25 bg-gradient-to-b from-[#ffd60a]/[0.08] to-transparent p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-bangla text-sm font-semibold text-[#ffd60a]">
              প্রাইস
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="font-bangla text-4xl font-bold">
                ৳{bootcamp.recordedPrice}
              </span>
              {bootcamp.liveFee > bootcamp.recordedPrice ? (
                <span className="font-bangla text-lg text-white/40 line-through">
                  ৳{bootcamp.liveFee}
                </span>
              ) : null}
            </div>
            <p className="mt-2 font-bangla text-sm text-white/60">
              একবার পেমেন্ট — লাইফটাইম অ্যাক্সেস • {bootcamp.lessonsCount} ভিডিও
            </p>
            {bootcamp.guaranteeNote ? (
              <p className="mt-3 flex items-start gap-2 font-bangla text-sm text-white/70">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd60a]" />
                {bootcamp.guaranteeNote}
              </p>
            ) : null}
          </div>
          {!hasPurchased ? (
            <button
              onClick={onBuy}
              className="shrink-0 rounded-xl bg-[#ffd60a] px-8 py-4 font-bangla text-lg font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
            >
              এখনই কিনুন
            </button>
          ) : (
            <Link
              href={watchUrl}
              className="shrink-0 rounded-xl bg-[#ffd60a] px-8 py-4 text-center font-bangla text-lg font-bold text-black"
            >
              ভিডিও দেখুন
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
