/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, ArrowLeft, Sparkles, Loader2, CreditCard, Smartphone, Play, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { courseInfo } from "@/constants/enrollment";
import Image from "next/image";
import ManualPaymentForm from "./ManualPaymentForm";
import { CourseThumbnail } from "@/assets/images";
import { useEnrollStudentMutation, useEnrollStudentManualMutation } from "@/redux/features/student/studentApi";
import { useGetAllBatchesQuery } from "@/redux/features/batch/batchApi";
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

const EnrollmentCheckout = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState<EnrollmentForm | null>(null);
    const [enrollStudent] = useEnrollStudentMutation();
    const [enrollStudentManual] = useEnrollStudentManualMutation();
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    // Initialize form first
    const form = useForm<EnrollmentForm>({
        resolver: zodResolver(enrollmentSchema),
        mode: 'onChange',
        defaultValues: {
            batchId: "",
            paymentMethod: undefined,
        },
    });

    // Fetch available batches
    const { data: batchesData, isLoading: batchesLoading } = useGetAllBatchesQuery({});
    const allBatches = batchesData?.data || [];

    // Filter for open/running batches only
    const batches = allBatches.filter((batch: any) => {
        const now = new Date();
        const enrollmentStart = batch.enrollmentStartDate ? new Date(batch.enrollmentStartDate) : null;
        const enrollmentEnd = batch.enrollmentEndDate ? new Date(batch.enrollmentEndDate) : null;

        // Check if batch is currently open for enrollment
        const isEnrollmentOpen = enrollmentStart && enrollmentEnd &&
            now >= enrollmentStart && now <= enrollmentEnd;

        // Check if batch has capacity (if maxCapacity is set)
        const hasCapacity = !batch.maxCapacity ||
            (batch.currentEnrollment < batch.maxCapacity);

        // Batch must have Published/Running status and be within enrollment period
        return isEnrollmentOpen && hasCapacity &&
            (batch.status === 'upcoming' || batch.status === 'running');
    });

    // Auto-select first batch if available and none selected
    useEffect(() => {
        if (batches.length > 0 && !form.getValues('batchId')) {
            form.setValue('batchId', String(batches[0]._id));
        }
    }, [batches, form]);

    // Get selected batch details
    const selectedBatchId = form.watch('batchId');
    const selectedBatch = batches.find((batch: any) => String(batch._id) === selectedBatchId);
    const selectedCourse = selectedBatch?.courseId;

    const processSSLCommerzPayment = async (data: EnrollmentForm) => {
        setIsProcessing(true);
        try {
            const res = await enrollStudent({
                batchId: data.batchId,
            }).unwrap();

            console.log('Payment response:', res);

            if (!res?.data?.paymentUrl) {
                toast.error("Failed to get payment URL. Please try again.");
                setIsProcessing(false);
                return;
            }

            toast.success("Redirecting to SSLCommerz...", {
                description: "You'll be redirected to complete your payment securely.",
            });

            setRedirectUrl(res.data.paymentUrl);

        } catch (error: unknown) {
            console.error('Payment error:', error);
            const paymentError = error as PaymentError;
            toast.error(paymentError?.data?.message || "Payment initiation failed. Please try again.");
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
                setCurrentStep(3);
            }
        }
        catch (err: unknown) {
            const errM = err as { data: { message: string } };
            toast.error(errM?.data?.message || "Something went wrong!");
        } finally {
            setIsProcessing(false);
        }
    };

    const goBack = () => {
        if (currentStep === 2) setCurrentStep(1);
        else if (currentStep === 3) setCurrentStep(1);
        else window.history.back();
    };

    // Redirect effect

    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    if (currentStep === 3) {
        return (
            <div className="min-h-screen gradient-bg">
                <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={goBack}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Enrollment Successful</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <Card className="glass-card">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-success-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Enrollment Successful!</h3>
                                <p className="text-muted-foreground mb-6">
                                    Thank you for enrolling! We&apos;ll contact you within 24 hours to confirm your enrollment and payment details.
                                </p>
                                <Button onClick={goBack} className="w-full">
                                    Back to Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen gradient-bg max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={goBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="font-semibold">
                                {currentStep === 1 ? 'Payment Method' : currentStep === 2 ? 'Manual Payment' : 'Course Enrollment'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Course Info - Left Side */}
                    <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
                        <Card className="glass-card form-animate">
                            <CardHeader>
                                {batchesLoading ? (
                                    <div className="aspect-video rounded-lg mb-4 bg-muted animate-pulse" />
                                ) : selectedCourse ? (
                                    <>
                                        <div className="aspect-video rounded-lg mb-4 relative overflow-hidden">
                                            <Image
                                                src={selectedCourse.thumbnailImage || CourseThumbnail.src}
                                                alt={selectedCourse.title || 'Course'}
                                                width={400}
                                                height={280}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{selectedCourse.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{selectedCourse.shortDescription}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{selectedCourse.durationEstimate || '4'} Months</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Please select a batch to see course details</p>
                                    </div>
                                )}
                            </CardHeader>
                            {selectedCourse && (
                                <CardContent>
                                    <div className="space-y-4">
                                        {selectedBatch && (
                                            <div className="bg-accent/50 rounded-lg p-3 space-y-2">
                                                <div>
                                                    <h4 className="font-semibold text-sm mb-1">Selected Batch</h4>
                                                    <p className="text-sm font-medium">{selectedBatch.title}</p>
                                                </div>
                                                {selectedBatch.startDate && (
                                                    <p className="text-xs text-muted-foreground">
                                                        <strong>Batch Starts:</strong> {new Date(selectedBatch.startDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                                {selectedBatch.enrollmentEndDate && (
                                                    <p className="text-xs text-muted-foreground">
                                                        <strong>Enrollment Ends:</strong> {new Date(selectedBatch.enrollmentEndDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                                {selectedBatch.maxCapacity && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                                                            <div
                                                                className="bg-primary h-full transition-all"
                                                                style={{
                                                                    width: `${Math.min((selectedBatch.currentEnrollment / selectedBatch.maxCapacity) * 100, 100)}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {selectedBatch.currentEnrollment}/{selectedBatch.maxCapacity}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Separator />

                                        <div>
                                            <h4 className="font-semibold mb-3">What you&apos;ll learn:</h4>
                                            <div className="grid gap-2  grid-cols-1 sm:grid-cols-2">
                                                <div className="flex-1 text-center items-start gap-2 bg-accent/30 rounded-md  bg-black text-white">
                                                    <span className="text-xs">Adobe Photoshop</span>
                                                </div>
                                                <div className="flex-1 text-center items-start gap-2 bg-accent/30 rounded-md  bg-black text-white">
                                                    <span className="text-xs">Adobe Illustrator</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="font-semibold mb-2">Course includes:</h4>
                                            <ul className="space-y-1 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <span>50+ hours of premium design tutorials</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <span>Hands-on projects with real-world examples</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <span>Lifetime access to course materials</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <span>Certificate of completion</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <span>1-on-1 mentorship sessions</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <span>Job placement assistance</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        {/* Price Summary */}
                        <Card className="glass-card">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {selectedBatch ? (
                                        <>
                                            <div className="flex justify-between items-center text-lg font-semibold">
                                                <span>Course Price</span>
                                                <span className="text-success">৳{(selectedBatch.price || 0).toLocaleString()}</span>
                                            </div>
                                            {selectedBatch.currency && selectedBatch.currency !== 'BDT' && (
                                                <p className="text-xs text-muted-foreground">Currency: {selectedBatch.currency}</p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <p className="text-sm">Select a batch to see pricing</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enrollment Form - Right Side */}
                    <div className="lg:col-span-2">
                        <Card className="glass-card form-animate">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    {currentStep === 1 ? 'Choose Payment Method' : 'Manual Payment'}
                                </CardTitle>
                                <CardDescription>
                                    {currentStep === 1 ? 'Select your preferred payment method and complete enrollment' : 'Complete your payment details'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentStep === 1 ? (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            {/* Auto-Selected Batch Info */}
                                            {selectedBatch ? (
                                                <>
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                                                                1
                                                            </div>
                                                            Enrolling in Current Batch
                                                        </h3>
                                                        <div className="bg-accent/30 border-2 border-primary/20 rounded-lg p-4 space-y-3">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Batch</p>
                                                                <p className="font-semibold text-lg">{selectedBatch.title}</p>
                                                            </div>
                                                            {selectedCourse && (
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">Course</p>
                                                                    <p className="font-medium">{selectedCourse.title}</p>
                                                                </div>
                                                            )}
                                                            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                                                {selectedBatch.startDate && (
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Batch Starts</p>
                                                                        <p className="text-sm font-medium">{new Date(selectedBatch.startDate).toLocaleDateString()}</p>
                                                                    </div>
                                                                )}
                                                                {selectedBatch.enrollmentEndDate && (
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Enrollment Ends</p>
                                                                        <p className="text-sm font-medium">{new Date(selectedBatch.enrollmentEndDate).toLocaleDateString()}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {selectedBatch.maxCapacity && (
                                                                <div className="pt-2">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <p className="text-xs text-muted-foreground">Enrollment Progress</p>
                                                                        <span className="text-xs font-medium">
                                                                            {selectedBatch.currentEnrollment}/{selectedBatch.maxCapacity} seats
                                                                        </span>
                                                                    </div>
                                                                    <div className="bg-background rounded-full h-2 overflow-hidden">
                                                                        <div
                                                                            className="bg-primary h-full transition-all"
                                                                            style={{
                                                                                width: `${Math.min((selectedBatch.currentEnrollment / selectedBatch.maxCapacity) * 100, 100)}%`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                </>
                                            ) : (
                                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                                                    <p className="text-destructive font-medium">No open batches available at the moment</p>
                                                    <p className="text-sm text-muted-foreground mt-1">Please check back later or contact support</p>
                                                </div>
                                            )}

                                            {/* Video Tutorial Section */}
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTutorial(!showTutorial)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <Play className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Payment Tutorial Video</h4>
                                                            <p className="text-xs text-blue-700 dark:text-blue-300">Learn how to complete your payment step by step</p>
                                                        </div>
                                                    </div>
                                                    {showTutorial ? (
                                                        <ChevronUp className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-blue-600" />
                                                    )}
                                                </button>
                                                {showTutorial && (
                                                    <div className="px-4 pb-4 space-y-3">
                                                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                                            <iframe
                                                                className="w-full h-full"
                                                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                                                title="Payment Tutorial"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                        <div className="bg-white dark:bg-gray-800 rounded-md p-3 text-sm">
                                                            <p className="font-medium mb-2 text-blue-900 dark:text-blue-100">📋 Quick Steps:</p>
                                                            <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 text-xs">
                                                                <li>Select your preferred payment method below</li>
                                                                <li>For SSLCommerz: You&lsquo;ll be redirected to secure payment gateway</li>
                                                                <li>For Phone Pay: Follow manual payment instructions</li>
                                                                <li>Complete payment and wait for confirmation</li>
                                                            </ol>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <Separator />
                                            {/* Payment Methods */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
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
                                                                    className={`payment-card relative cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === 'SSLCommerz'
                                                                            ? 'border-primary bg-accent shadow-medium'
                                                                            : 'border-border hover:border-primary/50'
                                                                        }`}
                                                                    onClick={() => field.onChange('SSLCommerz')}
                                                                >
                                                                    <Badge className="absolute -top-2 right-4 bg-warning text-warning-foreground">
                                                                        Popular
                                                                    </Badge>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <CreditCard className="w-6 h-6 text-green-600" />
                                                                            <div className="flex-1">
                                                                                <h4 className="font-medium">SSLCommerz</h4>
                                                                                <p className="text-sm text-muted-foreground">Pay with bKash, Rocket, Nagad, bank, or others</p>
                                                                            </div>
                                                                            <div
                                                                                className={`w-4 h-4 rounded-full border-2 ${field.value === 'SSLCommerz'
                                                                                        ? 'border-primary bg-primary'
                                                                                        : 'border-muted-foreground'
                                                                                    }`}
                                                                            >
                                                                                {field.value === 'SSLCommerz' && (
                                                                                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {/* Payment Gateway Icons */}
                                                                        <div className=" items-center gap-2 pt-2 border-t">
                                                                            <span className="text-xs text-muted-foreground">Accepted:</span>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 flex-wrap">
                                                                                <Image src={one} alt="" className="object-contain border" />
                                                                                <Image src={two} alt="Nagad" className="object-contain border" />
                                                                                <Image src={three} alt="Rocket" className="object-contain border" />
                                                                                <Image src={four} alt="Bank" className="object-contain border" />
                                                                                <Image src={six} alt="Cards" className="object-contain border" />
                                                                                <Image src={seven} alt="Cards" className="object-contain border" />
                                                                                <Image src={eight} alt="Cards" className="object-contain border" />
                                                                                <Image src={nine} alt="Cards" className="object-contain border" />
                                                                                <Image src={ten} alt="Cards" className="object-contain border" />
                                                                                <Image src={five} alt="Cards" className="object-contain border" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Manual Payment */}
                                                                <div
                                                                    className={`payment-card relative cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === 'phonePay'
                                                                            ? 'border-primary bg-accent shadow-medium'
                                                                            : 'border-border hover:border-primary/50'
                                                                        }`}
                                                                    onClick={() => field.onChange('phonePay')}
                                                                >
                                                                    <div className="flex items-center gap-3">

                                                                            <Smartphone className="w-6 h-6 text-blue-600" />
                                                                            <div className="flex-1">
                                                                                <h4 className="font-medium">Phone Pay</h4>
                                                                                <p className="text-sm text-muted-foreground">Pay with your phone pay account</p>
                                                                            </div>
                                                                            <div
                                                                                className={`w-4 h-4 rounded-full border-2 ${field.value === 'phonePay'
                                                                                        ? 'border-primary bg-primary'
                                                                                        : 'border-muted-foreground'
                                                                                    }`}
                                                                            >
                                                                                {field.value === 'phonePay' && (
                                                                                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                                                                                )}
                                                                            </div>

                                                                    </div>
                                                                     <div className="border-t h-24">
                                                                            <Image src={phonepay} alt="Phone Pay" className="object-contain  mt-2 h-20"/>
                                                                        </div>
                                                                </div>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Separator />
                                            {/* Submit Button */}
                                            <div className="space-y-4">
                                                <div className="bg-accent/50 rounded-lg p-4">
                                                    <div className="flex justify-between items-center font-semibold text-lg">
                                                        <span>Total Amount:</span>
                                                        <span className="text-success">৳{(selectedBatch?.price || courseInfo.price).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4 mt-6">
                                                    <label className="flex items-start gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={agreed}
                                                            onChange={() => setAgreed(!agreed)}
                                                            className="mt-1"
                                                        />
                                                        <span>
                                                            I have read and agree to the{' '}
                                                            <a href="/terms-and-conditions" target="_blank" className="text-blue-600 underline">Terms & Conditions</a>,{' '}
                                                            <a href="/privacy-policy" target="_blank" className="text-blue-600 underline">Privacy Policy</a>, and{' '}
                                                            <a href="/refund-policy" target="_blank" className="text-blue-600 underline">Return, Refund & Cancellation Policy</a>.
                                                        </span>
                                                    </label>
                                                    <Button
                                                        type="submit"
                                                        className="w-full h-12 text-lg glow-effect"
                                                        disabled={!(form.formState.isValid && agreed) || isProcessing}
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            'Complete Enrollment'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </Form>
                                ) : currentStep === 2 ? (
                                    <ManualPaymentForm
                                        onBack={() => setCurrentStep(1)}
                                        onPaymentComplete={handleManualPaymentComplete}
                                    />
                                ) : null}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentCheckout;