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
import { paymentInfo } from "@/constants/enrollment";

const paymentSchema = z.object({
    senderNumber: z.string().min(10, "Please enter a valid phone number"),
    transactionId: z.string().min(5, "Please enter a valid transaction ID"),
});

type PaymentForm = z.infer<typeof paymentSchema>;

interface ManualPaymentFormProps {
    onBack: () => void;
    onPaymentComplete: (data: { senderNumber: string; transactionId: string }) => void;
    manualAmount?: number;
    manualCurrency?: string;
}

const ManualPaymentForm = ({
    onBack,
    onPaymentComplete,
    manualAmount,
    manualCurrency,
}: ManualPaymentFormProps) => {
    const form = useForm<PaymentForm>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            senderNumber: "",
            transactionId: ""
        }
    });

    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onSubmit = (data: PaymentForm) => {
        onPaymentComplete(data);
    };

    const displayCurrency = manualCurrency || paymentInfo.currency || 'BDT';
    const displayAmount = typeof manualAmount === 'number' ? manualAmount : paymentInfo.amount;
    const dynamicInstructions = paymentInfo.instructions.map((instruction) => {
        if (instruction.toLowerCase().includes('enter the exact amount')) {
            return `Enter the exact amount: ${displayCurrency} ${displayAmount.toLocaleString('en-IN')}`;
        }
        return instruction;
    });

    return (
        <div className="space-y-5">
            {/* QR Code Section */}
            <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />

                <div className="p-5 border-b border-primary/10">
                    <h3 className="text-lg font-bold text-white/90 text-center">Pay with PhonePe</h3>
                    <p className="text-sm text-white/45 text-center mt-1">Send payment to complete your enrollment</p>
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
                                <span className="text-white/55 font-medium text-sm">Recipient</span>
                            </div>
                            <span className="font-semibold text-white/85 text-sm">{paymentInfo.recipientName}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-primary/6 border border-primary/15 p-4 transition-colors hover:bg-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-white/55 font-medium text-sm">Phone</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-white/85">{paymentInfo.phoneNumber}</span>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(paymentInfo.phoneNumber)}
                                    className="relative w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
                                    title="Copy phone number"
                                >
                                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-primary/70" />}
                                    {copied && (
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#060f0a] border border-primary/25 text-primary text-[10px] rounded px-2 py-0.5 whitespace-nowrap">
                                            Copied!
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
                            <span className="font-bold text-red-400 text-lg">Amount: {displayCurrency} {displayAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="relative overflow-hidden rounded-xl bg-primary/6 border border-primary/15 p-4">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <h4 className="font-semibold text-white/75 text-sm mb-3">Payment Instructions:</h4>
                        <ol className="space-y-2.5">
                            {dynamicInstructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-primary/15 border border-primary/30 text-primary rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm text-white/55 leading-relaxed">{instruction}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>

            {/* Payment Details Form */}
            <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="p-5 border-b border-primary/10">
                    <h3 className="text-lg font-bold text-white/90">Confirm Your Payment</h3>
                </div>
                <div className="p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="senderNumber"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/65 text-sm">Your Phone Pay Number *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your phone pay number"
                                                {...field}
                                                className={cn(
                                                    "h-12 bg-[#0a1812] border-primary/25 text-white placeholder:text-white/30 focus:border-primary/55 focus-visible:ring-primary/40 autofill:shadow-[inset_0_0_0px_1000px_rgb(10,24,18)] autofill:[-webkit-text-fill-color:white]",
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
                                        <FormLabel className="text-white/65 text-sm">Transaction ID *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter transaction ID from phone pay"
                                                {...field}
                                                className={cn(
                                                    "h-12 font-mono bg-[#0a1812] border-primary/25 text-white placeholder:text-white/30 focus:border-primary/55 focus-visible:ring-primary/40 autofill:shadow-[inset_0_0_0px_1000px_rgb(10,24,18)] autofill:[-webkit-text-fill-color:white]",
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

                            {/* <FormField
                                control={form.control}
                                name="amount"
                                disabled
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Amount Paid (৳) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="2867.24"
                                                {...field}
                                                className={cn(
                                                    "h-12",
                                                    fieldState.invalid
                                                        ? "border-red-500 focus-visible:ring-red-500"
                                                        : fieldState.isTouched && field.value
                                                            ? "border-green-500 focus-visible:ring-green-500"
                                                            : ""
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onBack}
                                    className="flex-1 flex items-center justify-center gap-2 border border-primary/25 text-white/60 hover:border-primary/50 hover:text-white/90 transition-all duration-200 rounded-xl py-2.5 text-sm font-medium cursor-pointer">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                                <div className={`flex-1 relative p-[1.5px] rounded-xl overflow-hidden ${
                                    !form.formState.isValid ? 'opacity-50' : ''
                                }`}>
                                    <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                    <button
                                        type="submit"
                                        disabled={!form.formState.isValid}
                                        className="relative w-full bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41] disabled:cursor-not-allowed transition-all duration-300 text-white font-bold py-2.5 rounded-xl text-sm"
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