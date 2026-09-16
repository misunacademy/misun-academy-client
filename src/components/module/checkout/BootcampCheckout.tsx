'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useInitiateEnrollmentMutation, useEnrollStudentManualMutation } from '@/redux/api/enrollmentApi';
import { CheckoutHeader } from './CheckoutHeader';
import { CourseInfoSidebar } from './CourseInfoSidebar';
import { CheckoutStepOne } from './CheckoutStepOne';
import ManualPaymentForm from './ManualPaymentForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
    batchId: z.string().min(1),
    paymentMethod: z.enum(['SSLCommerz', 'phonePay']),
});

export default function BootcampCheckout({
    batchId,
    course,
    batch,
}: {
    batchId: string;
    course: Record<string, unknown>;
    batch: Record<string, unknown>;
}) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [pendingBatchId, setPendingBatchId] = useState<string | null>(null);

    const [initiate] = useInitiateEnrollmentMutation();
    const [manual] = useEnrollStudentManualMutation();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { batchId, paymentMethod: undefined },
    });

    const batchPrice = (batch?.price as number) ?? 0;
    const manualAmount = typeof batch?.manualPaymentPrice === 'number' ? (batch.manualPaymentPrice as number) : 0;
    const manualCurrency = (batch?.currency as string) || 'BDT';

    const onSubmit = async (data: z.infer<typeof schema>) => {
        if (!agreed) {
            toast.error('Please agree to the terms first.');
            return;
        }
        if (data.paymentMethod === 'phonePay') {
            setPendingBatchId(data.batchId);
            setCurrentStep(2);
            return;
        }
        setIsProcessing(true);
        try {
            const res = (await initiate({ batchId: data.batchId }).unwrap() as unknown as {
                data?: { paymentUrl?: string };
            });
            const url = res?.data?.paymentUrl;
            if (!url) {
                toast.error('Failed to get payment URL.');
                setIsProcessing(false);
                return;
            }
            toast.success('Redirecting to SSLCommerz...');
            router.push(url);
        } catch (e: unknown) {
            const err = e as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Payment initiation failed.');
            setIsProcessing(false);
        }
    };

    const handleManualComplete = async (paymentData: { senderNumber: string; transactionId: string }) => {
        if (!pendingBatchId) return;
        setIsProcessing(true);
        try {
            const res = (await manual({ batchId: pendingBatchId, paymentData }).unwrap() as unknown as {
                success?: boolean;
            });
            if (res?.success) {
                toast.success('Payment submitted! Verification within 12-24 hours.');
                router.push('/');
            }
        } catch (e: unknown) {
            const err = e as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Manual payment failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface">
            <CheckoutHeader currentStep={currentStep} onBack={() => (currentStep === 2 ? setCurrentStep(1) : router.back())} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-4 rounded-xl border border-[#ffd60a]/30 bg-[#ffd60a]/10 px-4 py-3">
                    <p className="font-bangla text-sm text-white/85">
                        বুটক্যাম্প রেকর্ডিং — একবার কিনলেই লাইফটাইম অ্যাক্সেস। সবার জন্য একই ভিডিও।
                    </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    <CourseInfoSidebar course={course} batch={batch} isLoading={false} />
                    <div className="lg:col-span-2">
                        <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/15">
                            <div className="p-6 pb-2 border-b border-primary/10">
                                <h2 className="text-2xl font-bold text-white/90">
                                    {currentStep === 1 ? 'Choose Payment Method' : 'Manual Payment'}
                                </h2>
                            </div>
                            <div className="p-6">
                                {currentStep === 1 ? (
                                    <CheckoutStepOne
                                        form={form}
                                        batch={batch}
                                        course={course}
                                        agreed={agreed}
                                        isProcessing={isProcessing}
                                        isEnrollmentOpen
                                        showTutorial={showTutorial}
                                        batchPrice={batchPrice}
                                        onAgreeChange={setAgreed}
                                        onTutorialToggle={() => setShowTutorial(!showTutorial)}
                                        onSubmit={onSubmit}
                                    />
                                ) : (
                                    <ManualPaymentForm
                                        onBack={() => setCurrentStep(1)}
                                        onPaymentComplete={handleManualComplete}
                                        manualAmount={manualAmount}
                                        manualCurrency={manualCurrency}
                                        batch={(batch?.title as string)?.split(' ')[1]}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
