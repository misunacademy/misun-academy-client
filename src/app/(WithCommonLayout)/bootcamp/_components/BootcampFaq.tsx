import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { FadeIn } from '@/components/ui/FadeIn';
import { bootcampFaq } from './bootcampData';
import nemonicImage from '@/assets/boocamp/paracetamol-for-photoshop-season-2-nemonic.png';

export const BootcampFaq = () => (
    <section className="bg-[#0a0a0b] pb-16 text-white">
        <div className="mx-auto max-w-3xl px-4">
            <FadeIn>
                <h2 className="text-center font-bangla text-2xl font-bold sm:text-3xl">
                    সাধারণ জিজ্ঞাসা
                </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
                <Accordion type="single" collapsible className="mt-8 space-y-3">
                    {bootcampFaq.map((faq, index) => (
                        <AccordionItem
                            key={faq.question}
                            value={`faq-${index}`}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 last:border-b"
                        >
                            <AccordionTrigger className="font-bangla text-base font-semibold text-white/90 hover:text-[#ffd60a] hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="font-bangla text-sm leading-relaxed text-white/60">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </FadeIn>
            <FadeIn delay={0.15}>
                <div className="mt-12 flex flex-col items-center gap-5 rounded-3xl border border-[#ffd60a]/25 bg-gradient-to-b from-[#ffd60a]/[0.08] to-transparent px-6 py-10 text-center">
                    <Image
                        src={nemonicImage}
                        alt="প্যারাসিটামল ফর ফটোশপ Season 2.0"
                        sizes="320px"
                        className="w-64 max-w-full"
                    />
                    <p className="max-w-md font-bangla text-sm text-white/60">
                        ৩৫০ টাকার এই ডোজ মিস করবেন না — সিট নিশ্চিত করতে আজই রেজিস্ট্রেশন
                        করে ফেলুন।
                    </p>
                    <a
                        href="#register"
                        className="rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd60a]"
                    >
                        সিট নিশ্চিত করুন
                    </a>
                </div>
            </FadeIn>
        </div>
    </section>
);
