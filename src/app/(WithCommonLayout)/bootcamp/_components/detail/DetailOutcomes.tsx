"use client";

import { CheckCircle2, Target } from "lucide-react";

interface Outcome {
  title: string;
  description: string;
}

interface Props {
  outcomes?: Outcome[];
  audience?: string[];
}

export function DetailOutcomes({ outcomes, audience }: Props) {
  if (
    (!outcomes || outcomes.length === 0) &&
    (!audience || audience.length === 0)
  )
    return null;
  return (
    <section className="border-y border-white/10 bg-white/[0.015]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-bangla text-sm font-semibold text-[#ffd60a]">
          শেখার ফলাফল
        </p>
        <h2 className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">
          শেষ করার পর আপনি যা পারবেন
        </h2>
        {outcomes && outcomes.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {outcomes.map((o) => (
              <div
                key={o.title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#ffd60a]" />
                <div>
                  <p className="font-bangla font-bold">{o.title}</p>
                  <p className="mt-1 font-bangla text-sm text-white/65">
                    {o.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {audience && audience.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#ffd60a]/30 bg-[#ffd60a]/[0.04] p-5">
            <p className="flex items-center gap-2 font-bangla font-bold text-[#ffd60a]">
              <CheckCircle2 className="h-5 w-5" /> কাদের জন্য
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {audience.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
