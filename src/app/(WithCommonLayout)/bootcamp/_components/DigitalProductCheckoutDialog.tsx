'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/api-helpers';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    CheckCircle2,
    Copy,
    CreditCard,
    FileCode,
    FileText,
    Gift,
    Loader2,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { phonePe } from '@/assets/images';
import {
    DigitalProduct,
    useClaimFreeDigitalProductMutation,
    useInitiateDigitalProductSSLMutation,
    useSubmitDigitalProductPhonePeMutation,
} from '@/redux/api/digitalProductApi';
import {
    getEffectiveBdtPrice,
    getEffectiveInrPrice,
    hasBdtDiscount,
    hasInrDiscount,
    isBdtFree,
    isFullyFree,
    isInrFree,
} from '@/lib/digitalProductPricing';

interface DigitalProductCheckoutDialogProps {
    open: boolean;
    onClose: () => void;
    product: DigitalProduct | null;
    onSuccessManual?: (orderNumber: string) => void;
    onSuccessFree?: (orderNumber: string, downloadToken: string) => void;
}

export function DigitalProductCheckoutDialog({
    open,
    onClose,
    product,
    onSuccessManual,
    onSuccessFree,
}: DigitalProductCheckoutDialogProps) {
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState<'sslcommerz' | 'phonepe'>('sslcommerz');

    // PhonePe Details (India)
    const [senderPhonePe, setSenderPhonePe] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [copiedNumber, setCopiedNumber] = useState(false);

    const [initiateSSL, { isLoading: isSSLLoading }] = useInitiateDigitalProductSSLMutation();
    const [submitPhonePe, { isLoading: isPhonePeLoading }] = useSubmitDigitalProductPhonePeMutation();
    const [claimFree, { isLoading: isClaimLoading }] = useClaimFreeDigitalProductMutation();

    if (!product) return null;

    const bdtAmount = getEffectiveBdtPrice(product);
    const inrAmount = getEffectiveInrPrice(product);
    const bdtFree = isBdtFree(product);
    const inrFree = isInrFree(product);
    const freeProduct = isFullyFree(product);
    const showBdtDiscount = hasBdtDiscount(product) && !bdtFree;
    const showInrDiscount = hasInrDiscount(product) && !inrFree;
    const selectedIsFree =
        freeProduct || (selectedTab === 'sslcommerz' ? bdtFree : inrFree);

    const claimCurrency: 'BDT' | 'INR' =
        selectedTab === 'sslcommerz' && bdtFree
            ? 'BDT'
            : selectedTab === 'phonepe' && inrFree
              ? 'INR'
              : bdtFree
                ? 'BDT'
                : 'INR';

    const copyPhonePeNumber = () => {
        navigator.clipboard.writeText('9123944746');
        setCopiedNumber(true);
        toast.success('PhonePe নম্বর কপি করা হয়েছে');
        setTimeout(() => setCopiedNumber(false), 2000);
    };

    const handleSSLCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('প্রোডাক্ট কেনার জন্য অনুগ্রহ করে প্রথমে লগইন করুন');
            return;
        }

        try {
            const currentPath =
                typeof window !== 'undefined'
                    ? window.location.pathname
                    : '/digital-products';

            const res = await initiateSSL({
                productId: product._id,
                name: user.name || 'Student',
                email: user.email || '',
                phone: user.phone || '',
                redirectPath: currentPath || '/digital-products',
            }).unwrap();

            if (res.data?.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                toast.error('পেমেন্ট গেটওয়ে লোড হতে ব্যর্থ হয়েছে');
            }
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Payment initiation failed'));
        }
    };

    const handlePhonePeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('প্রোডাক্ট কেনার জন্য অনুগ্রহ করে প্রথমে লগইন করুন');
            return;
        }
        if (!senderPhonePe.trim() || !transactionId.trim()) {
            toast.error('অনুগ্রহ করে আপনার PhonePe নম্বর ও Transaction ID / UTR দিন');
            return;
        }

        try {
            const res = await submitPhonePe({
                productId: product._id,
                name: user.name || 'Student',
                email: user.email || '',
                phone: user.phone || '',
                senderPhonePe: senderPhonePe.trim(),
                transactionId: transactionId.trim(),
            }).unwrap();

            toast.success('পেমেন্ট তথ্য সফলভাবে জমা হয়েছে!');
            if (onSuccessManual && res.data?.orderNumber) {
                onSuccessManual(res.data.orderNumber);
            }
            onClose();
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'পেমেন্ট সাবমিট করতে সমস্যা হয়েছে'));
        }
    };

    const handleFreeClaim = async () => {
        if (!user) {
            toast.error('প্রোডাক্ট সংগ্রহের জন্য অনুগ্রহ করে প্রথমে লগইন করুন');
            return;
        }

        try {
            const res = await claimFree({
                productId: product._id,
                name: user.name || 'Student',
                email: user.email || '',
                phone: user.phone || '',
                currency: claimCurrency,
            }).unwrap();

            if (res.data?.alreadyClaimed) {
                toast.info('আপনি ইতিমধ্যে এই ফ্রি প্রোডাক্টটি সংগ্রহ করেছেন। আপনার প্রোফাইল থেকেই ফাইলগুলো ডাউনলোড করতে পারবেন।');
            } else {
                toast.success('ফ্রি প্রোডাক্ট সফলভাবে সংগ্রহ করা হয়েছে!');
            }

            if (res.data?.orderNumber && res.data?.downloadToken && onSuccessFree) {
                onSuccessFree(res.data.orderNumber, res.data.downloadToken);
            }
            onClose();
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'ফ্রি প্রোডাক্ট সংগ্রহ করতে সমস্যা হয়েছে'));
        }
    };

    const renderPriceBlock = (currency: 'BDT' | 'INR') => {
        const isFree = currency === 'BDT' ? bdtFree : inrFree;
        const amount = currency === 'BDT' ? bdtAmount : inrAmount;
        const listPrice = currency === 'BDT' ? product.priceBDT : product.priceINR;
        const showDiscount = currency === 'BDT' ? showBdtDiscount : showInrDiscount;
        const symbol = currency === 'BDT' ? '৳' : '₹';
        const amountColor = currency === 'BDT' ? 'text-emerald-400' : 'text-amber-300';

        if (isFree) {
            return (
                <div className="text-right">
                    <span className="font-bangla text-2xl font-extrabold text-emerald-400">ফ্রি</span>
                    <p className="mt-0.5 font-bangla text-[10px] text-emerald-300/80">
                        কোনো পেমেন্ট লাগবে না
                    </p>
                </div>
            );
        }

        return (
            <div className="text-right">
                <div className="flex items-baseline justify-end gap-2">
                    {showDiscount && (
                        <span className="font-mona text-base font-semibold text-white/40 line-through decoration-red-500/80 decoration-2">
                            {symbol}
                            {listPrice.toLocaleString('bn')}
                        </span>
                    )}
                    <span className={`font-mona text-2xl font-bold ${amountColor}`}>
                        {symbol}
                        {amount.toLocaleString('bn')}
                    </span>
                </div>
                {showDiscount && listPrice > 0 && (
                    <span
                        className={`mt-0.5 inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            currency === 'BDT'
                                ? 'border-red-500/30 bg-red-500/15 text-red-400'
                                : 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                        }`}
                    >
                        {Math.round(((listPrice - amount) / listPrice) * 100).toLocaleString('bn')}% OFF
                    </span>
                )}
            </div>
        );
    };

    const freeClaimPanel = (
        <div className="space-y-4 pt-2">
            <div className="space-y-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 font-bangla text-xs text-white/75">
                <p className="flex items-center gap-1.5 font-semibold text-emerald-300">
                    <Gift className="h-4 w-4" />
                    {freeProduct
                        ? 'এই প্রোডাক্টটি সম্পূর্ণ ফ্রি!'
                        : claimCurrency === 'BDT'
                          ? 'বাংলাদেশের জন্য এই প্রোডাক্টটি ফ্রি!'
                          : 'ভারতের জন্য এই প্রোডাক্টটি ফ্রি!'}
                </p>
                <p className="leading-relaxed">
                    কোনো পেমেন্ট ছাড়াই প্রোডাক্টটি সংগ্রহ করুন। ক্লেইম করার সাথে সাথেই
                    স্ক্রিপ্ট ফাইল ও ইনস্টলেশন গাইড ডাউনলোড করতে পারবেন।
                </p>
            </div>

            <Button
                type="button"
                onClick={handleFreeClaim}
                disabled={isClaimLoading}
                className="w-full bg-emerald-500 py-5 font-bangla text-sm font-bold text-black transition hover:bg-emerald-400"
            >
                {isClaimLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Gift className="mr-2 h-4 w-4" />
                )}
                ফ্রি ডাউনলোড আনলক করুন
            </Button>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto border border-white/10 bg-[#121216] p-6 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-bangla text-xl">
                        {freeProduct ? (
                            <Gift className="h-5 w-5 text-emerald-400" />
                        ) : (
                            <Sparkles className="h-5 w-5 text-[#ffd60a]" />
                        )}
                        {freeProduct ? 'ফ্রি স্ক্রিপ্ট সংগ্রহ করুন' : 'ডিজিটাল স্ক্রিপ্ট সংগ্রহ করুন'}
                    </DialogTitle>
                </DialogHeader>

                {/* Product Summary Box */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 font-bangla">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#ffd60a]">
                                {product.software}
                            </span>
                            <h3 className="mt-1 text-base font-bold text-white">{product.title}</h3>
                        </div>
                        <div className="shrink-0">
                            {renderPriceBlock(selectedTab === 'sslcommerz' ? 'BDT' : 'INR')}
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                        <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1">
                            <FileCode className="h-3.5 w-3.5 text-[#ffd60a]" />
                            {product.scriptFile?.fileName}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1">
                            <FileText className="h-3.5 w-3.5 text-emerald-400" />
                            ইনস্টলেশন গাইড (PDF)
                        </span>
                    </div>
                </div>

                {/* Payment Method Selector — hidden entirely when both regions are free */}
                {!freeProduct && (
                    <div className="space-y-3 pt-2">
                        <h4 className="font-bangla text-xs font-semibold text-white/80">
                            পেমেন্ট মেথড নির্বাচন করুন:
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedTab('sslcommerz')}
                                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                                    selectedTab === 'sslcommerz'
                                        ? bdtFree
                                            ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                            : 'border-[#ffd60a] bg-[#ffd60a]/10 shadow-[0_0_15px_rgba(255,214,10,0.15)]'
                                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                }`}
                            >
                                {bdtFree ? (
                                    <Gift className="h-6 w-6 text-emerald-400" />
                                ) : (
                                    <CreditCard className="h-6 w-6 text-[#ffd60a]" />
                                )}
                                <span className="mt-2 font-bangla text-xs font-bold text-white">
                                    {bdtFree ? 'বাংলাদেশ (ফ্রি)' : 'SSLCommerz'}
                                </span>
                                <span className="font-bangla text-[10px] text-white/60">
                                    {bdtFree
                                        ? 'কোনো পেমেন্ট লাগবে না'
                                        : `কার্ড / বিকাশ / নগদ (৳${bdtAmount.toLocaleString('bn')})`}
                                </span>
                                <span
                                    className={`mt-1 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                                        bdtFree
                                            ? 'bg-emerald-500/20 text-emerald-300'
                                            : 'bg-emerald-500/20 text-emerald-400'
                                    }`}
                                >
                                    {bdtFree ? 'ফ্রি ক্লেইম' : 'ইনস্ট্যান্ট এক্সেস'}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedTab('phonepe')}
                                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                                    selectedTab === 'phonepe'
                                        ? inrFree
                                            ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                            : 'border-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                }`}
                            >
                                {inrFree ? (
                                    <Gift className="h-6 w-6 text-emerald-400" />
                                ) : (
                                    <div className="relative h-6 w-16">
                                        <Image src={phonePe} alt="PhonePe" fill className="object-contain" />
                                    </div>
                                )}
                                <span className="mt-2 font-bangla text-xs font-bold text-white">
                                    {inrFree ? 'ভারত (ফ্রি)' : 'ম্যানুয়াল পেমেন্ট'}
                                </span>
                                <span
                                    className={`font-bangla text-[10px] ${
                                        inrFree ? 'text-white/60' : 'text-amber-300'
                                    }`}
                                >
                                    {inrFree
                                        ? 'কোনো পেমেন্ট লাগবে না'
                                        : `🇮🇳 ভারতীয়দের জন্য (₹${inrAmount.toLocaleString('bn')})`}
                                </span>
                                <span
                                    className={`mt-1 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                                        inrFree
                                            ? 'bg-emerald-500/20 text-emerald-300'
                                            : 'bg-purple-500/20 text-purple-300'
                                    }`}
                                >
                                    {inrFree ? 'ফ্রি ক্লেইম' : 'PhonePe UPI'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Form based on selected tab */}
                {selectedIsFree ? (
                    freeClaimPanel
                ) : selectedTab === 'sslcommerz' ? (
                    <form onSubmit={handleSSLCheckout} className="space-y-4 pt-2">
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs font-bangla text-white/70 space-y-2">
                            <p className="flex items-center gap-1.5 text-white/90 font-semibold">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                নিরাপদ অনলাইন পেমেন্ট (SSLCommerz)
                            </p>
                            <p>
                                আপনি বিকাশ, নগদ, রকেট, ডেবিট/ক্রেডিট কার্ডের মাধ্যমে সরাসরি পেমেন্ট করতে পারবেন। পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই ডাউনলোড লিংক আনলক হবে এবং আপনার ইমেইলে পাঠিয়ে দেওয়া হবে।
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSSLLoading}
                            className="w-full bg-[#ffd60a] py-5 font-bangla text-sm font-bold text-black transition hover:bg-[#ffd60a]/90"
                        >
                            {isSSLLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CreditCard className="mr-2 h-4 w-4" />
                            )}
                            ৳{bdtAmount.toLocaleString("bn")} টাকা পেমেন্ট করুন
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handlePhonePeSubmit} className="space-y-4 pt-2">
                        <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 space-y-3 font-bangla text-xs">
                            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                                <span className="text-white/70">প্রাপকের নাম:</span>
                                <span className="font-bold text-white">Khokon Sarkar</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                                <span className="text-white/70">PhonePe নম্বর:</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-bold text-amber-300">+91 9123944746</span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={copyPhonePeNumber}
                                        className="h-7 w-7 p-0 text-white/70 hover:text-white"
                                    >
                                        {copiedNumber ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/70">পাঠানোর পরিমাণ:</span>
                                <span className="font-mona text-base font-bold text-amber-300">₹{inrAmount.toLocaleString("bn")} INR</span>
                            </div>
                            <p className="text-[11px] text-white/50 pt-1">
                                * অনুগ্রহ করে PhonePe অ্যাপ থেকে উপরের নম্বরে ₹{inrAmount.toLocaleString("bn")} সেন্ড মানি করুন। এরপর নিচের বক্সে আপনার PhonePe নম্বর ও Transaction ID দিয়ে সাবমিট করুন।
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="font-bangla text-[11px] text-white/70">
                                    আপনার PhonePe নম্বর / UPI ID *
                                </label>
                                <Input
                                    value={senderPhonePe}
                                    onChange={(e) => setSenderPhonePe(e.target.value)}
                                    placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                                    required
                                    className="border-white/10 bg-white/5 text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="font-bangla text-[11px] text-white/70">
                                    PhonePe Transaction ID / UTR *
                                </label>
                                <Input
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="T2411... বা UTR নম্বর"
                                    required
                                    className="border-white/10 bg-white/5 text-xs text-white"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPhonePeLoading}
                            className="w-full bg-purple-600 py-5 font-bangla text-sm font-bold text-white transition hover:bg-purple-500"
                        >
                            {isPhonePeLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                            )}
                            অর্ডার নিশ্চিত করুন (₹{inrAmount})
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
