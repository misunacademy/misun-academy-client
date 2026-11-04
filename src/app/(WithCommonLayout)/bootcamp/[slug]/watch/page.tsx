import { Suspense } from 'react';
import { headers } from 'next/headers';
import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import { env } from '@/lib/env';
import BootcampWatchClient from './BootcampWatchClient';
import BootcampWatchLoading from './loading';

type BootcampData = {
    title?: string;
    season?: string;
    tagline?: string;
    description?: string;
    posterImage?: string;
    thumbnail?: string;
    liveFee?: number;
    recordedPrice?: number;
    lessonsCount?: number;
    durationMinutes?: number;
};

async function fetchBootcamp(slug: string): Promise<BootcampData | null> {
    try {
        const res = await fetch(`${env.NEXT_PUBLIC_BASE_API_URL}/bootcamp/slug/${slug}`, {
            cache: 'no-store',
            headers: { Accept: 'application/json' },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    "use cache";

    const resolvedParams = await params;
    const slug = typeof resolvedParams.slug === 'string' ? resolvedParams.slug : Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : '';
    const bootcamp = await fetchBootcamp(slug);

    const title = bootcamp?.title
        ? `${bootcamp.title} ${bootcamp.season || ''} — রেকর্ডেড সেশন | MISUN Academy`.trim()
        : 'রেকর্ডেড সেশন দেখুন | MISUN Academy';

    const description = bootcamp?.description || bootcamp?.tagline
        ? `একবার কিনলেই লাইফটাইম অ্যাক্সেস। ${bootcamp.tagline || bootcamp.description}`
        : 'আপনার কেনা বুটক্যাম্প রেকর্ডিং দেখুন — ভিডিও প্লেলিস্ট ও প্রতিটা সেশনের রিসোর্সসহ।';

    const keywords = [
        'Bootcamp Recording',
        'MISUN Academy',
        'বুটক্যাম্প রেকর্ডিং',
        bootcamp?.title,
        bootcamp?.season,
    ].filter(Boolean);

    const image = bootcamp?.posterImage || bootcamp?.thumbnail;

    return genMeta({
        title,
        description,
        keywords: keywords as string[],
        slug: `bootcamp/${slug}`,
        image: image ? String(image) : undefined,
    });
}

async function MetadataMarker() {
    await headers();
    return null;
}

export default function Page() {
    return (
        <Suspense fallback={<BootcampWatchLoading />}>
            <MetadataMarker />
            <BootcampWatchClient />
        </Suspense>
    );
}
