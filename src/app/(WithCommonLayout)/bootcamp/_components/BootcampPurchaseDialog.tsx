'use client';

import { toast } from 'sonner';
import { Loader2, CreditCard } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useInitiateBootcampSSLCommerzMutation } from '@/redux/api/bootcampApi';

interface BootcampPurchaseDialogProps {
    open: boolean;
    onClose: () => void;
    slug: string;
    title: string;
    price: number;
}

export default function BootcampPurchaseDialog({
    open,
    onClose,
    slug,
    title,
    price,
}: BootcampPurchaseDialogProps) {
    const [initiateSSL, { isLoading }] = useInitiateBootcampSSLCommerzMutation();

    const handleSSLPay = async () => {
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

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-md border-0 bg-[#111113] text-white">
                <DialogHeader>
                    <DialogTitle className="font-bangla">রেকর্ডিং কিনুন</DialogTitle>
                    <DialogDescription className="font-bangla text-white/60">
                        {title} — ৳{price} • লাইফটাইম অ্যাক্সেস
                    </DialogDescription>
                </DialogHeader>

                <p className="font-bangla text-sm text-white/60">
                    কার্ড, বিকাশ, নগদ — সব ধরনের পেমেন্ট নেওয়া হয়। পেমেন্ট শেষে এই পেজেই ভিডিও আনলক
                    হবে।
                </p>

                <DialogFooter>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-white/20 px-4 py-2 font-bangla text-sm text-white/70 hover:text-white"
                    >
                        বাতিল
                    </button>
                    <button
                        type="button"
                        onClick={handleSSLPay}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-lg bg-[#ffd60a] px-5 py-2 font-bangla text-sm font-bold text-black transition hover:bg-[#ffd60a]/90 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                        পেমেন্ট করুন
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
