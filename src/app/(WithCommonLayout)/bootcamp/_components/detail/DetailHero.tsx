"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Infinity as InfinityIcon, Play, PlayCircle } from "lucide-react";
import type { BootcampCatalogItem } from "@/redux/api/bootcampApi";

interface Props {
  bootcamp: BootcampCatalogItem;
  hasPurchased: boolean;
  onBuy: () => void;
  watchUrl: string;
}

export function DetailHero({ bootcamp, hasPurchased, onBuy, watchUrl }: Props) {
  const image = bootcamp.posterImage || bootcamp.thumbnail;
  const hours =
    bootcamp.durationMinutes > 0
      ? `${Math.round(bootcamp.durationMinutes / 60)} ঘণ্টা`
      : "সেলফ-পেসড";
  const discount =
    bootcamp.liveFee > bootcamp.recordedPrice
      ? Math.round((1 - bootcamp.recordedPrice / bootcamp.liveFee) * 100)
      : 0;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,214,10,0.08),transparent)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-bangla text-sm font-semibold tracking-wide text-white/60">
            বুটক্যাম্প রেকর্ডিং • {bootcamp.season}
          </p>
          <h1 className="mt-3 font-bangla text-4xl font-bold leading-tight sm:text-5xl">
            {bootcamp.title}
          </h1>
          {bootcamp.tagline ? (
            <p className="mt-4 max-w-xl font-bangla text-lg text-white/70">
              {bootcamp.tagline}
            </p>
          ) : null}
          {bootcamp.description ? (
            <p className="mt-3 max-w-xl font-bangla text-sm leading-relaxed text-white/55">
              {bootcamp.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80">
              <Clock className="mr-1 inline h-4 w-4" />
              {hours}
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80">
              <PlayCircle className="mr-1 inline h-4 w-4" />
              {bootcamp.lessonsCount > 0
                ? `${bootcamp.lessonsCount} ভিডিও`
                : "রেকর্ডেড ভিডিও"}
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80">
              <InfinityIcon className="mr-1 inline h-4 w-4" />
              লাইফটাইম অ্যাক্সেস
            </span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {hasPurchased ? (
              <Link
                href={watchUrl}
                className="rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
              >
                <Play className="mr-1 inline h-4 w-4" /> ভিডিও দেখুন
              </Link>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onBuy}
                  className="rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
                >
                  এখনই কিনুন — ৳{bootcamp.recordedPrice}
                </button>
                {discount > 0 ? (
                  <span className="rounded-lg border border-[#ffd60a]/30 bg-[#ffd60a]/10 px-3 py-2 font-bangla text-sm font-bold text-[#ffd60a]">
                    {discount}% ছাড়
                    <span className="ml-2 font-normal text-white/50 line-through">
                      ৳{bootcamp.liveFee}
                    </span>
                  </span>
                ) : null}
              </div>
            )}
            <p className="w-full font-bangla text-sm text-white/55">
              {hasPurchased
                ? "আপনি এই রেকর্ডিং কিনে ফেলেছেন।"
                : "একবার কিনলেই আজীবন অ্যাক্সেস। সবার জন্য একই ভিডিও।"}
            </p>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-6 rounded-[2rem] bg-[#ffd60a]/10 blur-3xl" />
          {image ? (
            <Image
              src={image}
              alt={`${bootcamp.title} ${bootcamp.season}`}
              width={800}
              height={450}
              className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
            />
          ) : (
            <div className="relative flex aspect-video w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <PlayCircle className="h-14 w-14 text-white/30" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
