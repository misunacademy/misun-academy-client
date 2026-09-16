import { FadeIn } from '@/components/ui/FadeIn';
import { bootcampPerks } from './bootcampData';

const perkMarkers = ['✚', '◆', '●', '✦', '▲'];

export const BootcampPerks = () => (
    <section className="border-y border-white/10 bg-[#0a0a0b] py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
            <FadeIn>
                <p className="font-mona text-xs font-bold uppercase tracking-[0.3em] text-[#ffd60a]">
                    4-Day Course · Special Dose
                </p>
                <h2 className="mt-2 font-bangla text-2xl font-bold sm:text-3xl">
                    এই বুটক্যাম্পে যা যা পাচ্ছেন
                </h2>
            </FadeIn>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bootcampPerks.map((perk, index) => (
                    <FadeIn key={perk.title} delay={index * 0.05}>
                        <li className="h-full list-none rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#ffd60a]/40">
                            <span
                                aria-hidden
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffd60a]/15 text-base text-[#ffd60a]"
                            >
                                {perkMarkers[index % perkMarkers.length]}
                            </span>
                            <h3 className="mt-4 font-bangla text-lg font-bold">{perk.title}</h3>
                            <p className="mt-1.5 font-bangla text-sm leading-relaxed text-white/60">
                                {perk.description}
                            </p>
                        </li>
                    </FadeIn>
                ))}
                <FadeIn delay={0.25}>
                    <li className="flex h-full list-none flex-col justify-center rounded-2xl border border-dashed border-[#ffd60a]/40 bg-[#ffd60a]/[0.06] p-5 text-center">
                        <p className="font-mona text-xs font-bold uppercase tracking-[0.25em] text-[#ffd60a]">
                            Total Dose
                        </p>
                        <p className="mt-1 font-bangla text-xl font-bold">
                            ৪ দিনের বুটক্যাম্প
                        </p>
                    </li>
                </FadeIn>
            </ul>
        </div>
    </section>
);
