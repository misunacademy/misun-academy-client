/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ArrowLeft, BookOpen, Sparkles, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

// Validation schema
const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
    confirmPassword: z.string().min(6, "পাসওয়ার্ড নিশ্চিতকরণ প্রয়োজন"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resetPassword } = useAuth();

    const token = searchParams?.get('token');

    const resetPasswordForm = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!token) {
            router.push('/auth');
        }
    }, [token, router]);

    const handleResetPassword = async (data: ResetPasswordFormData) => {
        if (!token) return;

        await resetPassword(data.newPassword, token);
        // Toast and redirect are handled by resetPassword method
    };

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-auto sticky top-0 z-[60]">
            {/* Breadcrumb */}
            <div className="bg-background/80 backdrop-blur-sm border-b ">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Reset Password</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Card */}
            <div className=" flex items-center justify-center p-4 overflow-auto">
                <Card className="max-w-md w-full overflow-hidden">
                    <CardHeader className="p-0 ">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <BookOpen size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold">Misun Academy</h2>
                                </div>
                            </div>
                            <p className="text-emerald-100">
                                পাসওয়ার্ড রিসেট করুন
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Form {...resetPasswordForm}>
                            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                                <FormField
                                    control={resetPasswordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>নতুন পাসওয়ার্ড</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center justify-center w-5 h-5"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={resetPasswordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center justify-center w-5 h-5"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={resetPasswordForm.formState.isSubmitting}>
                                    {resetPasswordForm.formState.isSubmitting ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default ResetPasswordPage;