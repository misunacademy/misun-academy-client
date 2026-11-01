"use client";

import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role?: string;
  quote: string;
  rating?: number;
}

export function DetailTestimonials({ items }: { items?: Testimonial[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="border-y border-white/10 bg-white/[0.015]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-bangla text-sm font-semibold text-[#ffd60a]">
          রিভিউ
        </p>
        <h2 className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">
          শিক্ষার্থীরা যা বলছে
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure
              key={`${t.name}-${t.quote.slice(0, 24)}`}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              {typeof t.rating === "number" ? (
                <div className="flex gap-1" aria-label={`${t.rating} star`}>
                  {Array.from({ length: Math.min(5, Math.max(1, t.rating)) }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#ffd60a] text-[#ffd60a]"
                      />
                    ),
                  )}
                </div>
              ) : null}
              <blockquote className="mt-3 flex-1 font-bangla text-sm leading-relaxed text-white/75">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 font-bangla text-sm">
                <span className="font-bold">{t.name}</span>
                {t.role ? (
                  <span className="block text-xs text-white/50">{t.role}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
