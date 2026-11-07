'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Play, XCircle } from 'lucide-react';
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
import BootcampDetailLoading from './loading';

type PaymentModalType = 'success' | 'error' | 'failed';

function PaymentModal({
    type,
    onClose,
    onPrimary,
    secondaryLabel,
    onSecondary,
}: {
    type: PaymentModalType;
    onClose: () => void;
    onPrimary: () => void;
    secondaryLabel?: string;
    onSecondary?: () => void;
}) {
    const previouslyFocused = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const focusableRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        previouslyFocused.current = document.activeElement as HTMLElement | null;
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>('button, a, [tabindex]');
        firstFocusable?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            e.preventDefault();
            firstFocusable?.focus();
        };

        const modalNode = modalRef.current;
        modalNode?.addEventListener('keydown', handleKeyDown);
        return () => {
            modalNode?.removeEventListener('keydown', handleKeyDown);
            previouslyFocused.current?.focus?.({ preventScroll: true });
        };
    }, [type]);

    const iconColor = type === 'success' ? '#22c55e' : '#f43f5e';
    const Icon = type === 'success' ? CheckCircle2 : XCircle;

    const labels: Record<PaymentModalType, { title: string; desc: string; primary: string }> = {
        success: {
            title: 'পেমেন্ট সফল হয়েছে',
            desc: 'আপনার রেকর্ডিং আনলক হয়ে গেছে। ক্লাসরুমে যেতে নিচের বাটন চাপুন।',
            primary: 'ক্লাসরুমে যান',
        },
        error: {
            title: 'পেমেন্ট যাচাই করা যায়নি',
            desc: 'সফল হলে রেকর্ডিং এখানে আনলক হবে। দয়া করে আবার চেষ্টা করুন।',
            primary: 'আবার চেষ্টা করুন',
        },
        failed: {
            title: 'পেমেন্ট ব্যর্থ হয়েছে',
            desc: 'পেমেন্ট সফল হয়নি। আবার চেষ্টা করুন।',
            primary: 'আবার চেষ্টা করুন',
        },
    };

    const { title, desc, primary } = labels[type];

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div className="max-w-md w-full rounded-[2rem] border border-white/10 bg-surface-darker p-8 shadow-2xl text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <h2 className="mt-6 font-bangla text-lg font-bold text-white">{title}</h2>
                <p className="mt-2 font-bangla text-sm text-white/60">{desc}</p>
                <div className="mt-8">
                    <button
                        ref={focusableRef}
                        onClick={() => {
                            onClose();
                            onPrimary();
                        }}
                        className="inline-block rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.35)] hover:scale-[1.02]"
                    >
                        {primary}
                    </button>
                    {secondaryLabel && onSecondary && (
                        <button
                            onClick={onSecondary}
                            className="inline-block mt-4 sm:mt-0 sm:ml-3 rounded-xl border border-white/10 px-6 py-3 font-bangla font-bold text-white/90 hover:bg-white/5"
                        >
                            {secondaryLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

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
        if (!paymentResult || isLoading) return;
        const remaining = searchParams.toString().replace(/(^|&)payment=[^&]*/g, '');
        void router.replace(`/bootcamp/${slug}${remaining ? `?${remaining}` : ''}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentResult, isLoading, hasPurchased]);

    const paymentModal: PaymentModalType | null =
        paymentResult === 'success' ? (hasPurchased ? 'success' : 'error') :
            paymentResult === 'failed' ? 'failed' : null;
    const handlePaymentClose = useCallback(() => {
        void router.replace(`/bootcamp/${slug}`);
    }, [router, slug]);

    if (isLoading) {
        return (
            <BootcampDetailLoading />
        );
    }

    if (error || !data?.data) {
        return (
            <div className="bg-surface-darker">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                    <p className="font-bangla text-xl text-white/70">বুটক্যাম্প পাওয়া যায়নি।</p>
                    <Link href="/bootcamp" className="mt-6 inline-block rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla font-bold text-black">
                        সব বুটক্যাম্প দেখুন
                    </Link>
                </div>
            </div>
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
        <div className="bg-surface-darker pb-20 text-white lg:pb-0">
            <DetailHero bootcamp={bootcamp} hasPurchased={hasPurchased} onBuy={handleBuy} watchUrl={watchUrl} />

            {hasPurchased ? (
                <section className="mx-auto max-w-7xl px-4 py-6">
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
                <section className="mx-auto max-w-7xl px-4 py-10">
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
            {paymentModal === 'success' && (
                <PaymentModal
                    type="success"
                    onClose={handlePaymentClose}
                    onPrimary={() => router.push(watchUrl)}
                />
            )}
            {paymentModal === 'error' && (
                <PaymentModal
                    type="error"
                    onClose={handlePaymentClose}
                    onPrimary={() => router.replace(`/bootcamp/${slug}`)}
                />
            )}
            {paymentModal === 'failed' && (
                <PaymentModal
                    type="failed"
                    onClose={handlePaymentClose}
                    onPrimary={() => router.replace(`/bootcamp/${slug}`)}
                    secondaryLabel="বন্ধ করুন"
                    onSecondary={handlePaymentClose}
                />
            )}
            <BreadcrumbJsonLd />
        </div>
    );
}
