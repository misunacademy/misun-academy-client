"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Faq {
  question: string;
  answer: string;
}

export function DetailFaq({ items }: { items?: Faq[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-center font-bangla text-2xl font-bold sm:text-3xl">
        সাধারণ প্রশ্ন
      </h2>
      <Accordion type="single" collapsible className="mt-6 space-y-3">
        {items.map((f, i) => (
          <AccordionItem
            key={f.question}
            value={`faq-${i}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5"
          >
            <AccordionTrigger className="font-bangla text-left text-base font-semibold text-white/90 hover:text-[#ffd60a] hover:no-underline">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="font-bangla text-sm leading-relaxed text-white/60">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
