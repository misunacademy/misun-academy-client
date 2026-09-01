'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { bootcamp, bootcampPaymentMethods } from './bootcampData';

export const BootcampPayment = () => {
    const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

    const copyNumber = async (number: string) => {
        try {
            await navigator.clipboard.writeText(number);
            setCopiedNumber(number);
            setTimeout(() => setCopiedNumber(null), 2000);
        } catch {
            setCopiedNumber(null);
        }
    };

    return (
        <section className="border-y border-white/10 bg-[#0a0a0b] py-14 text-white">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <FadeIn>
                        <p className="font-mona text-xs font-bold uppercase tracking-[0.3em] text-[#ffd60a]">
                            Payment
                        </p>
                        <h2 className="mt-2 font-bangla text-2xl font-bold sm:text-3xl">
                            ফি মাত্র{' '}
                            <span className="text-[#ffd60a]">{bootcamp.fee} টাকা</span>
                        </h2>
                        <p className="mt-3 font-bangla text-sm leading-relaxed text-white/60">
                            নিচের যেকোনো নম্বরে <strong className="text-white/85">সেন্ড মানি</strong>{' '}
                            করুন। পেমেন্ট শেষে ফর্মে পেমেন্ট করা নম্বরের{' '}
                            <strong className="text-white/85">শেষ ৪ ডিজিট</strong> লিখুন — এটিই
                            আপনার রেজিস্ট্রেশন যাচাইয়ের রেফারেন্স।
                        </p>
                        <div className="mt-6 inline-flex items-baseline gap-2 rounded-xl border border-[#e5484d]/40 bg-[#e5484d]/10 px-5 py-3">
                            <span className="font-bangla text-sm text-white/60">ফি:</span>
                            <span className="font-bangla text-3xl font-bold text-[#ffd60a]">
                                {bootcamp.fee}৳
                            </span>
                            <span className="font-bangla text-xs text-white/55">
                                ({bootcamp.feeNote})
                            </span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <ul className="space-y-4">
                            {bootcampPaymentMethods.map((method) => (
                                <li
                                    key={method.number}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                                >
                                    <div>
                                        <p className="font-bangla text-sm font-bold text-[#ffd60a]">
                                            {method.label} {method.label === 'ফোনপে' && ' (PhonePe - India)'}
                                            <span className="ml-2 rounded bg-white/10 px-2 py-0.5 font-bangla text-[10px] font-semibold text-white/70">
                                                {method.type}
                                            </span>
                                        </p>
                                        <p className="mt-1 font-mona text-2xl font-bold tracking-wider text-white">
                                            {method.number}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyNumber(method.number)}
                                        aria-label={`${method.label} নম্বর কপি করুন`}
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ffd60a]/30 bg-[#ffd60a]/10 text-[#ffd60a] transition-colors hover:bg-[#ffd60a]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd60a]"
                                    >
                                        {copiedNumber === method.number ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <Copy className="h-5 w-5" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};
