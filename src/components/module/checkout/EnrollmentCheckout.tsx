'use client';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { courseInfo, paymentMethods } from "@/constants/enrollment";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ManualPaymentForm from "./ManualPaymentForm";
import { CourseThumbnail } from "@/assets/images";
import { useEnrollStudentMutation } from "@/redux/features/student/studentApi";
import { useGetCoursesQuery } from "@/redux/features/course/courseApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course } from "@/types/common";

interface PaymentError {
    data?: {
        message?: string;
    };
    message?: string;
}

const enrollmentSchema = z.object({
    courseId: z.string().min(1, "Please select a course"),
    studentName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
        .string()
        .regex(/^(\+?[0-9]{8,15}|01[3-9][0-9]{8})$/, "Please enter a valid phone number"),
    address: z.string().min(6, "Please provide a complete address"),
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
    const [enrollmentData, setEnrollmentData] = useState<EnrollmentForm | null>(null);
    const [enrollStudent] = useEnrollStudentMutation();
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    // Fetch available courses
    const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({
        isPublished: true,
        limit: 50
    });
    const courses = coursesData?.data || [];

    const form = useForm<EnrollmentForm>({
        resolver: zodResolver(enrollmentSchema),
        mode: 'onChange',
        defaultValues: {
            courseId: "",
            studentName: "",
            email: "",
            phone: "",
            address: "",
            paymentMethod: undefined,
        },
    });

    const processSSLCommerzPayment = async (data: EnrollmentForm) => {
        setIsProcessing(true);
        try {
            console.log(data)
            const res = await enrollStudent({
                courseId: data.courseId,
                name: data.studentName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                method: data.paymentMethod
            }).unwrap();

            console.log({ res })

            toast("Redirecting to SSLCommerz...", {
                description: "You'll be redirected to complete your payment securely.",
            });

            setRedirectUrl(res.data.paymentUrl);

        } catch (error: unknown) {
            const paymentError = error as PaymentError;
            toast(paymentError?.data?.message || "Payment Error");

            setIsProcessing(false);
        }
    };

    const onSubmit = (data: EnrollmentForm) => {
        setEnrollmentData(data);

        if (data.paymentMethod === "SSLCommerz") {
            processSSLCommerzPayment(data);
        } else if (data.paymentMethod === "phonePay") {
            setCurrentStep(5);
        }
    };

    const handleManualPaymentComplete = async (paymentData: object) => {
        if (!enrollmentData) {
            toast("Enrollment data missing!")
            return;
        }
        try {
            const res = await enrollStudent({
                courseId: enrollmentData.courseId,
                name: enrollmentData.studentName,
                email: enrollmentData.email,
                phone: enrollmentData.phone,
                address: enrollmentData.address,
                method: enrollmentData.paymentMethod,
                paymentData: paymentData
            }).unwrap();

            if (res?.data?.success) {
                setCurrentStep(6);
            }
        }
        catch (err: unknown) {
            const errM = err as { data: { message: string } }
            toast(errM?.data?.message || "Something Went Wrong!")
        }
    };

    const goBack = () => {
        if (currentStep === 2) setCurrentStep(1);
        else if (currentStep === 3) setCurrentStep(2);
        else if (currentStep === 4) setCurrentStep(3);
        else if (currentStep === 5) setCurrentStep(4);
        else window.history.back();
    };

    // Redirect effect

    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    if (currentStep === 6) {
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
                            {/* Step Progress Indicator */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">1</div>
                                    <div className="h-1 w-8 bg-primary"></div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">2</div>
                                    <div className="h-1 w-8 bg-primary"></div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">3</div>
                                    <div className="h-1 w-8 bg-primary"></div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">4</div>
                                </div>
                            </div>

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

    if (currentStep === 5) {
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
                                <span className="font-semibold">Manual Payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <Card className="glass-card">
                        <CardContent className="p-6">
                            {/* Step Progress Indicator */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">1</div>
                                    <div className="h-1 w-8 bg-primary"></div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">2</div>
                                    <div className="h-1 w-8 bg-primary"></div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">3</div>
                                    <div className="h-1 w-8 bg-primary"></div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">4</div>
                                </div>
                            </div>

                            <ManualPaymentForm
                                onBack={goBack}
                                onPaymentComplete={handleManualPaymentComplete}
                            />
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
                                {currentStep === 1 ? 'Student Information' : currentStep === 2 ? 'Payment Tutorial' : currentStep === 3 ? 'Payment Steps' : currentStep === 4 ? 'Payment Method' : 'Course Enrollment'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Course Info - Left Side */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="glass-card form-animate">
                            <CardHeader>
                                <div className="aspect-video rounded-lg mb-4 relative overflow-hidden">
                                    <Image
                                        src={CourseThumbnail.src}
                                        alt={courseInfo.title}
                                        width={400}
                                        height={280}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{courseInfo.duration}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">What you&apos;ll learn:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {courseInfo.highlights.map((highlight, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {highlight}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="font-semibold mb-2">Course includes:</h4>
                                        <ul className="space-y-1 text-sm">
                                            {courseInfo.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Price Summary */}
                        <Card className="glass-card">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Course Price</span>
                                        <span className="text-success">৳{courseInfo.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enrollment Form - Right Side */}
                    <div className="lg:col-span-2">
                        <Card className="glass-card form-animate">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    {currentStep === 1 ? 'Student Information' : currentStep === 2 ? 'Payment Tutorial' : currentStep === 3 ? 'Payment Steps' : 'Choose Payment Method'}
                                </CardTitle>
                                <CardDescription>
                                    {currentStep === 1 ? 'Please fill in your information to continue' : currentStep === 2 ? 'Watch the tutorial to understand the payment process' : currentStep === 3 ? 'Learn about the payment steps' : 'Complete your enrollment by selecting a payment method'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Step Progress Indicator */}
                                <div className="flex items-center justify-center mb-6">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
                                        <div className={`h-1 w-8 transition-colors ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
                                        <div className={`h-1 w-8 transition-colors ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
                                        <div className={`h-1 w-8 transition-colors ${currentStep >= 4 ? 'bg-primary' : 'bg-muted'}`}></div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>4</div>
                                    </div>
                                </div>

                                {currentStep === 1 || currentStep === 4 ? (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            {currentStep === 1 && (
                                                <>
                                                    {/* Student Information */}
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                                                                1
                                                            </div>
                                                            Student Information
                                                        </h3>
                                                        <p className="text-sm text-primary">Please fill in the information below according to your academic details. This information will be used for enrollment and certificate purposes.</p>
                                                        <FormField
                                                            control={form.control}
                                                            name="courseId"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Select Course *</FormLabel>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Choose a course" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {coursesLoading ? (
                                                                                <SelectItem value="loading" disabled>
                                                                                    Loading courses...
                                                                                </SelectItem>
                                                                            ) : courses.length === 0 ? (
                                                                                <SelectItem value="no-courses" disabled>
                                                                                    No courses available
                                                                                </SelectItem>
                                                                            ) : (
                                                                                courses.map((course:Course,idx:number) => (
                                                                                    <SelectItem key={course._id} value={course?._id ? String(course._id) : String(idx)}>
                                                                                        {course.title}
                                                                                    </SelectItem>
                                                                                ))
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <FormField
                                                                control={form.control}
                                                                name="studentName"
                                                                render={({ field, fieldState }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Full Name *</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="Enter your full name"
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
                                                                name="email"
                                                                render={({ field, fieldState }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Email Address *</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="email"
                                                                                placeholder="your.email@example.com"
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
                                                        </div>
                                                        <FormField
                                                            control={form.control}
                                                            name="phone"
                                                            render={({ field, fieldState }) => (
                                                                <FormItem>
                                                                    <FormLabel>WhatsApp Number *</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="e.g. 01712345678 or +14155552671"
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
                                                            name="address"
                                                            render={({ field, fieldState }) => (
                                                                <FormItem>
                                                                    <FormLabel>Complete Address *</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="House/Flat, Road, Area, District"
                                                                            {...field}
                                                                            className={cn(
                                                                                "min-h-[80px]",
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
                                                    </div>
                                                    <Separator />
                                                    <div className="flex justify-end">
                                                        <Button type="button" onClick={async () => {
                                                            const isValid = await form.trigger(['courseId', 'studentName', 'email', 'phone', 'address']);
                                                            if (isValid) setCurrentStep(2);
                                                        }}>Next: Payment Tutorial</Button>
                                                    </div>
                                                </>
                                            )}
                                            {currentStep === 4 && (
                                                <>
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
                                                                        {paymentMethods.map((method) => (
                                                                            <div
                                                                                key={method.id}
                                                                                className={`payment-card relative cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === method.id
                                                                                    ? "border-primary bg-accent shadow-medium"
                                                                                    : "border-border hover:border-primary/50"
                                                                                    }`}
                                                                                onClick={() => field.onChange(method.id)}
                                                                            >
                                                                                {method.popular && (
                                                                                    <Badge className="absolute -top-2 right-4 bg-warning text-warning-foreground">
                                                                                        Popular
                                                                                    </Badge>
                                                                                )}
                                                                                <div className="flex items-center gap-3">
                                                                                    <method.icon className={`w-6 h-6 ${method.color || "text-muted-foreground"}`} />
                                                                                    <div className="flex-1">
                                                                                        <h4 className="font-medium">{method.name}</h4>
                                                                                        <p className="text-sm text-muted-foreground">{method.description}</p>
                                                                                    </div>
                                                                                    <div className={`w-4 h-4 rounded-full border-2 ${field.value === method.id
                                                                                        ? "border-primary bg-primary"
                                                                                        : "border-muted-foreground"
                                                                                        }`}>
                                                                                        {field.value === method.id && (
                                                                                            <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
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
                                                                <span className="text-success">৳{courseInfo.price.toLocaleString()}</span>
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
                                                                    "Complete Enrollment"
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </form>
                                    </Form>
                                ) : currentStep === 2 ? (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold">Payment Tutorial Video</h3>
                                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                            <p>Payment tutorial video</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                                            <Button onClick={() => setCurrentStep(3)}>Next: Payment Steps</Button>
                                        </div>
                                    </div>
                                ) : currentStep === 3 ? (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold">Payment Process Steps</h3>
                                        <div className="grid gap-4">
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                                                        <div>
                                                            <h4 className="font-medium">Choose Payment Method</h4>
                                                            <p className="text-sm text-muted-foreground">Select your preferred payment option from the available methods.</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                                                        <div>
                                                            <h4 className="font-medium">Fill Payment Details</h4>
                                                            <p className="text-sm text-muted-foreground">Provide the necessary payment information securely.</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                                                        <div>
                                                            <h4 className="font-medium">Confirm Transaction</h4>
                                                            <p className="text-sm text-muted-foreground">Review and confirm your payment to complete the enrollment.</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="flex justify-between">
                                            <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                                            <Button onClick={() => setCurrentStep(4)}>Next: Choose Payment Method</Button>
                                        </div>
                                    </div>
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