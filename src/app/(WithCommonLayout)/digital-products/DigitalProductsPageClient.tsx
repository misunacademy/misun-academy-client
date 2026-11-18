'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import {
    Sparkles,
    CheckCircle2,
    Zap,
    Search,
    FileCode,
    ShieldCheck,
    Download,
    Headphones,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
    DigitalProduct,
    useGetPublishedDigitalProductsQuery,
} from '@/redux/api/digitalProductApi';
import { DigitalProductCheckoutDialog } from '../bootcamp/_components/DigitalProductCheckoutDialog';
import { DigitalProductSuccessDialog } from '../bootcamp/_components/DigitalProductSuccessDialog';

export default function DigitalProductsPageClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const { data, isLoading } = useGetPublishedDigitalProductsQuery();
    const products = useMemo(() => data?.data ?? [], [data]);

    const [selectedCategory, setSelectedCategory] = useState<'all' | 'photoshop' | 'illustrator' | 'bundle'>('all');
    const [searchQuery, setSearchQuery] = useState('');

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
            router.push(`/auth?mode=login&redirect_url=${encodeURIComponent('/digital-products')}`);
            return;
        }
        setSelectedProduct(product);
        setCheckoutOpen(true);
    };

    const handleManualSuccess = (orderNumber: string) => {
        setManualOrderNumber(orderNumber);
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesCat =
                selectedCategory === 'all' ||
                p.software.toLowerCase() === selectedCategory.toLowerCase();
            const matchesQuery =
                !searchQuery.trim() ||
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
                p.software.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesQuery;
        });
    }, [products, selectedCategory, searchQuery]);

    const counts = useMemo(() => ({
        all: products.length,
        photoshop: products.filter((p) => p.software === 'photoshop').length,
        illustrator: products.filter((p) => p.software === 'illustrator').length,
        bundle: products.filter((p) => p.software === 'bundle').length,
    }), [products]);

    return (
        <div className="relative min-h-screen bg-[#09090b] text-white">
            {/* Background Glows */}
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#ffd60a]/5 blur-[140px]" />
            <div className="pointer-events-none absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd60a]/30 bg-[#ffd60a]/10 px-4 py-1.5 text-xs font-bold text-[#ffd60a] shadow-[0_0_20px_rgba(255,214,10,0.15)]">
                        <Sparkles className="h-4 w-4" />
                        <span>ডিজিটাল প্রোডাক্টস ও স্ক্রিপ্ট রিসোর্স</span>
                    </div>

                    <h1 className="mt-5 font-bangla text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        ফটোশপ ও ইলাস্ট্রেটর <br />
                        <span className="text-[#ffd60a]">শর্টকাট স্ক্রিপ্ট কালেকশন</span>
                    </h1>

                    <p className="mt-4 font-bangla text-base leading-relaxed text-white/70 sm:text-lg">
                        ডিজাইন ও ফ্রিল্যান্সিং কাজে কয়েক ঘণ্টার পুনরাবৃত্তিমূলক কাজ শেষ করুন মাত্র ১-ক্লিকে।
                        রেডিমেড স্ক্রিপ্ট, অ্যাকশন এবং বাংলায় স্টেপ-বাই-স্টেপ ইনস্টলেশন গাইড (PDF)।
                    </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-xl px-4 py-2 font-bangla text-xs font-bold transition-all ${
                                selectedCategory === 'all'
                                    ? 'bg-[#ffd60a] text-black shadow-md shadow-[#ffd60a]/20'
                                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            সব প্রোডাক্ট ({counts.all})
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedCategory('photoshop')}
                            className={`rounded-xl px-4 py-2 font-bangla text-xs font-bold transition-all ${
                                selectedCategory === 'photoshop'
                                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            Photoshop ({counts.photoshop})
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedCategory('illustrator')}
                            className={`rounded-xl px-4 py-2 font-bangla text-xs font-bold transition-all ${
                                selectedCategory === 'illustrator'
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            Illustrator ({counts.illustrator})
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedCategory('bundle')}
                            className={`rounded-xl px-4 py-2 font-bangla text-xs font-bold transition-all ${
                                selectedCategory === 'bundle'
                                    ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            কম্বো প্যাক ({counts.bundle})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="স্ক্রিপ্ট বা সফটওয়্যার খুঁজুন..."
                            className="border-white/10 bg-white/5 pl-9 text-xs font-bangla text-white placeholder:text-white/40 focus:border-[#ffd60a]"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffd60a] border-t-transparent" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredProducts.length === 0 && (
                    <div className="my-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                        <FileCode className="mx-auto h-12 w-12 text-white/30" />
                        <h3 className="mt-4 font-bangla text-lg font-bold text-white">কোনো প্রোডাক্ট পাওয়া যায়নি</h3>
                        <p className="mt-1 font-bangla text-xs text-white/50">
                            আপনার সার্চ বা ফিল্টারের সাথে মিল রেখে কোনো স্ক্রিপ্ট খুঁজে পাওয়া যায়নি।
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedCategory('all');
                                setSearchQuery('');
                            }}
                            className="mt-4 border-white/20 text-xs font-bangla text-white hover:bg-white/10"
                        >
                            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> ফিল্টার রিসেট করুন
                        </Button>
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && filteredProducts.length > 0 && (
                    <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product) => {
                            const bdtPrice = product.discountPriceBDT ?? product.priceBDT;
                            const inrPrice = product.discountPriceINR ?? product.priceINR;
                            const hasBdtDiscount = Boolean(product.discountPriceBDT);
                            const hasInrDiscount = Boolean(product.discountPriceINR);
                            const isBundle = product.software === 'bundle';

                            return (
                                <div
                                    key={product._id}
                                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 ${
                                        isBundle
                                            ? 'border-[#ffd60a]/50 bg-gradient-to-b from-[#1a1a20] to-[#121216] shadow-[0_0_30px_rgba(255,214,10,0.12)]'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {/* Top Content */}
                                    <div className="p-7">
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
                                    <div className="mt-auto border-t border-white/10 bg-white/[0.01] p-7">
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
                            );
                        })}
                    </div>
                )}

                {/* Features & Benefits Banner */}
                <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.01] p-8 sm:p-12">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 font-bangla text-center sm:text-left">
                        <div className="space-y-2">
                            <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ffd60a]/30 bg-[#ffd60a]/10 text-[#ffd60a]">
                                <Download className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-base text-white">তাৎক্ষণিক ডাউনলোড</h4>
                            <p className="text-xs text-white/60 leading-relaxed">
                                পেমেন্ট সম্পন্ন হওয়ার সাথে সাথে স্ক্রিপ্ট ফাইল ও গাইড PDF ডাউনলোড করতে পারবেন।
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-base text-white">১০০% ভেরিফাইড কোড</h4>
                            <p className="text-xs text-white/60 leading-relaxed">
                                ফটোশপ ও ইলাস্ট্রেটরের সাম্প্রতিক সব সংস্করণে পুঙ্খানুপুঙ্খ টেস্ট করা ও নিরাপদ।
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-base text-white">লাইফটাইম অ্যাক্সেস</h4>
                            <p className="text-xs text-white/60 leading-relaxed">
                                আপনার প্রোফাইলের &apos;Tools &amp; Scripts&apos; ট্যাব থেকে যেকোনো সময় অ্যাক্সেস করতে পারবেন।
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                                <Headphones className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-base text-white">ইনস্টলেশন সাপোর্ট</h4>
                            <p className="text-xs text-white/60 leading-relaxed">
                                সেটআপ বা ব্যবহারে কোনো সমস্যায় আমাদের সাপোর্ট টিম সরাসরি সহায়তা করবে।
                            </p>
                        </div>
                    </div>
                </div>
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
                        router.replace('/digital-products', { scroll: false });
                    }
                }}
                orderId={successOrderId}
                downloadToken={successToken}
                isManualPending={isManualPending}
            />
        </div>
    );
}
