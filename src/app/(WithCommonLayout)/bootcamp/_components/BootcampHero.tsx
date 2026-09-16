import Image from 'next/image';
import { FadeIn } from '@/components/ui/FadeIn';
import { bootcamp } from './bootcampData';
import posterImage from '@/assets/boocamp/paracetamol-for-photoshop-season-2--version-1.png';
import frameImage from '@/assets/boocamp/frame.png';

const heroMeta = [bootcamp.dates, bootcamp.time, bootcamp.platform];

export const BootcampHero = () => (
    <section className="relative overflow-hidden bg-[#0a0a0b] text-white">
        <Image
            src={frameImage}
            alt=""
            role="presentation"
            fill
            sizes="100vw"
            className="pointer-events-none absolute inset-0 object-cover opacity-40 [mask-image:radial-gradient(75%_75%_at_50%_40%,black,transparent)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
                <FadeIn>
                    <p className="font-bangla text-sm font-semibold tracking-wide text-white/60">
                        {bootcamp.eyebrow}
                    </p>
                </FadeIn>
                <FadeIn delay={0.05}>
                    <h1 className="mt-3 font-bangla text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl">
                        <span className="text-[#ffd60a] [text-shadow:0_0_32px_rgba(255,214,10,0.35)]">
                            {bootcamp.name}
                        </span>
                        <span className="ml-2 -mt-4 inline-flex items-center rounded-lg bg-[#ffd60a] px-2  align-middle font-mona text-base font-extrabold tracking-tight text-black sm:text-lg">
                            {bootcamp.season}
                        </span>
                    </h1>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <p className="mt-4 max-w-xl font-bangla text-lg text-white/75 sm:text-xl">
                        {bootcamp.subtitle}
                    </p>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <ul className="mt-6 flex flex-wrap gap-2">
                        {heroMeta.map((item) => (
                            <li
                                key={item}
                                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <a
                            href="#register"
                            className="rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd60a]"
                        >
                            {bootcamp.cta}
                        </a>
                        <div className="rounded-lg border border-[#e5484d]/40 bg-[#e5484d]/10 px-4 py-2">
                            <p className="font-bangla text-xs text-white/60">মাত্র</p>
                            <p className="font-bangla text-2xl font-bold leading-none text-[#ffd60a]">
                                {bootcamp.fee}
                                <span className="ml-1 text-sm font-semibold text-white/80">
                                    টাকা
                                </span>
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
            <FadeIn delay={0.15} direction="left" className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="absolute -inset-6 rounded-[2rem] bg-[#ffd60a]/10 blur-3xl" />
                <Image
                    src={posterImage}
                    alt="প্যারাসিটামল ফর ফটোশপ Season 2.0 — ৪-দিনের অ্যাডভান্সড গ্রাফিক ডিজাইন বুটক্যাম্পের পোস্টার"
                    priority
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
                />
            </FadeIn>
        </div>
    </section>
);
