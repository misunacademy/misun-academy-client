'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PlayCircle, Clock, Infinity as InfinityIcon, CheckCircle2, Lock, Video, Play } from 'lucide-react';
import { useGetBootcampBySlugQuery, useGetMyBootcampVideosQuery } from '@/redux/api/bootcampApi';
import { useAuth } from '@/hooks/useAuth';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import BootcampPurchaseDialog from '../_components/BootcampPurchaseDialog';
import { YoutubePrivatePlayer } from '@/components/shared/youtube-private-player';
import { toast } from 'sonner';

export default function BootcampDetailClient() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
    const { data, isLoading, error } = useGetBootcampBySlugQuery(slug, { skip: !slug });
    const { user } = useAuth();
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    const hasPurchased = Boolean((data?.data as { hasPurchased?: boolean } | undefined)?.hasPurchased);
    const { data: videosData, error: videosError } = useGetMyBootcampVideosQuery(slug, {
        skip: !slug || !hasPurchased,
    });

    // ─── SSLCommerz return redirect feedback ───
    const paymentResult = searchParams.get('payment');
    useEffect(() => {
        if (paymentResult === 'success') {
            toast.success('পেমেন্ট সফল হয়েছে! আপনার রেকর্ডিং আনলক হয়ে গেছে।');
        } else if (paymentResult === 'failed') {
            toast.error('পেমেন্ট সফল হয়নি। আবার চেষ্টা করুন।');
        }
        if (paymentResult) {
            const remaining = searchParams.toString().replace(/(^|&)payment=[^&]*/g, '');
            void router.replace(`/bootcamp/${slug}${remaining ? `?${remaining}` : ''}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentResult]);

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
    const myVideos = videosData?.data?.videos ?? [];
    const safeIdx = myVideos.length > 0 ? Math.min(activeIdx, myVideos.length - 1) : 0;
    const activeVideo = myVideos[safeIdx];

    const getVideoUrl = (v: (typeof myVideos)[number]) =>
        v.videoSource === 'youtube'
            ? v.videoUrl || `https://www.youtube.com/watch?v=${v.videoId}`
            : v.videoUrl || `https://drive.google.com/file/d/${v.videoId}/preview`;

    const handleBuy = () => {
        if (!user) {
            router.push(`/auth?mode=register&redirect_url=${encodeURIComponent(`/bootcamp/${bootcamp.slug}`)}`);
            return;
        }
        setPurchaseOpen(true);
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
                            {hasPurchased ? (
                                <a
                                    href="#bootcamp-videos"
                                    className="rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
                                >
                                    <Play className="mr-1 inline h-4 w-4" /> ভিডিও দেখুন
                                </a>
                            ) : (
                                <button
                                    onClick={handleBuy}
                                    className="rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
                                >
                                    এখনই কিনুন — ৳{bootcamp.recordedPrice}
                                </button>
                            )}
                            <p className="font-bangla text-sm text-white/55">
                                {hasPurchased
                                    ? 'আপনি এই রেকর্ডিং কিনে ফেলেছেন।'
                                    : 'একবার কিনলেই আজীবন অ্যাক্সেস। সবার জন্য একই ভিডিও।'}
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

            {hasPurchased ? (
                <section id="bootcamp-videos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10">
                    <h2 className="font-bangla text-2xl font-bold">রেকর্ডেড সেশন</h2>
                    <p className="mt-1 font-bangla text-sm text-white/55">
                        {myVideos.length}টি ভিডিও • লাইফটাইম অ্যাক্সেস
                    </p>
                    {videosError ? (
                        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/5 p-8 text-center">
                            <Video className="mx-auto h-8 w-8 text-red-300/60" />
                            <p className="mt-2 font-bangla text-sm text-red-200/80">
                                ভিডিও লোড করা যায়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।
                            </p>
                        </div>
                    ) : myVideos.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-white/10 p-8 text-center">
                            <Video className="mx-auto h-8 w-8 text-white/30" />
                            <p className="mt-2 font-bangla text-sm text-white/60">
                                ভিডিও শীঘ্রই যোগ করা হবে।
                            </p>
                        </div>
                    ) : activeVideo ? (
                        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
                            <div>
                                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                                    <div className="aspect-video w-full">
                                        <YoutubePrivatePlayer
                                            key={activeVideo._id}
                                            url={getVideoUrl(activeVideo)}
                                            className="h-full w-full"
                                        />
                                    </div>
                                </div>
                                <p className="mt-4 font-bangla text-xs font-semibold text-white/50">
                                    সেশন {safeIdx + 1} / {myVideos.length}
                                    {activeVideo.duration
                                        ? ` • ${Math.round(activeVideo.duration / 60)} মিনিট`
                                        : ''}
                                </p>
                                <p className="mt-1 font-bangla text-xl font-bold">{activeVideo.title}</p>
                                {activeVideo.description ? (
                                    <p className="mt-1 font-bangla text-sm text-white/65">
                                        {activeVideo.description}
                                    </p>
                                ) : null}
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                                <p className="border-b border-white/10 px-4 py-3 font-bangla text-sm font-bold text-white/70">
                                    প্লেলিস্ট
                                </p>
                                <div className="max-h-[420px] divide-y divide-white/5 overflow-y-auto">
                                    {myVideos.map((v, idx) => {
                                        const isActive = idx === safeIdx;
                                        return (
                                            <button
                                                key={v._id}
                                                type="button"
                                                onClick={() => setActiveIdx(idx)}
                                                aria-current={isActive}
                                                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                                                    isActive
                                                        ? 'bg-[#ffd60a]/10'
                                                        : 'hover:bg-white/5'
                                                }`}
                                            >
                                                <span
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bangla text-sm font-bold ${
                                                        isActive
                                                            ? 'bg-[#ffd60a] text-black'
                                                            : 'bg-white/10 text-white/60'
                                                    }`}
                                                >
                                                    {isActive ? (
                                                        <Play className="h-3.5 w-3.5 fill-current" />
                                                    ) : (
                                                        idx + 1
                                                    )}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span
                                                        className={`block truncate font-bangla text-sm font-bold ${
                                                            isActive ? 'text-[#ffd60a]' : 'text-white/85'
                                                        }`}
                                                    >
                                                        {v.title}
                                                    </span>
                                                    <span className="mt-0.5 block font-bangla text-xs text-white/45">
                                                        সেশন {idx + 1}
                                                        {v.duration
                                                            ? ` • ${Math.round(v.duration / 60)} মিনিট`
                                                            : ''}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </section>
            ) : null}

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

            <BootcampPurchaseDialog
                open={purchaseOpen}
                onClose={() => setPurchaseOpen(false)}
                slug={bootcamp.slug}
                title={`${bootcamp.title} ${bootcamp.season}`}
                price={bootcamp.recordedPrice}
            />
            <BreadcrumbJsonLd />
        </main>
    );
}