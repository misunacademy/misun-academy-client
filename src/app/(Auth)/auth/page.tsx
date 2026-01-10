
"use client";
import { ArrowLeft, BookOpen, Sparkles, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAppSelector } from "@/redux/hooks";


// Validation schemas
const loginSchema = z.object({
    email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন"),
    password: z.string().min(1, "পাসওয়ার্ড প্রয়োজন"),
});

const registerSchema = z.object({
    name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন"),
    password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
    confirmPassword: z.string().min(6, "পাসওয়ার্ড নিশ্চিতকরণ প্রয়োজন"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
});

const forgetPasswordSchema = z.object({
    email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

const AuthPage = () => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter();
    const { signIn, signUp, signInWithGoogle } = useAuth();
    // const user = useAppSelector((state ) => state.auth.user);



    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const forgetPasswordForm = useForm<ForgetPasswordFormData>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleGoogleLogin = async () => {
        toast.info("Google OAuth-এ রিডাইরেক্ট করা হচ্ছে...");
        const result = await signInWithGoogle();
        if (!result.success) {
            toast.error(result.error || "Google লগইন ব্যর্থ হয়েছে");
        }
        // Note: Success toast will be shown after OAuth callback in useAuth hook
    };

    const handleLogin = async (data: LoginFormData) => {
        const result = await signIn(data.email, data.password);
        if (result.success) {
            // Map user role to correct dashboard path
            const roleMap: Record<string, string> = {
                'superadmin': '/dashboard/admin',
                'admin': '/dashboard/admin',
                'instructor': '/dashboard/admin',
                'learner': '/dashboard/student',
            };
            const dashboardPath = result.user?.role ? roleMap[result.user.role.toLowerCase()] || '/dashboard/student' : '/dashboard/student';
            router.push(dashboardPath);
        } else {
            toast.error(result.error || "লগইন ব্যর্থ হয়েছে");
        }
    };

    const handleRegister = async (data: RegisterFormData) => {
        const result = await signUp(data.name, data.email, data.password);
        console.log("result",result);
        if (result.success) {
            // Map user role to correct dashboard path
            const roleMap: Record<string, string> = {
                'superadmin': '/dashboard/admin',
                'admin': '/dashboard/admin',
                'instructor': '/dashboard/admin',
                'learner': '/dashboard/student',
            };
            const dashboardPath = result.user?.role ? roleMap[result.user.role.toLowerCase()] || '/dashboard/student' : '/dashboard/student';
            router.push(dashboardPath);
        } else {
            toast.error(result.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        }
    };

    const handleForgetPassword = async () => {
        toast.info("পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল চেক করুন।");
        setShowForgotPassword(false);
        forgetPasswordForm.reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Breadcrumb - Fixed at top */}
            <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Authentication</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Card */}
            <div className="flex items-center justify-center p-4 flex-1">
                <Card className="max-w-md w-full overflow-hidden">
                    <CardHeader className="p-0">
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
                                {authMode === "login" ? "আপনার অ্যাকাউন্টে প্রবেশ করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "register")} className="w-full">
                            <TabsList className="w-full mb-6">
                                <TabsTrigger className="flex-1" value="login">
                                    লগইন
                                </TabsTrigger>
                                <TabsTrigger className="flex-1" value="register">
                                    রেজিস্টার
                                </TabsTrigger>
                            </TabsList>

                            {/* Login Form */}
                            <TabsContent value="login">
                                <Button variant="outline" className="w-full mb-4" onClick={handleGoogleLogin}>
                                    <span className="mr-3 inline-flex items-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </span>
                                    Google দিয়ে লগইন করুন
                                </Button>

                                <div className="my-6">
                                    <div className="relative flex items-center justify-center">
                                        <Separator className="absolute" />
                                        <span className="relative z-10 px-4 bg-background text-muted-foreground text-sm">অথবা</span>
                                    </div>
                                </div>

                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                                        <FormField
                                            control={loginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ইমেইল</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="your@email.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>পাসওয়ার্ড</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showLoginPassword ? "text" : "password"}
                                                                placeholder="••••••••"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                            >
                                                                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Switch id="remember" />
                                                <Label htmlFor="remember" className="text-muted-foreground">
                                                    মনে রাখুন
                                                </Label>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                                                onClick={() => setShowForgotPassword(true)}
                                            >
                                                পাসওয়ার্ড ভুলে গেছেন?
                                            </button>
                                        </div>

                                        <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                                            {loginForm.formState.isSubmitting ? "লগইন হচ্ছে..." : "লগইন করুন"}
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>

                            {/* Register Form */}
                            <TabsContent value="register">
                                <Button variant="outline" className="w-full mb-4" onClick={handleGoogleLogin}>
                                    <span className="mr-3 inline-flex items-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </span>
                                    Google দিয়ে সাইন আপ করুন
                                </Button>

                                <div className="my-6">
                                    <div className="relative flex items-center justify-center">
                                        <Separator className="absolute" />
                                        <span className="relative z-10 px-4 bg-background text-muted-foreground text-sm">অথবা</span>
                                    </div>
                                </div>

                                <Form {...registerForm}>
                                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                                        <FormField
                                            control={registerForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>পূর্ণ নাম</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="আপনার নাম" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registerForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ইমেইল</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="your@email.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registerForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>পাসওয়ার্ড</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showRegisterPassword ? "text" : "password"}
                                                                placeholder="••••••••"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                                            >
                                                                {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registerForm.control}
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
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

                                        <label className="flex items-start gap-2 cursor-pointer text-sm">
                                            <input type="checkbox" className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" required />
                                            <span className="text-muted-foreground">
                                                আমি <button type="button" className="text-emerald-600 hover:underline">শর্তাবলী</button> এবং <button type="button" className="text-emerald-600 hover:underline">গোপনীয়তা নীতি</button> সম্মত
                                            </span>
                                        </label>

                                        <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                                            {registerForm.formState.isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">পাসওয়ার্ড ভুলে গেছেন</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                আপনার ইমেইল ঠিকানা দিন। আমরা আপনাকে পাসওয়ার্ড রিসেট লিঙ্ক পাঠাব।
                            </p>
                        </div>
                        <Form {...forgetPasswordForm}>
                            <form onSubmit={forgetPasswordForm.handleSubmit(handleForgetPassword)} className="space-y-4">
                                <FormField
                                    control={forgetPasswordForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ইমেইল</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="your@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForgotPassword(false)}
                                    >
                                        বাতিল
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={forgetPasswordForm.formState.isSubmitting}
                                    >
                                        {forgetPasswordForm.formState.isSubmitting ? "পাঠানো হচ্ছে..." : "ইমেইল পাঠান"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthPage;