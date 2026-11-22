'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api-helpers';
import {
    BootcampPurchaseAdminItem,
    useReviewBootcampPurchaseAdminMutation,
} from '@/redux/api/bootcampApi';

interface BootcampPurchaseReviewDialogProps {
    open: boolean;
    onClose: () => void;
    purchase: BootcampPurchaseAdminItem | null;
}

export function BootcampPurchaseReviewDialog({
    open,
    onClose,
    purchase,
}: BootcampPurchaseReviewDialogProps) {
    const [reviewPurchase, { isLoading }] = useReviewBootcampPurchaseAdminMutation();
    const [adminNote, setAdminNote] = useState('');

    if (!purchase) return null;

    const handleAction = async (status: 'paid' | 'rejected') => {
        try {
            await reviewPurchase({
                id: purchase._id,
                status,
                adminNote: adminNote.trim() || undefined,
            }).unwrap();
            toast.success(
                status === 'paid'
                    ? 'বুটক্যাম্প পেমেন্ট সফলভাবে অনুমোদিত হয়েছে! শিক্ষার্থীর এক্সেস আনলক হয়েছে।'
                    : 'বুটক্যাম্প পেমেন্ট বাতিল করা হয়েছে।'
            );
            onClose();
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে'));
        }
    };

    const isPending = purchase.status === 'pending';

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-lg bg-white text-gray-900 border-gray-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-bangla text-lg text-gray-900">
                        <ShieldCheck className="h-5 w-5 text-amber-500" />
                        বুটক্যাম্প পেমেন্ট যাচাই ও অনুমোদন
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Purchase Details */}
                    <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-xs font-bangla">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">বুটক্যাম্প:</span>
                            <span className="font-bold text-amber-700">
                                {purchase.bootcamp?.title} {purchase.bootcamp?.season}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">শিক্ষার্থীর নাম:</span>
                            <span className="font-semibold text-gray-900">{purchase.user?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">ইমেইল:</span>
                            <span className="font-mono text-gray-800">{purchase.user?.email || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">ফোন / WhatsApp:</span>
                            <span className="font-mono text-gray-800">{purchase.user?.phone || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">পেমেন্ট মেথড:</span>
                            <span className="font-semibold text-amber-700">
                                {purchase.method === 'PhonePe_Manual'
                                    ? 'PhonePe Manual (India 🇮🇳)'
                                    : purchase.method === 'manual'
                                    ? 'Manual Payment'
                                    : 'SSLCommerz (Online)'}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">টাকার পরিমাণ:</span>
                            <span className="font-bold text-emerald-600 text-sm">
                                {purchase.currency === 'INR' ? `₹${purchase.amount}` : `৳${purchase.amount}`}
                            </span>
                        </div>
                        {purchase.senderNumber && (
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-500">প্রেরকের PhonePe নম্বর / UPI:</span>
                                <span className="font-mono font-bold text-gray-900">{purchase.senderNumber}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-500">Transaction ID / UTR:</span>
                            <span className="font-mono font-bold text-gray-900">{purchase.transactionId}</span>
                        </div>
                    </div>

                    {/* Admin Note */}
                    <div className="space-y-1.5">
                        <label className="font-bangla text-xs font-medium text-gray-700">এডমিন নোট (ঐচ্ছিক)</label>
                        <Textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="কোনো মন্তব্য বা কারণ থাকলে লিখুন..."
                            rows={2}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-bangla text-xs"
                    >
                        বন্ধ করুন
                    </Button>
                    {isPending && (
                        <>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => handleAction('rejected')}
                                disabled={isLoading}
                                className="bg-red-600 font-bangla text-xs font-bold text-white hover:bg-red-700"
                            >
                                <XCircle className="mr-1.5 h-4 w-4" />
                                বাতিল করুন
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleAction('paid')}
                                disabled={isLoading}
                                className="bg-emerald-600 font-bangla text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                )}
                                অনুমোদন করুন (Approve)
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
