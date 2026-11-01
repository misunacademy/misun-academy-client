"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LockOpen } from "lucide-react";

interface ScheduleItem {
  day: string;
  dose?: string;
  title: string;
  description: string;
}

export function DetailCurriculum({ items }: { items?: ScheduleItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-bangla text-sm font-semibold text-[#ffd60a]">
        কারিকুলাম
      </p>
      <h2 className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">
        রেকর্ডেড সিলেবাস
      </h2>
      <p className="mt-1 font-bangla text-sm text-white/55">
        কেনার আগে পুরো সিলেবাস দেখে সিদ্ধান্ত নিন — {items.length}টি মডিউল
      </p>
      <Accordion type="single" collapsible className="mt-5 space-y-3">
        {items.map((item, i) => (
          <AccordionItem
            key={`${item.day}-${item.title}`}
            value={`module-${i}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5"
          >
            <AccordionTrigger className="font-bangla text-left font-bold hover:text-[#ffd60a] hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ffd60a]/15 font-bangla text-sm font-bold text-[#ffd60a]">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-xs font-semibold text-white/50">
                    {item.day}
                    {item.dose ? ` • ${item.dose}` : ""}
                  </span>
                  {item.title}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="font-bangla text-sm leading-relaxed text-white/65">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-4 flex items-center gap-2 font-bangla text-xs text-white/45">
        <LockOpen className="h-4 w-4" />
        কেনার পর সব ভিডিও সাথে সাথে আনলক হয়ে যাবে।
      </p>
    </section>
  );
}
