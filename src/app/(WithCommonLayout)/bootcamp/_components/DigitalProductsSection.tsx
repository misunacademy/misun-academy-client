'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    Sparkles,
    ArrowRight,
} from 'lucide-react';
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
import { DigitalProductCard } from './DigitalProductCard';
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
                            {products.map((product) => (
                                <CarouselItem
                                    key={product._id}
                                    className="pl-4 sm:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                                >
                                    <DigitalProductCard
                                        product={product}
                                        onBuy={handleOpenCheckout}
                                    />
                                </CarouselItem>
                            ))}
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
