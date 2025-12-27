'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    onPaymentComplete: (data: PaymentForm) => void;
}

const ManualPaymentForm = ({ onBack, onPaymentComplete }: ManualPaymentFormProps) => {
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);

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
        setPaymentSubmitted(true);
        onPaymentComplete(data);
        //toast("Payment information submitted! We'll verify and confirm shortly.");
    };

    if (paymentSubmitted) {
        return (
            <Card className="glass-card form-animate">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-success-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Payment Information Received!</h3>
                    <p className="text-muted-foreground mb-6">
                        We&apos;ll verify your payment within 12-24 hours and confirm your enrollment via Email.
                    </p>
                    <Button onClick={onBack} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Form
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* QR Code Section */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-center">Pay with PhonePe</CardTitle>
                    <p className="text-muted-foreground text-center">Send payment to complete your enrollment</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* phone number */}

                    <div className="flex justify-center items-center">
                        <div className=" p-6 w-full max-w-md transform transition-all hover:scale-[1.02]">
                            <div className="space-y-6">
                                {/* Logo Section */}
                                <div className="flex justify-center">
                                    <Image
                                        src={phonePe}
                                        alt="PhonePe"
                                        width={200}
                                        height={150}
                                        className="object-contain"
                                    />
                                </div>

                                {/* Recipient Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 transition-colors hover:bg-gray-100">
                                        <div className="flex items-center gap-3">
                                            <User className="w-6 h-6 text-indigo-600" />
                                            <span className="text-gray-600 font-medium">Recipient</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{paymentInfo.recipientName}</span>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 transition-colors hover:bg-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-6 h-6 text-indigo-600" />
                                            <span className="text-gray-600 font-medium">Phone</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-lg font-semibold text-gray-900">
                                                {paymentInfo.phoneNumber}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(paymentInfo.phoneNumber)}
                                                className="h-8 w-8 p-0 relative group"
                                                title="Copy phone number"
                                            >
                                                <Copy className="w-4 h-4 text-indigo-600 group-hover:text-indigo-800 transition-colors" />
                                                {copied && (
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1">
                                                        Copied!
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Badge */}
                                <div className="flex justify-center">
                                    <Badge
                                        variant="destructive"
                                        className="text-lg px-6 py-2 font-semibold bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full shadow-md"
                                    >
                                        Amount: BDT {paymentInfo.amount.toLocaleString('en-IN')}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-accent/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Payment Instructions:</h4>
                        <ol className="space-y-2 text-sm">
                            {paymentInfo.instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span>{instruction}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Details Form */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Confirm Your Payment</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="senderNumber"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Your Phone Pay Number *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your phone pay number"
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
                            />

                            <FormField
                                control={form.control}
                                name="transactionId"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Transaction ID *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter transaction ID from phone pay"
                                                {...field}
                                                className={cn(
                                                    "h-12 font-mono",
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

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 glow-effect"
                                    disabled={!form.formState.isValid}
                                >
                                    Submit Payment Info
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ManualPaymentForm;