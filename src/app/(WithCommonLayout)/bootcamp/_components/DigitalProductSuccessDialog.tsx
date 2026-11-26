'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, FileCode, FileText, Clock, Gift } from 'lucide-react';

interface DigitalProductSuccessDialogProps {
    open: boolean;
    onClose: () => void;
    orderId?: string;
    downloadToken?: string;
    isManualPending?: boolean;
    isFreeClaim?: boolean;
}

export function DigitalProductSuccessDialog({
    open,
    onClose,
    orderId,
    downloadToken,
    isManualPending = false,
    isFreeClaim = false,
}: DigitalProductSuccessDialogProps) {
    const baseApi = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5000/api/v1';

    const scriptUrl = downloadToken
        ? `${baseApi}/digital-products/download/${downloadToken}/script`
        : '#';
    const guideUrl = downloadToken
        ? `${baseApi}/digital-products/download/${downloadToken}/guide`
        : '#';

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-md border border-white/10 bg-[#121216] p-6 text-center text-white">
                <DialogHeader className="items-center">
                    <div
                        className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl ${
                            isManualPending
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                    >
                        {isManualPending ? (
                            <Clock className="h-7 w-7" />
                        ) : isFreeClaim ? (
                            <Gift className="h-7 w-7" />
                        ) : (
                            <CheckCircle2 className="h-7 w-7" />
                        )}
                    </div>
                    <DialogTitle className="font-bangla text-xl font-bold">
                        {isManualPending
                            ? 'পেমেন্ট রিকোয়েস্ট গৃহীত হয়েছে'
                            : isFreeClaim
                              ? 'ফ্রি প্রোডাক্ট আনলক হয়েছে!'
                              : 'পেমেন্ট সফল হয়েছে!'}
                    </DialogTitle>
                </DialogHeader>

                {orderId && (
                    <div className="mt-1 font-mono text-xs text-white/50">
                        অর্ডার নং: <span className="text-white/80">{orderId}</span>
                    </div>
                )}

                {isManualPending ? (
                    <div className="mt-4 space-y-3 font-bangla text-xs text-white/70">
                        <p className="leading-relaxed">
                            আপনার PhonePe পেমেন্টের তথ্য আমরা পেয়েছি। আমাদের টিম এটি যাচাই করে অতি দ্রুত আপনার ইমেইলে
                            ফাইল ডাউনলোডের এক্সেস লিংক পাঠিয়ে দেবে।
                        </p>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white/60">
                            * ভেরিফিকেশন সম্পন্ন হলে আপনার প্রোফাইল থেকেও ফাইলগুলো যেকোনো সময় ডাউনলোড করতে পারবেন।
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 space-y-4 font-bangla">
                        <p className="text-xs text-white/70">
                            {isFreeClaim
                                ? 'অভিনন্দন! আপনার ফ্রি ডিজিটাল প্রোডাক্টটি সফলভাবে সংগ্রহ করা হয়েছে। নিচের বাটনগুলো চেপে এখনই ডাউনলোড করুন:'
                                : 'অভিনন্দন! আপনার ডিজিটাল প্রোডাক্ট সফলভাবে আনলক হয়েছে। নিচের বাটনগুলো চেপে এখনই ডাউনলোড করুন:'}
                        </p>

                        <div className="space-y-2.5">
                            <a
                                href={scriptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-xl border border-[#ffd60a]/30 bg-[#ffd60a]/10 p-3.5 text-left text-xs font-bold text-white transition hover:bg-[#ffd60a]/20"
                            >
                                <span className="flex items-center gap-2 text-[#ffd60a]">
                                    <FileCode className="h-5 w-5" />
                                    শর্টকাট স্ক্রিপ্ট কোড ফাইল (.jsx / .zip)
                                </span>
                                <Download className="h-4 w-4 text-[#ffd60a]" />
                            </a>

                            <a
                                href={guideUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-left text-xs font-bold text-white transition hover:bg-emerald-500/20"
                            >
                                <span className="flex items-center gap-2 text-emerald-400">
                                    <FileText className="h-5 w-5" />
                                    স্টেপ-বাই-স্টেপ ইনস্টলেশন গাইড (PDF)
                                </span>
                                <Download className="h-4 w-4 text-emerald-400" />
                            </a>
                        </div>

                        <p className="text-[11px] text-white/40">
                            * আপনার ইমেইলেও ডাউনলোড লিংক পাঠিয়ে দেওয়া হয়েছে।
                        </p>
                    </div>
                )}

                <div className="mt-6">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-white/10 font-bangla text-xs text-white hover:bg-white/20"
                    >
                        ঠিক আছে
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
