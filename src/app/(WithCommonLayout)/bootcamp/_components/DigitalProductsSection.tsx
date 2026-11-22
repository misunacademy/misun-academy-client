'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    Sparkles,
    CheckCircle2,
    Zap,
    ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useAuth } from '@/hooks/useAuth';
import {
    DigitalProduct,
    useGetPublishedDigitalProductsQuery,
} from '@/redux/api/digitalProductApi';
import { DigitalProductCheckoutDialog } from './DigitalProductCheckoutDialog';
import { DigitalProductSuccessDialog } from './DigitalProductSuccessDialog';

interface DigitalProductsSectionProps {
    showSeeMore?: boolean;
    title?: string;
    subtitle?: string;
}

export function DigitalProductsSection({
    showSeeMore = true,
    title = 'ফটোশপ ও ইলাস্ট্রেটর শর্টকাট স্ক্রিপ্ট প্যাক',
    subtitle = 'ডিজাইনের কাজ দ্রুত ও নির্ভুল করার জন্য প্রস্তুতকৃত রেডিমেড অটোমেশন স্ক্রিপ্ট কোড। সাথে রয়েছে বাংলায় স্টেপ-বাই-স্টেপ ইনস্টলেশন গাইড (PDF)।',
}: DigitalProductsSectionProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    const { data, isLoading } = useGetPublishedDigitalProductsQuery();
    const products = data?.data ?? [];

    const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    // Manual (PhonePe) submissions open the dialog from local state, while the
    // SSLCommerz return opens it straight from the URL — so the query string is
    // derived during render instead of being copied into state inside an effect.
    const [manualOrderNumber, setManualOrderNumber] = useState<string | null>(null);

    const digitalPayment = searchParams.get('digitalPayment');
    const isPaymentSuccess = digitalPayment === 'success';
    const successOpen = manualOrderNumber !== null || isPaymentSuccess;
    const successOrderId = manualOrderNumber ?? searchParams.get('orderId') ?? undefined;
    const successToken = manualOrderNumber !== null ? undefined : searchParams.get('token') ?? undefined;
    const isManualPending = manualOrderNumber !== null;

    useEffect(() => {
        if (digitalPayment === 'success') {
            toast.success('পেমেন্ট সফল হয়েছে! ফাইল ডাউনলোড করুন।');
        } else if (digitalPayment === 'failed') {
            toast.error('পেমেন্ট সফল হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
        }
    }, [digitalPayment]);

    const handleOpenCheckout = (product: DigitalProduct) => {
        if (!user) {
            toast.info('প্রোডাক্ট কেনার জন্য অনুগ্রহ করে প্রথমে লগইন করুন');
            router.push(`/auth?mode=login&redirect_url=${encodeURIComponent(pathname || '/digital-products')}`);
            return;
        }
        setSelectedProduct(product);
        setCheckoutOpen(true);
    };

    const handleManualSuccess = (orderNumber: string) => {
        setManualOrderNumber(orderNumber);
    };

    if (isLoading || products.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#111115] via-[#0d0d10] to-[#09090b] py-20">
            {/* Background Glow Accents */}
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[700px] rounded-full bg-[#ffd60a]/5 blur-[120px]" />
            <div className="pointer-events-none absolute right-10 top-1/3 h-72 w-72 rounded-full bg-purple-500/5 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd60a]/30 bg-[#ffd60a]/10 px-4 py-1.5 text-xs font-bold text-[#ffd60a] shadow-[0_0_15px_rgba(255,214,10,0.15)]">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>স্পেশাল প্রোডাক্টিভিটি অ্যাড-অন ও রিসোর্স</span>
                    </div>

                    <h2 className="mt-4 font-bangla text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {title.includes('শর্টকাট স্ক্রিপ্ট প্যাক') ? (
                            <>
                                ফটোশপ ও ইলাস্ট্রেটর <span className="text-[#ffd60a]">শর্টকাট স্ক্রিপ্ট প্যাক</span>
                            </>
                        ) : (
                            title
                        )}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl font-bangla text-base text-white/70 sm:text-lg">
                        {subtitle}
                    </p>
                </div>

                {/* Products Slider (Carousel) */}
                <div className="mt-12">
                    <Carousel
                        opts={{
                            loop: products.length > 3,
                            align: 'start',
                        }}
                        className="w-full cursor-grab active:cursor-grabbing"
                    >
                        <CarouselContent className="-ml-4 sm:-ml-6 py-4">
                            {products.map((product) => {
                                const bdtPrice = product.discountPriceBDT ?? product.priceBDT;
                                const inrPrice = product.discountPriceINR ?? product.priceINR;
                                const hasBdtDiscount = Boolean(product.discountPriceBDT);
                                const hasInrDiscount = Boolean(product.discountPriceINR);
                                const isBundle = product.software === 'bundle';

                                return (
                                    <CarouselItem
                                        key={product._id}
                                        className="pl-4 sm:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                                    >
                                        <div
                                            className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                                                isBundle
                                                    ? 'border-[#ffd60a]/50 bg-gradient-to-b from-[#1a1a20] to-[#121216] shadow-[0_0_30px_rgba(255,214,10,0.1)]'
                                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            {/* Top Badge & Header */}
                                            <div className="p-6 sm:p-7">
                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        variant="outline"
                                                        className={`font-mono text-xs font-bold uppercase tracking-wider ${
                                                            product.software === 'photoshop'
                                                                ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                                                                : product.software === 'illustrator'
                                                                  ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                                                                  : 'border-yellow-500/50 bg-[#ffd60a]/15 text-[#ffd60a]'
                                                        }`}
                                                    >
                                                        {product.software === 'bundle'
                                                            ? 'Ps + Ai Bundle'
                                                            : product.software}
                                                    </Badge>

                                                    {product.badge && (
                                                        <span className="rounded-full bg-[#ffd60a] px-3 py-1 font-bangla text-xs font-bold text-black shadow-sm">
                                                            {product.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="mt-4 font-bangla text-xl font-bold text-white transition group-hover:text-[#ffd60a]">
                                                    {product.title}
                                                </h3>

                                                {product.tagline && (
                                                    <p className="mt-2 font-bangla text-xs leading-relaxed text-white/60">
                                                        {product.tagline}
                                                    </p>
                                                )}

                                                {/* Thumbnail */}
                                                {product.thumbnail && (
                                                    <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            width={600}
                                                            height={340}
                                                            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>
                                                )}

                                                {/* Features List */}
                                                {product.features && product.features.length > 0 && (
                                                    <ul className="mt-6 space-y-2.5">
                                                        {product.features.map((feat, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-start gap-2.5 font-bangla text-xs text-white/80"
                                                            >
                                                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd60a]" />
                                                                <span>{feat}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Bottom Pricing & CTA */}
                                            <div className="mt-auto border-t border-white/10 bg-white/[0.01] p-6 sm:p-7">
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <div className="text-[11px] font-bangla text-white/50">
                                                            মূল্য (বাংলাদেশ):
                                                        </div>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="font-mona text-2xl font-bold text-emerald-400">
                                                                ৳{bdtPrice}
                                                            </span>
                                                            {hasBdtDiscount && (
                                                                <span className="font-mona text-xs text-white/40 line-through">
                                                                    ৳{product.priceBDT}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-[11px] font-bangla text-amber-300/70">
                                                            🇮🇳 ভারত (PhonePe):
                                                        </div>
                                                        <div className="flex items-baseline justify-end gap-1.5">
                                                            <span className="font-mona text-lg font-bold text-amber-300">
                                                                ₹{inrPrice}
                                                            </span>
                                                            {hasInrDiscount && (
                                                                <span className="font-mona text-xs text-white/40 line-through">
                                                                    ₹{product.priceINR}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleOpenCheckout(product)}
                                                    className={`mt-5 w-full py-5 font-bangla text-sm font-bold transition ${
                                                        isBundle
                                                            ? 'bg-[#ffd60a] text-black shadow-lg shadow-[#ffd60a]/20 hover:bg-[#ffd60a]/90'
                                                            : 'bg-white/10 text-white hover:bg-white/20'
                                                    }`}
                                                >
                                                    <Zap className="mr-2 h-4 w-4" /> এখনই সংগ্রহ করুন
                                                </Button>

                                                <div className="mt-3 flex items-center justify-center gap-3 text-[10px] font-bangla text-white/40">
                                                    <span>• ইনস্ট্যান্ট ডাউনলোড</span>
                                                    <span>• লাইফটাইম এক্সেস</span>
                                                    <span>• ফুল সাপোর্ট</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>

                        {/* Navigation Arrows */}
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <CarouselPrevious className="static left-auto top-auto h-11 w-11 translate-y-0 rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:border-[#ffd60a] hover:bg-[#ffd60a] hover:text-black" />
                            <CarouselNext className="static right-auto top-auto h-11 w-11 translate-y-0 rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:border-[#ffd60a] hover:bg-[#ffd60a] hover:text-black" />
                        </div>
                    </Carousel>
                </div>

                {/* See More Button */}
                {showSeeMore && (
                    <div className="mt-12 flex justify-center">
                        <Link
                            href="/digital-products"
                            className="group inline-flex items-center gap-2.5 rounded-2xl border border-[#ffd60a]/40 bg-[#ffd60a]/10 px-8 py-3.5 font-bangla text-base font-bold text-[#ffd60a] shadow-[0_0_20px_rgba(255,214,10,0.12)] transition-all duration-300 hover:scale-105 hover:bg-[#ffd60a] hover:text-black hover:shadow-[0_0_30px_rgba(255,214,10,0.3)]"
                        >
                            <span>আরও ডিজিটাল প্রোডাক্ট দেখুন</span>
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                )}
            </div>

            {/* Checkout Dialog */}
            <DigitalProductCheckoutDialog
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                product={selectedProduct}
                onSuccessManual={handleManualSuccess}
            />

            {/* Success / Download Dialog */}
            <DigitalProductSuccessDialog
                open={successOpen}
                onClose={() => {
                    setManualOrderNumber(null);
                    if (searchParams.get('digitalPayment')) {
                        router.replace(pathname || '/digital-products', { scroll: false });
                    }
                }}
                orderId={successOrderId}
                downloadToken={successToken}
                isManualPending={isManualPending}
            />
        </section>
    );
}
