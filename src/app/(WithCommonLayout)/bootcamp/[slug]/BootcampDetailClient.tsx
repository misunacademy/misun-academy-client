'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PlayCircle, Clock, Infinity as InfinityIcon, CheckCircle2, Lock } from 'lucide-react';
import { useGetBootcampBySlugQuery } from '@/redux/api/bootcampApi';
import { useAuth } from '@/hooks/useAuth';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export default function BootcampDetailClient() {
    const params = useParams();
    const router = useRouter();
    const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
    const { data, isLoading, error } = useGetBootcampBySlugQuery(slug, { skip: !slug });
    const { user } = useAuth();

    if (isLoading) {
        return (
            <main className="bg-[#0a0a0b]">
                <div className="mx-auto max-w-6xl px-4 py-16">
                    <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
                </div>
            </main>
        );
    }

    if (error || !data?.data) {
        return (
            <main className="bg-[#0a0a0b]">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                    <p className="font-bangla text-xl text-white/70">বুটক্যাম্প পাওয়া যায়নি।</p>
                    <Link href="/bootcamp" className="mt-6 inline-block rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla font-bold text-black">
                        সব বুটক্যাম্প দেখুন
                    </Link>
                </div>
            </main>
        );
    }

    const bootcamp = data.data;
    const image = bootcamp.posterImage || bootcamp.thumbnail;
    const hours = bootcamp.durationMinutes > 0 ? `${Math.round(bootcamp.durationMinutes / 60)} ঘণ্টা` : 'সেলফ-পেসড';

    const handleBuy = () => {
        if (!user) {
            router.push(`/auth?redirect_url=${encodeURIComponent(`/bootcamp/${bootcamp.slug}`)}`);
            return;
        }
        const batchId = (bootcamp as unknown as { recordedBatchId?: string }).recordedBatchId;
        if (!batchId) return;
        router.push(`/checkout?batch=${batchId}&bootcamp=${bootcamp.slug}`);
    };

    return (
        <main className="bg-[#0a0a0b] text-white">
            <section className="relative overflow-hidden">
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <p className="font-bangla text-sm font-semibold tracking-wide text-white/60">
                            বুটক্যাম্প রেকর্ডিং • {bootcamp.season}
                        </p>
                        <h1 className="mt-3 font-bangla text-4xl font-bold leading-tight sm:text-5xl">
                            {bootcamp.title}
                        </h1>
                        {bootcamp.tagline ? (
                            <p className="mt-4 max-w-xl font-bangla text-lg text-white/70">{bootcamp.tagline}</p>
                        ) : null}
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80">
                                <Clock className="mr-1 inline h-4 w-4" />
                                {hours}
                            </span>
                            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80">
                                <PlayCircle className="mr-1 inline h-4 w-4" />
                                {bootcamp.lessonsCount > 0 ? `${bootcamp.lessonsCount} ভিডিও` : 'রেকর্ডেড ভিডিও'}
                            </span>
                            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-bangla text-sm text-white/80">
                                <InfinityIcon className="mr-1 inline h-4 w-4" />
                                লাইফটাইম অ্যাক্সেস
                            </span>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button
                                onClick={handleBuy}
                                className="rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
                            >
                                এখনই কিনুন — ৳{bootcamp.recordedPrice}
                            </button>
                            <p className="font-bangla text-sm text-white/55">
                                একবার কিনলেই আজীবন অ্যাক্সেস। সবার জন্য একই ভিডিও।
                            </p>
                        </div>
                    </div>
                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <div className="absolute -inset-6 rounded-[2rem] bg-[#ffd60a]/10 blur-3xl" />
                        {image ? (
                            <Image
                                src={image}
                                alt={`${bootcamp.title} ${bootcamp.season}`}
                                width={800}
                                height={450}
                                className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
                            />
                        ) : (
                            <div className="relative flex aspect-video w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                                <PlayCircle className="h-14 w-14 text-white/30" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {bootcamp.perks && bootcamp.perks.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <h2 className="font-bangla text-2xl font-bold">যা যা পাচ্ছেন</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bootcamp.perks.map((perk) => (
                            <div key={perk.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <p className="flex items-center gap-2 font-bangla font-bold">
                                    <CheckCircle2 className="h-5 w-5 text-[#ffd60a]" />
                                    {perk.title}
                                </p>
                                <p className="mt-2 font-bangla text-sm text-white/65">{perk.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {bootcamp.schedule && bootcamp.schedule.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <h2 className="font-bangla text-2xl font-bold">রেকর্ডেড সিলেবাস</h2>
                    <div className="mt-5 space-y-3">
                        {bootcamp.schedule.map((item) => (
                            <div key={`${item.day}-${item.title}`} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffd60a]/15 text-[#ffd60a]">
                                    <Lock className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="font-bangla text-xs font-semibold text-white/50">{item.day}</p>
                                    <p className="font-bangla text-lg font-bold">{item.title}</p>
                                    <p className="mt-1 font-bangla text-sm text-white/65">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {bootcamp.faq && bootcamp.faq.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <h2 className="font-bangla text-2xl font-bold">সাধারণ প্রশ্ন</h2>
                    <div className="mt-5 space-y-3">
                        {bootcamp.faq.map((f) => (
                            <div key={f.question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <p className="font-bangla font-bold">{f.question}</p>
                                <p className="mt-2 font-bangla text-sm text-white/65">{f.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            <BreadcrumbJsonLd />
        </main>
    );
}
