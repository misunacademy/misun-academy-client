/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CheckCircle, Clock, ArrowLeft, Sparkles, Loader2, CreditCard, Smartphone, Play, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import ManualPaymentForm from "./ManualPaymentForm";
import { useEnrollStudentMutation, useEnrollStudentManualMutation } from "@/redux/features/student/studentApi";
import one from "@/assets/images/payments/one.png"
import two from "@/assets/images/payments/two.png"
import three from "@/assets/images/payments/three.png"
import four from "@/assets/images/payments/four.png"
import five from "@/assets/images/payments/five.png"
import six from "@/assets/images/payments/six.png"
import seven from "@/assets/images/payments/seven.png"
import eight from "@/assets/images/payments/eight.png"
import nine from "@/assets/images/payments/nine.png"
import ten from "@/assets/images/payments/ten.png"
import phonepay from "@/assets/images/payments/phonepay.png"
import { useRouter } from "next/navigation";
import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import { useGetCourseBySlugQuery } from "@/redux/api/courseApi";
import { useGetCurrentEnrollmentBatchQuery, useGetUpcomingBatchesQuery } from "@/redux/api/batchApi";


interface PaymentError {
    data?: {
        message?: string;
    };
    message?: string;
}

const enrollmentSchema = z.object({
    batchId: z.string().min(1, "Please select a batch"),
    paymentMethod: z
        .enum(["SSLCommerz", "phonePay"])
        .refine((val) => !!val, {
            message: "Please select a payment method",
        }),
});

type EnrollmentForm = z.infer<typeof enrollmentSchema>;

const EnrollmentCheckout = ({ courseSlug }: { courseSlug?: string } = {}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState<EnrollmentForm | null>(null);
    const [enrollStudent] = useEnrollStudentMutation();
    const [enrollStudentManual] = useEnrollStudentManualMutation();
    const router = useRouter();
    // Initialize form first
    const form = useForm<EnrollmentForm>({
        resolver: zodResolver(enrollmentSchema),
        mode: 'onChange',
        defaultValues: {
            batchId: "",
            paymentMethod: undefined,
        },
    });

    // Course-specific queries (used when courseSlug is provided)
    const { data: courseBySlug, isLoading: courseLoading } = useGetCourseBySlugQuery(
        courseSlug!, { skip: !courseSlug }
    );
    const courseData = (courseBySlug?.data as any);

    // Primary: batch with an open enrollment window
    const { data: currentBatchRes, isLoading: currentBatchLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: courseData?._id }, { skip: !courseData?._id }
    );

    // Fallback: upcoming batch (enrollment window not open yet)
    const { data: upcomingBatchRes, isLoading: upcomingBatchLoading } = useGetUpcomingBatchesQuery(
        { courseId: courseData?._id },
        { skip: !courseData?._id || !!currentBatchRes?.data }
    );

    const batchLoading = currentBatchLoading || upcomingBatchLoading;

    // Resolve course + batch: prefer slug-based data when courseSlug is provided.
    // For slug path: use current-enrollment batch first, then first upcoming batch as fallback.
    const resolvedCourse = courseSlug ? courseData : {};
    const resolvedBatch  = courseSlug
        ? ((currentBatchRes?.data as any) ?? (upcomingBatchRes?.data as any)?.[0])
        : {};

    // Whether the enrollment window is currently open for this batch
    const isEnrollmentOpen = resolvedBatch
        ? (() => {
            const now = Date.now();
            const start = new Date(resolvedBatch.enrollmentStartDate).getTime();
            const end   = new Date(resolvedBatch.enrollmentEndDate).getTime();
            return now >= start && now <= end;
        })()
        : false;

    // Keep legacy aliases for backwards compat with rest of JSX
    const featuredCourseId = resolvedCourse;
    const featuredBatchId  = resolvedBatch;

    const isDataLoading = (!!courseSlug && (courseLoading || (!!courseData && batchLoading)));

    const selectedCourseSlug =
        (typeof featuredCourseId?.slug === 'string' && featuredCourseId.slug) ||
        (typeof (featuredBatchId as any)?.courseId?.slug === 'string' ? (featuredBatchId as any).courseId.slug : '') ||
        courseSlug ||
        '';

    const isEnglishCourse = /english/i.test(selectedCourseSlug);
    const manualPaymentAmount =
        typeof featuredBatchId?.manualPaymentPrice === 'number'
            ? featuredBatchId.manualPaymentPrice
            : isEnglishCourse
                ? 2000
                : 3000;

    const manualPaymentCurrency = featuredBatchId?.currency || 'BDT';

    useEffect(() => {
        if (!form.getValues('batchId') && resolvedBatch?._id) {
            form.setValue('batchId', resolvedBatch._id);
        }
    }, [form, resolvedBatch?._id]);
    const processSSLCommerzPayment = async (data: EnrollmentForm) => {
        setIsProcessing(true);
        try {
            const res = await enrollStudent({
                batchId: data.batchId,
            }).unwrap();



            if (!res?.data?.paymentUrl) {
                toast.error("Failed to get payment URL. Please try again.");
                setIsProcessing(false);
                return;
            }

            toast.success("Redirecting to SSLCommerz...", {
                description: "You'll be redirected to complete your payment securely.",
            });

            router.push(res.data.paymentUrl);
        } catch (error: unknown) {
            console.error('Payment error:', error);
            const paymentError = error as PaymentError;
            toast.error(paymentError?.data?.message || "Payment initiation failed. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleManualPaymentComplete = async (paymentData: { senderNumber: string; transactionId: string }) => {
        if (!enrollmentData) {
            toast.error("Enrollment data missing!");
            return;
        }

        setIsProcessing(true);
        try {
            const res = await enrollStudentManual({
                batchId: enrollmentData.batchId,
                paymentData: paymentData
            }).unwrap();

            if (res?.success) {
                toast.success("Payment submitted successfully!", {
                    description: "We'll verify your payment within 12-24 hours."
                });
                // Redirect to congratulations page
                router.push('/');
            }
        }
        catch (err: unknown) {
            const errM = err as { data: { message: string } };
            toast.error(errM?.data?.message || "Something went wrong!");
        } finally {
            setIsProcessing(false);
        }
    };

    const onSubmit = (data: EnrollmentForm) => {
        setEnrollmentData(data);

        if (data.paymentMethod === "SSLCommerz") {
            processSSLCommerzPayment(data);
        } else if (data.paymentMethod === "phonePay") {
            setCurrentStep(2);
        }
    };

    const goBack = () => {
        if (currentStep === 2) setCurrentStep(1);
        else window.history.back();
    };



    return (
        <div className="min-h-screen bg-[#060f0a]">
            {/* Header */}
            <div className="bg-[#060f0a]/90 backdrop-blur-sm border-b border-primary/15 sticky top-16 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={goBack}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/40">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="font-semibold text-white/80">
                                {currentStep === 1 ? 'Payment Method' : 'Manual Payment'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Course Info - Left Side */}
                    <div className="lg:col-span-1 space-y-6 sm:sticky top-[8.5rem] self-start">
                        <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            <div className="p-5">
                                {isDataLoading ? (
                                    <div className="aspect-video rounded-lg mb-4 bg-primary/8 animate-pulse" />
                                ) : (
                                    <>
                                        <div className="aspect-video rounded-lg mb-4 relative overflow-hidden">
                                            <Image
                                                src={featuredCourseId?.thumbnailImage}
                                                alt={featuredCourseId?.title || 'Course'}
                                                width={400}
                                                height={280}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 text-white/90">{featuredCourseId?.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-white/50">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-primary/70" />
                                                <span>{featuredCourseId?.durationEstimate || '0'} Months</span>
                                            </div>
                                        </div>
                                    </>
                                )}  
                            </div>
                            {featuredCourseId && (
                                <div className="px-5 pb-5">
                                    <div className="space-y-4">

                                        <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

                                        <div>
                                            <h4 className="font-semibold mb-3 text-white/70 text-sm">What you&apos;ll learn:</h4>
                                            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                                {
                                                    featuredCourseId.highlights && featuredCourseId.highlights.map((highlight: string, index: number) => (
                                                        <div key={index} className="text-center px-2 py-1.5 bg-primary/8 border border-primary/15 rounded-md">
                                                            <span className="text-xs text-white/60">{highlight}</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>

                                        <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

                                        <div>
                                            <h4 className="font-semibold mb-2 text-white/70 text-sm">Course includes:</h4>
                                            <ul className="space-y-1.5 text-sm">
                                                {
                                                    featuredCourseId.features && featuredCourseId.features.map((feature: string, index: number) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                                            <span className="text-white/60">{feature}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Summary */}
                        <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            <div className="p-5">
                                <div className="space-y-3">
                                    {featuredBatchId ? (
                                        <>
                                            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-primary/70 mb-3">Price Summary</p>
                                            <div className="flex justify-between items-center text-lg font-semibold">
                                                <span className="text-white/70">Course Price</span>
                                                <span className="text-primary font-bold">৳{(featuredBatchId.price || 0)}</span>
                                            </div>
                                            {featuredBatchId.currency && featuredBatchId.currency !== 'BDT' && (
                                                <p className="text-xs text-white/35">Currency: {featuredBatchId.currency}</p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm text-white/40">Select a batch to see pricing</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enrollment Form - Right Side */}
                    <div className="lg:col-span-2 mt-10">
                        <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />
                            <div className="p-6 pb-2 border-b border-primary/10">
                                <h2 className="text-2xl font-bold text-white/90">
                                    {currentStep === 1 ? 'Choose Payment Method' : 'Manual Payment'}
                                </h2>
                                <p className="text-sm text-white/45 mt-1">
                                    {currentStep === 1 ? 'Select your preferred payment method and complete enrollment' : 'Complete your payment details'}
                                </p>
                            </div>
                            <div className="p-6">
                                {currentStep === 1 ? (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            {/* Auto-Selected Batch Info */}
                                            {featuredBatchId ? (
                                                <>
                                                    <div className="space-y-4">
                                                        <h3 className="text-base font-semibold flex items-center gap-2.5 text-white/80">
                                                            <div className="w-6 h-6 bg-primary/15 border border-primary/30 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                                                1
                                                            </div>
                                                            Enrolling in Current Batch
                                                        </h3>
                                                        <div className="bg-primary/6 border border-primary/20 rounded-xl p-4 space-y-3">
                                                            <div>
                                                                <p className="text-xs text-white/40 mb-0.5">Batch</p>
                                                                <p className="font-semibold text-white/85">{featuredBatchId?.title}</p>
                                                            </div>
                                                            {featuredCourseId && (
                                                                <div>
                                                                    <p className="text-xs text-white/40 mb-0.5">Course</p>
                                                                    <p className="font-medium text-white/70">{featuredCourseId.title}</p>
                                                                </div>
                                                            )}
                                                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/15">
                                                                {featuredBatchId.startDate && (
                                                                    <div>
                                                                        <p className="text-xs text-white/40">Enrollment Starts</p>
                                                                        <p className="text-sm font-medium text-white/70">{new Date(featuredBatchId.enrollmentStartDate).toLocaleDateString()}</p>
                                                                    </div>
                                                                )}
                                                                {featuredBatchId.enrollmentEndDate && (
                                                                    <div>
                                                                        <p className="text-xs text-white/40">Enrollment Ends</p>
                                                                        <p className="text-sm font-medium text-white/70">{new Date(featuredBatchId.enrollmentEndDate).toLocaleDateString()}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
                                                </>
                                            ) : (
                                                <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-4 text-center">
                                                    <p className="text-yellow-400 font-medium">No upcoming batches available at the moment</p>
                                                    <p className="text-sm text-white/40 mt-1">Please check back later or contact support</p>
                                                </div>
                                            )}

                                            {/* Video Tutorial Section */}
                                            <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTutorial(!showTutorial)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-primary/8 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center">
                                                            <Play className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="font-semibold text-white/85 text-sm">Payment Tutorial Video</h4>
                                                            <p className="text-xs text-white/45">Learn how to complete your payment step by step</p>
                                                        </div>
                                                    </div>
                                                    {showTutorial ? (
                                                        <ChevronUp className="w-5 h-5 text-primary/60" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-primary/60" />
                                                    )}
                                                </button>
                                                {showTutorial && (
                                                    <div className="px-4 pb-4 space-y-3 border-t border-primary/15">
                                                        <div className="aspect-video bg-black rounded-lg overflow-hidden mt-3">
                                                            <iframe
                                                                className="w-full h-full"
                                                                src="https://www.youtube.com/embed/UC4LM-u9TqM"
                                                                title="Payment Tutorial"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                        <div className="bg-primary/8 border border-primary/15 rounded-lg p-3 text-sm">
                                                            <p className="font-medium mb-2 text-white/70">📋 Quick Steps:</p>
                                                            <ol className="list-decimal list-inside space-y-1 text-white/50 text-xs">
                                                                <li>Select your preferred payment method below</li>
                                                                <li>For SSLCommerz: You&lsquo;ll be redirected to secure payment gateway</li>
                                                                <li>For Phone Pay: Follow manual payment instructions</li>
                                                                <li>Complete payment and wait for confirmation</li>
                                                            </ol>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
                                            {/* Payment Methods */}
                                            <div className="space-y-4">
                                                <h3 className="text-base font-semibold flex items-center gap-2.5 text-white/80">
                                                    <div className="w-6 h-6 bg-primary/15 border border-primary/30 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                                        2
                                                    </div>
                                                    Payment Method
                                                </h3>
                                                <FormField
                                                    control={form.control}
                                                    name="paymentMethod"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                {/* SSLCommerz with Gateway Icons */}
                                                                <div
                                                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${field.value === 'SSLCommerz'
                                                                        ? 'border-primary bg-primary/10 shadow-[0_0_24px_hsl(156_70%_42%/0.2)]'
                                                                        : 'border-primary/20 bg-primary/4 hover:border-primary/40'
                                                                        }`}
                                                                    onClick={() => field.onChange('SSLCommerz')}
                                                                >
                                                                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">
                                                                        Popular
                                                                    </span>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-9 h-9 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                                                                                <CreditCard className="w-5 h-5 text-green-400" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <h4 className="font-semibold text-white/85">SSLCommerz</h4>
                                                                            </div>
                                                                            <div
                                                                                className={`w-4 h-4 rounded-full border-2 transition-colors ${field.value === 'SSLCommerz'
                                                                                    ? 'border-primary bg-primary'
                                                                                    : 'border-white/30'
                                                                                    }`}
                                                                            >
                                                                                {field.value === 'SSLCommerz' && (
                                                                                    <div className="w-full h-full rounded-full bg-white scale-[0.45]" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {/* Payment Gateway Icons */}
                                                                        <div className="items-center gap-2 pt-2 border-t border-primary/15">
                                                                            <span className="text-xs text-white/40 mb-2 block">Pay with:</span>
                                                                            <div className="grid grid-cols-3 gap-1.5">
                                                                                {[one, two, three, four, six, seven, eight, nine, ten, five].map((src, i) => (
                                                                                    <div key={i} className="bg-white rounded-lg overflow-hidden flex items-center justify-center h-[52px]">
                                                                                        <Image src={src} alt="payment gateway" className="object-contain w-full h-full p-1.5" />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Manual Payment */}
                                                                <div
                                                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${field.value === 'phonePay'
                                                                        ? 'border-primary bg-primary/10 shadow-[0_0_24px_hsl(156_70%_42%/0.2)]'
                                                                        : 'border-primary/20 bg-primary/4 hover:border-primary/40'
                                                                        }`}
                                                                    onClick={() => field.onChange('phonePay')}
                                                                >
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                                                                            <Smartphone className="w-5 h-5 text-blue-400" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <h4 className="font-semibold text-white/85">Phone Pay</h4>
                                                                        </div>
                                                                        <div
                                                                            className={`w-4 h-4 rounded-full border-2 transition-colors ${field.value === 'phonePay'
                                                                                ? 'border-primary bg-primary'
                                                                                : 'border-white/30'
                                                                            }`}
                                                                        >
                                                                            {field.value === 'phonePay' && (
                                                                                <div className="w-full h-full rounded-full bg-white scale-[0.45]" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="border-t border-primary/15 pt-3">
                                                                            <p className="text-xs text-white/45 pb-2">Pay with your phone pay account:</p>
                                                                        <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center h-[56px] max-w-[200px]">
                                                                            <Image src={phonepay} alt="Phone Pay" className="object-contain w-full h-full p-2" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
                                            {/* Submit Button */}
                                            <div className="space-y-4">
                                                <div className="relative overflow-hidden rounded-xl bg-primary/8 border border-primary/20 p-4">
                                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                                                    <div className="flex justify-between items-center font-semibold text-lg">
                                                        <span className="text-white/70">Total Amount:</span>
                                                        <span className="text-primary font-bold">৳{(featuredBatchId?.price)}</span>
                                                    </div>
                                                </div>
                                                {!isEnrollmentOpen && featuredBatchId && (
                                                    <div className="rounded-xl bg-yellow-500/8 border border-yellow-500/20 p-3 text-center">
                                                        <p className="text-sm text-yellow-400 font-medium">এনরোলমেন্ট উইন্ডো এখনো খোলা হয়নি</p>
                                                        {featuredBatchId.enrollmentStartDate && (
                                                            <p className="text-xs text-white/40 mt-1">
                                                                শুরু: {new Date(featuredBatchId.enrollmentStartDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="space-y-4">
                                                    <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={agreed}
                                                            onChange={() => setAgreed(!agreed)}
                                                            className="mt-1 accent-primary"
                                                        />
                                                        <span className="text-white/50 leading-relaxed">
                                                            I have read and agree to the{' '}
                                                            <a href="/terms-and-conditions" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">Terms & Conditions</a>,{' '}
                                                            <a href="/privacy-policy" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">Privacy Policy</a>, and{' '}
                                                            <a href="/refund-policy" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-2">Return, Refund & Cancellation Policy</a>.
                                                        </span>
                                                    </label>
                                                    <div className={`relative p-[1.5px] rounded-xl overflow-hidden transition-opacity ${!(form.formState.isValid && agreed && isEnrollmentOpen) || isProcessing ? 'opacity-50' : ''}`}>
                                                        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                                        <button
                                                            type="submit"
                                                            disabled={!(form.formState.isValid && agreed && isEnrollmentOpen) || isProcessing}
                                                            className="relative w-full bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41] disabled:cursor-not-allowed transition-all duration-300 text-white font-bold py-3.5 rounded-xl text-base"
                                                        >
                                                            {isProcessing ? (
                                                                <span className="flex items-center justify-center gap-2">
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Processing...
                                                                </span>
                                                            ) : !isEnrollmentOpen && featuredBatchId ? (
                                                                'এনরোলমেন্ট শুরু হয়নি'
                                                            ) : (
                                                                'Complete Enrollment'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </Form>
                                ) : currentStep === 2 ? (
                                    <ManualPaymentForm
                                        onBack={() => setCurrentStep(1)}
                                        onPaymentComplete={handleManualPaymentComplete}
                                        manualAmount={manualPaymentAmount}
                                        manualCurrency={manualPaymentCurrency}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentCheckout;