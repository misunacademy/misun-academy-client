'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowLeft, User, Phone, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { phonePe } from "@/assets/images";
import { paymentInfo } from "@/constants/payment";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

const paymentSchema = z.object({
    senderNumber: z.string().regex(/^[+\d][\d\s-]{9,19}$/, "সঠিক ফোন নম্বর দিন"),
    transactionId: z.string().trim().min(5, "সঠিক ট্রানজেকশন আইডি দিন").max(100),
});

type PaymentForm = z.infer<typeof paymentSchema>;

interface ManualPaymentFormProps {
    onBack: () => void;
    onPaymentComplete: (data: { senderNumber: string; transactionId: string }) => void;
    manualAmount: number;
    manualCurrency?: string;
    isSubmitting?: boolean;
    batch:string
}

const ManualPaymentForm = ({
    onBack,
    onPaymentComplete,
    manualAmount,
    manualCurrency,
    isSubmitting = false,
    batch
}: ManualPaymentFormProps) => {
    const form = useForm<PaymentForm>({
        resolver: zodResolver(paymentSchema),
        // onChange: the submit button is gated on `isValid`, which only
        // updates live in a validating mode — in default onSubmit mode it
        // stays false until a submit that the disabled button prevents.
        mode: "onChange",
        defaultValues: {
            senderNumber: "",
            transactionId: ""
        }
    });

    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                // Last resort: user copies by hand.
            }
            document.body.removeChild(ta);
        }
    };

    const onSubmit = (data: PaymentForm) => {
        onPaymentComplete(data);
    };

    const displayAmount = manualAmount ?? 0;
    // Batches carry their own currency (BDT batches vs INR manual payments
    // for Indian students) — never hardcode it.
    const CURRENCY_SYMBOLS: Record<string, string> = { INR: "INR", BDT: "৳" };
    const effectiveCurrency = manualCurrency ?? paymentInfo.currency;
    const currencyLabel = CURRENCY_SYMBOLS[effectiveCurrency] ?? effectiveCurrency;
    const formattedAmount = `${currencyLabel} ${displayAmount.toLocaleString('en-US')}`;
    const instructions = [
        "PhonePe অ্যাপ খুলুন",
        "উপরের নম্বরে টাকা পাঠান",
        `সঠিক পরিমাণ পাঠান: ${formattedAmount}`,
        batch ? `রেফারেন্সে ব্যাচ নম্বর দিন (যেমন 'MA-${batch}')` : "রেফারেন্সে আপনার ব্যাচ নম্বর দিন",
        "পেমেন্ট সম্পন্ন করুন",
        "নিচে আপনার পেমেন্টের তথ্য দিন",
    ];

    return (
        <div className="space-y-5">
            {/* QR Code Section */}
            <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />

                <div className="p-5 border-b border-primary/10">
                    <h3 className="text-lg font-bold text-white/90 text-center">PhonePe দিয়ে পেমেন্ট করুন</h3>
                    <p className="text-sm text-white/70 text-center mt-1">পেমেন্ট পাঠিয়ে ভর্তি সম্পন্ন করুন</p>
                </div>

                <div className="p-6 space-y-5">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="relative overflow-hidden rounded-xl bg-white/5 border border-primary/15 p-4">
                            <Image src={phonePe} alt="PhonePe" width={180} height={120} className="object-contain" />
                        </div>
                    </div>

                    {/* Recipient Info */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl bg-primary/6 border border-primary/15 p-4 transition-colors hover:bg-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-white/80 font-medium text-sm">প্রাপক</span>
                            </div>
                            <span className="font-semibold text-white/85 text-sm">{paymentInfo.recipientName}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-primary/6 border border-primary/15 p-4 transition-colors hover:bg-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-white/80 font-medium text-sm">ফোন</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-white/85">{paymentInfo.phoneNumber}</span>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(paymentInfo.phoneNumber)}
                                    className="relative w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
                                    title="ফোন নম্বর কপি করুন"
                                >
                                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-primary/70" />}
                                    {copied && (
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface border border-primary/25 text-primary text-[11px] rounded px-2 py-0.5 whitespace-nowrap">
                                            কপি হয়েছে!
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="flex justify-center">
                        <div className="relative overflow-hidden rounded-xl bg-red-500/8 border border-red-500/25 px-6 py-2.5">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                            <span className="font-bold text-red-400 text-lg">পরিমাণ: {formattedAmount}</span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="relative overflow-hidden rounded-xl bg-primary/6 border border-primary/15 p-4">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <h4 className="font-semibold text-white/75 text-sm mb-3">পেমেন্টের নির্দেশনা:</h4>
                        <ol className="space-y-2.5">
                            {instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-primary/15 border border-primary/30 text-primary rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm text-white/80 leading-relaxed">{instruction}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>

            {/* Payment Details Form */}
            <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="p-5 border-b border-primary/10">
                    <h3 className="text-lg font-bold text-white/90">পেমেন্ট নিশ্চিত করুন</h3>
                </div>
                <div className="p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="senderNumber"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/85 text-sm">আপনার Phone Pay নম্বর *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Phone Pay নম্বর লিখুন"
                                                {...field}
                                                className={cn(
                                                    "h-12 bg-[#0a1812] border-primary/25 text-white placeholder:text-white/50 focus:border-primary/55 focus-visible:ring-primary/40 autofill:shadow-[inset_0_0_0px_1000px_rgb(10,24,18)] autofill:[-webkit-text-fill-color:white]",
                                                    fieldState.invalid
                                                        ? "border-red-500/60 focus-visible:ring-red-500/30"
                                                        : fieldState.isTouched && field.value
                                                            ? "border-primary/50"
                                                            : ""
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="transactionId"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/85 text-sm">ট্রানজেকশন আইডি *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Phone Pay-এর ট্রানজেকশন আইডি লিখুন"
                                                {...field}
                                                className={cn(
                                                    "h-12 font-mono bg-[#0a1812] border-primary/25 text-white placeholder:text-white/50 focus:border-primary/55 focus-visible:ring-primary/40 autofill:shadow-[inset_0_0_0px_1000px_rgb(10,24,18)] autofill:[-webkit-text-fill-color:white]",
                                                    fieldState.invalid
                                                        ? "border-red-500/60 focus-visible:ring-red-500/30"
                                                        : fieldState.isTouched && field.value
                                                            ? "border-primary/50"
                                                            : ""
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />




                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onBack}
                                    className="flex-1 flex items-center justify-center gap-2 border border-primary/25 text-white/85 hover:border-primary/50 hover:text-white transition-all duration-200 rounded-xl py-2.5 text-sm font-medium cursor-pointer">
                                    <ArrowLeft className="w-4 h-4" />
                                    ফিরে যান
                                </button>
                                <div className="flex-1 relative p-[1.5px] rounded-xl overflow-hidden">
                                    <AnimatedBorder variant="simple" speed="3s" />
                                    <button
                                        type="submit"
                                        disabled={!form.formState.isValid || isSubmitting}
                                        className="relative w-full bg-primary hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-darker disabled:text-white disabled:ring-1 disabled:ring-inset disabled:ring-primary/25 transition-colors duration-300 text-primary-foreground font-bold py-2.5 rounded-xl text-sm"
                                    >
                                        Submit Payment Info
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ManualPaymentForm;