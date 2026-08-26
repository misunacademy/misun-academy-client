import { FadeIn } from '@/components/ui/FadeIn';
import { bootcampDoses } from './bootcampData';

export const BootcampDoseSchedule = () => (
    <section className="bg-[#0a0a0b] py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
            <FadeIn>
                <p className="font-mona text-xs font-bold uppercase tracking-[0.3em] text-[#ffd60a]">
                    Dosage Schedule
                </p>
                <h2 className="mt-2 font-bangla text-2xl font-bold sm:text-3xl">
                    ৪ দিনের ডোজ শিডিউল
                </h2>
                <p className="mt-2 max-w-2xl font-bangla text-sm text-white/60">
                    প্রতিদিন রাত ৯টায় একটি করে ডোজ — জুমে লাইভ।
                </p>
            </FadeIn>
            <FadeIn delay={0.1}>
                <div className="mt-8 rounded-3xl bg-[#f4f1e8] p-5 text-[#141416] shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:p-8">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-[#141416]/20 pb-4">
                        <div>
                            <p className="font-mona text-[10px] font-bold uppercase tracking-[0.3em] text-[#141416]/50">
                                Paracetamol 500mg
                            </p>
                            <p className="font-bangla text-lg font-bold">
                                ফটোশপ বুটক্যাম্প — সিজন ২.০
                            </p>
                        </div>
                        <span className="rounded-full border-2 border-[#141416]/70 px-3 py-1 font-mona text-xs font-bold uppercase tracking-widest">
                            Rx
                        </span>
                    </div>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {bootcampDoses.map((dose) => (
                            <li
                                key={dose.day}
                                className="relative rounded-2xl border border-[#141416]/15 bg-white p-4 pt-6"
                            >
                                <span className="absolute -top-3 left-4 rounded-full bg-[#ffd60a] px-3 py-0.5 font-bangla text-xs font-bold text-black shadow">
                                    {dose.day}
                                </span>
                                <div className="flex gap-1.5" aria-hidden>
                                    {[0, 1, 2].map((pill) => (
                                        <span
                                            key={pill}
                                            className="h-5 w-9 rounded-full border border-[#141416]/20 bg-gradient-to-b from-white to-[#e8e4d8] shadow-inner"
                                        />
                                    ))}
                                </div>
                                <p className="mt-3 font-mona text-[10px] font-bold uppercase tracking-[0.2em] text-[#141416]/45">
                                    {dose.dose} · রাত ৯টা
                                </p>
                                <h3 className="mt-1 font-bangla text-base font-bold">
                                    {dose.title}
                                </h3>
                                <p className="mt-1 font-bangla text-xs leading-relaxed text-[#141416]/60">
                                    {dose.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 border-t-2 border-dashed border-[#141416]/20 pt-4 text-center font-bangla text-xs text-[#141416]/55">
                        প্রতিদিনের ক্লাস ১৩–১৬ সেপ্টেম্বর, রাত ৯টায় — এক ডোজও মিস করবেন না।
                    </p>
                </div>
            </FadeIn>
        </div>
    </section>
);
