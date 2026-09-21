'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Download,
    ExternalLink,
    FileText,
    Play,
    Video,
} from 'lucide-react';
import {
    useGetBootcampBySlugQuery,
    useGetMyBootcampVideosQuery,
    type BootcampVideo,
} from '@/redux/api/bootcampApi';
import { LessonVideoPlayer } from '@/components/shared/lesson-video-player';
import { DetailCopyright } from '../../_components/detail/DetailCopyright';

function ResourcesBlock({ video }: { video: BootcampVideo }) {
    const resources = video.resources ?? [];
    return (
        <section className="mt-6">
            <h2 className="flex items-center gap-2 font-bangla text-lg font-bold">
                <FileText className="h-5 w-5 text-[#ffd60a]" />
                রিসোর্স
            </h2>
            {resources.length === 0 ? (
                <p className="mt-2 rounded-2xl border border-dashed border-white/10 p-4 text-center font-bangla text-sm text-white/45">
                    এই ভিডিওর জন্য কোনো রিসোর্স যোগ করা হয়নি।
                </p>
            ) : (
                <ul className="mt-3 space-y-2">
                    {resources.map((r) => (
                        <li key={`${r.title}-${r.url}`}>
                            <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#ffd60a]/40"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffd60a]/15 text-[#ffd60a]">
                                    <Download className="h-5 w-5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-bangla text-sm font-bold text-white/90">
                                        {r.title}
                                    </span>
                                    <span className="mt-0.5 block truncate text-xs text-white/40">
                                        {r.url}
                                    </span>
                                </span>
                                <ExternalLink className="h-4 w-4 shrink-0 text-white/40" />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function BootcampWatchClient() {
    const params = useParams();
    const router = useRouter();
    const slug =
        typeof params?.slug === 'string'
            ? params.slug
            : Array.isArray(params?.slug)
              ? params.slug[0]
              : '';
    const { data, isLoading, error } = useGetBootcampBySlugQuery(slug, { skip: !slug });
    const [activeIdx, setActiveIdx] = useState(0);

    const hasPurchased = Boolean(
        (data?.data as { hasPurchased?: boolean } | undefined)?.hasPurchased
    );
    const {
        data: videosData,
        isLoading: videosLoading,
        error: videosError,
    } = useGetMyBootcampVideosQuery(slug, { skip: !slug || !hasPurchased });

    if (isLoading || (hasPurchased && videosLoading)) {
        return (
            <main className="bg-[#0a0a0b]">
                <div className="mx-auto max-w-7xl px-4 py-16">
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
                    <Link
                        href="/bootcamp"
                        className="mt-6 inline-block rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla font-bold text-black"
                    >
                        সব বুটক্যাম্প দেখুন
                    </Link>
                </div>
            </main>
        );
    }

    const bootcamp = data.data;

    if (!hasPurchased || videosError) {
        return (
            <main className="bg-[#0a0a0b] text-white">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                    <Video className="mx-auto h-10 w-10 text-white/30" />
                    <h1 className="mt-4 font-bangla text-2xl font-bold">
                        {bootcamp.title} {bootcamp.season}
                    </h1>
                    <p className="mt-2 font-bangla text-sm text-white/60">
                        ভিডিও দেখতে হলে আগে রেকর্ডিংটি কিনুন। কেনার পর সব ভিডিও এখানেই
                        আনলক হয়ে যাবে।
                    </p>
                    <Link
                        href={`/bootcamp/${bootcamp.slug}`}
                        className="mt-6 inline-block rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla font-bold text-black"
                    >
                        <ArrowLeft className="mr-1 inline h-4 w-4" />
                        বুটক্যাম্প পেজে ফিরুন — ৳{bootcamp.recordedPrice}
                    </Link>
                </div>
            </main>
        );
    }

    const videos = videosData?.data?.videos ?? [];
    const safeIdx = videos.length > 0 ? Math.min(activeIdx, videos.length - 1) : 0;
    const activeVideo = videos[safeIdx];

    const goTo = (idx: number) => {
        setActiveIdx(Math.max(0, Math.min(idx, videos.length - 1)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="bg-[#0a0a0b] pb-16 text-white">
            <div className="mx-auto max-w-7xl px-4 pt-6">
                <button
                    onClick={() => router.push(`/bootcamp/${bootcamp.slug}`)}
                    className="flex items-center gap-1 font-bangla text-sm text-white/55 transition hover:text-[#ffd60a]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {bootcamp.title} {bootcamp.season}
                </button>
                <h1 className="mt-2 font-bangla text-2xl font-bold sm:text-3xl">
                    রেকর্ডেড সেশন
                </h1>
                <p className="mt-1 font-bangla text-sm text-white/55">
                    {videos.length}টি ভিডিও • লাইফটাইম অ্যাক্সেস
                </p>
            </div>

            {videos.length === 0 || !activeVideo ? (
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="rounded-2xl border border-white/10 p-8 text-center">
                        <Video className="mx-auto h-8 w-8 text-white/30" />
                        <p className="mt-2 font-bangla text-sm text-white/60">
                            ভিডিও শীঘ্রই যোগ করা হবে।
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mx-auto mt-6 grid max-w-7xl gap-5 px-4 lg:grid-cols-[1fr_340px]">
                    <div>
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                            <LessonVideoPlayer
                                key={activeVideo._id}
                                url={activeVideo.videoUrl}
                                videoSource={activeVideo.videoSource}
                                videoId={activeVideo.videoId}
                                title={activeVideo.title}
                                className="rounded-none"
                            />
                        </div>
                        <p className="mt-4 font-bangla text-xs font-semibold text-white/50">
                            সেশন {safeIdx + 1} / {videos.length}
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

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                                onClick={() => goTo(safeIdx - 1)}
                                disabled={safeIdx === 0}
                                className="flex items-center gap-1 rounded-xl border border-white/15 px-4 py-2.5 font-bangla text-sm font-semibold text-white/80 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" /> আগের ভিডিও
                            </button>
                            <span className="font-bangla text-xs text-white/45">
                                {safeIdx + 1} / {videos.length}
                            </span>
                            <button
                                onClick={() => goTo(safeIdx + 1)}
                                disabled={safeIdx === videos.length - 1}
                                className="flex items-center gap-1 rounded-xl bg-[#ffd60a] px-4 py-2.5 font-bangla text-sm font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                পরের ভিডিও <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <ResourcesBlock video={activeVideo} />
                        <div className="mt-6">
                            <DetailCopyright />
                        </div>
                    </div>

                    <aside className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:sticky lg:top-20">
                        <p className="border-b border-white/10 px-4 py-3 font-bangla text-sm font-bold text-white/70">
                            প্লেলিস্ট
                        </p>
                        <div className="max-h-[60vh] divide-y divide-white/5 overflow-y-auto lg:max-h-[70vh]">
                            {videos.map((v, idx) => {
                                const isActive = idx === safeIdx;
                                return (
                                    <button
                                        key={v._id}
                                        type="button"
                                        onClick={() => goTo(idx)}
                                        aria-current={isActive}
                                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                                            isActive ? 'bg-[#ffd60a]/10' : 'hover:bg-white/5'
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
                                                {(v.resources?.length ?? 0) > 0
                                                    ? ` • ${v.resources?.length} রিসোর্স`
                                                    : ''}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
}
