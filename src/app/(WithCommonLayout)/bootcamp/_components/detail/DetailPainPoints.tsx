"use client";

import { CircleAlert } from "lucide-react";

interface Item {
  title: string;
  description: string;
}

export function DetailPainPoints({ items }: { items?: Item[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-bangla text-sm font-semibold text-[#ffd60a]">
        আপনার সাথে মিলিয়ে দেখুন
      </p>
      <h2 className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">
        এই সমস্যাগুলো কি চেনা লাগছে?
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="flex items-center gap-2 font-bangla font-bold">
              <CircleAlert className="h-5 w-5 shrink-0 text-[#ffd60a]" />
              {p.title}
            </p>
            <p className="mt-2 font-bangla text-sm leading-relaxed text-white/65">
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
