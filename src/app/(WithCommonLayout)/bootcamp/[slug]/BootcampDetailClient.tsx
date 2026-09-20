'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Play } from 'lucide-react';
import { useGetBootcampBySlugQuery } from '@/redux/api/bootcampApi';
import { useAuth } from '@/hooks/useAuth';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import BootcampPurchaseDialog from '../_components/BootcampPurchaseDialog';
import { DetailHero } from '../_components/detail/DetailHero';
import { DetailPainPoints } from '../_components/detail/DetailPainPoints';
import { DetailOutcomes } from '../_components/detail/DetailOutcomes';
import { DetailMentor } from '../_components/detail/DetailMentor';
import { DetailCurriculum } from '../_components/detail/DetailCurriculum';
import { DetailValueCard } from '../_components/detail/DetailValueCard';
import { DetailTestimonials } from '../_components/detail/DetailTestimonials';
import { DetailFaq } from '../_components/detail/DetailFaq';
import { DetailStickyBar } from '../_components/detail/DetailStickyBar';
import { toast } from 'sonner';

export default function BootcampDetailClient() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
    const { data, isLoading, error } = useGetBootcampBySlugQuery(slug, { skip: !slug });
    const { user } = useAuth();
    const [purchaseOpen, setPurchaseOpen] = useState(false);

    const hasPurchased = Boolean((data?.data as { hasPurchased?: boolean } | undefined)?.hasPurchased);

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
    const watchUrl = `/bootcamp/${bootcamp.slug}/watch`;

    const handleBuy = () => {
        if (!user) {
            router.push(`/auth?mode=register&redirect_url=${encodeURIComponent(`/bootcamp/${bootcamp.slug}`)}`);
            return;
        }
        setPurchaseOpen(true);
    };

    return (
        <main className="bg-[#0a0a0b] pb-20 text-white lg:pb-0">
            <DetailHero bootcamp={bootcamp} hasPurchased={hasPurchased} onBuy={handleBuy} watchUrl={watchUrl} />

            {hasPurchased ? (
                <section className="mx-auto max-w-6xl px-4 py-6">
                    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#ffd60a]/25 bg-[#ffd60a]/[0.06] p-6 sm:flex-row sm:items-center">
                        <div>
                            <p className="font-bangla text-lg font-bold">
                                আপনার রেকর্ডিং আনলক হয়ে গেছে
                            </p>
                            <p className="mt-1 font-bangla text-sm text-white/60">
                                {bootcamp.lessonsCount > 0
                                    ? `${bootcamp.lessonsCount}টি ভিডিও ও প্রতিটা সেশনের রিসোর্স দেখুন`
                                    : 'সব ভিডিও ও রিসোর্স দেখুন'}
                            </p>
                        </div>
                        <Link
                            href={watchUrl}
                            className="shrink-0 rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-base font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
                        >
                            <Play className="mr-1 inline h-4 w-4" /> ক্লাসরুমে যান
                        </Link>
                    </div>
                </section>
            ) : null}

            <DetailPainPoints items={bootcamp.painPoints} />

            {bootcamp.perks && bootcamp.perks.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <p className="font-bangla text-sm font-semibold text-[#ffd60a]">অন্তর্ভুক্ত</p>
                    <h2 className="mt-1 font-bangla text-2xl font-bold sm:text-3xl">যা যা পাচ্ছেন</h2>
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

            <DetailOutcomes outcomes={bootcamp.outcomes} audience={bootcamp.audience} />

            <DetailMentor mentor={bootcamp.mentor} />

            <DetailCurriculum items={bootcamp.schedule} />

            <DetailTestimonials items={bootcamp.testimonials} />

            <DetailValueCard bootcamp={bootcamp} hasPurchased={hasPurchased} onBuy={handleBuy} watchUrl={watchUrl} />

            <DetailFaq items={bootcamp.faq} />

            {!hasPurchased ? <DetailStickyBar bootcamp={bootcamp} hasPurchased={hasPurchased} onBuy={handleBuy} watchUrl={watchUrl} /> : null}

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
