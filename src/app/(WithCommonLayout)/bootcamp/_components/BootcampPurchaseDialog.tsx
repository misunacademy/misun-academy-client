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
    Loader2,
    ShieldCheck,
    Sparkles,
    Video,
} from 'lucide-react';
import { phonePe } from '@/assets/images';
import {
    useInitiateBootcampSSLCommerzMutation,
    useSubmitBootcampPhonePeManualMutation,
} from '@/redux/api/bootcampApi';

interface BootcampPurchaseDialogProps {
    open: boolean;
    onClose: () => void;
    slug: string;
    title: string;
    price: number;
    priceINR?: number;
}

export default function BootcampPurchaseDialog({
    open,
    onClose,
    slug,
    title,
    price,
    priceINR,
}: BootcampPurchaseDialogProps) {
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState<'sslcommerz' | 'phonepe'>('sslcommerz');

    // PhonePe Details (India)
    const [senderPhonePe, setSenderPhonePe] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [copiedNumber, setCopiedNumber] = useState(false);

    const [initiateSSL, { isLoading: isSSLLoading }] = useInitiateBootcampSSLCommerzMutation();
    const [submitPhonePe, { isLoading: isPhonePeLoading }] = useSubmitBootcampPhonePeManualMutation();

    const bdtAmount = price;
    const inrAmount = priceINR && priceINR > 0 ? priceINR : Math.round(price * 0.75);

    const copyPhonePeNumber = () => {
        navigator.clipboard.writeText('9123944746');
        setCopiedNumber(true);
        toast.success('PhonePe নম্বর কপি করা হয়েছে');
        setTimeout(() => setCopiedNumber(false), 2000);
    };

    const handleSSLPay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('বুটক্যাম্প কেনার জন্য অনুগ্রহ করে প্রথমে লগইন করুন');
            return;
        }

        try {
            const res = await initiateSSL(slug).unwrap();
            if (res.data?.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                toast.error('Failed to initiate payment');
            }
        } catch (e) {
            const err = e as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Payment initiation failed');
        }
    };

    const handlePhonePeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('বুটক্যাম্প কেনার জন্য অনুগ্রহ করে প্রথমে লগইন করুন');
            return;
        }
        if (!senderPhonePe.trim() || !transactionId.trim()) {
            toast.error('অনুগ্রহ করে আপনার PhonePe নম্বর ও Transaction ID / UTR দিন');
            return;
        }

        try {
            await submitPhonePe({
                slug,
                senderPhonePe: senderPhonePe.trim(),
                transactionId: transactionId.trim(),
            }).unwrap();

            toast.success('পেমেন্ট তথ্য সফলভাবে জমা হয়েছে! ভেরিফিকেশনের পর ভিডিও আনলক হবে।');
            setSenderPhonePe('');
            setTransactionId('');
            onClose();
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'পেমেন্ট সাবমিট করতে সমস্যা হয়েছে'));
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto border border-white/10 bg-[#121216] p-6 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-bangla text-xl">
                        <Sparkles className="h-5 w-5 text-[#ffd60a]" />
                        বুটক্যাম্প রেকর্ডিং সংগ্রহ করুন
                    </DialogTitle>
                </DialogHeader>

                {/* Bootcamp Summary Box */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 font-bangla">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#ffd60a]">
                                বুটক্যাম্প রেকর্ডিং
                            </span>
                            <h3 className="mt-1 text-base font-bold text-white">{title}</h3>
                        </div>
                        <div className="text-right">
                            <span className="font-mona text-xl font-bold text-emerald-400">
                                {selectedTab === 'sslcommerz' ? `৳${bdtAmount.toLocaleString("bn")}` : `₹${inrAmount.toLocaleString("bn")}`}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                        <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1">
                            <Video className="h-3.5 w-3.5 text-[#ffd60a]" />
                            সব লাইভ ক্লাসের ফুল এইচডি রেকর্ডিং
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            লাইফটাইম অ্যাক্সেস ও রিসোর্স
                        </span>
                    </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3 pt-2">
                    <h4 className="font-bangla text-xs font-semibold text-white/80">পেমেন্ট মেথড নির্বাচন করুন:</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedTab('sslcommerz')}
                            className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${selectedTab === 'sslcommerz'
                                    ? 'border-[#ffd60a] bg-[#ffd60a]/10 shadow-[0_0_15px_rgba(255,214,10,0.15)]'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                }`}
                        >
                            <CreditCard className="h-6 w-6 text-[#ffd60a]" />
                            <span className="mt-2 font-bangla text-xs font-bold text-white">SSLCommerz</span>
                            <span className="font-bangla text-[10px] text-white/60">
                                কার্ড / বিকাশ / নগদ (৳{bdtAmount.toLocaleString("bn")})
                            </span>
                            <span className="mt-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                                ইনস্ট্যান্ট এক্সেস
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedTab('phonepe')}
                            className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${selectedTab === 'phonepe'
                                    ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                }`}
                        >
                            <div className="h-6 w-16 relative">
                                <Image src={phonePe} alt="PhonePe" fill className="object-contain" />
                            </div>
                            <span className="mt-2 font-bangla text-xs font-bold text-white">ম্যানুয়াল পেমেন্ট</span>
                            <span className="font-bangla text-[10px] text-amber-300">
                                🇮🇳 ভারতীয়দের জন্য (₹{inrAmount.toLocaleString("bn")})
                            </span>
                            <span className="mt-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-semibold text-purple-300">
                                PhonePe UPI
                            </span>
                        </button>
                    </div>
                </div>

                {/* Form based on selected tab */}
                {selectedTab === 'sslcommerz' ? (
                    <form onSubmit={handleSSLPay} className="space-y-4 pt-2">
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs font-bangla text-white/70 space-y-2">
                            <p className="flex items-center gap-1.5 text-white/90 font-semibold">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                নিরাপদ অনলাইন পেমেন্ট (SSLCommerz)
                            </p>
                            <p>
                                আপনি বিকাশ, নগদ, রকেট, ডেবিট/ক্রেডিট কার্ডের মাধ্যমে সরাসরি পেমেন্ট করতে পারবেন। পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই বুটক্যাম্প ভিডিও আনলক হবে।
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
