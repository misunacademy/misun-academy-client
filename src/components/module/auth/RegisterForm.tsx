
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
    name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন"),
    password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
    confirmPassword: z.string().min(6, "পাসওয়ার্ড নিশ্চিতকরণ প্রয়োজন"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
});


type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onRegister: (data: RegisterFormData) => void;
    showPassword: boolean;
    toggleShowPassword: () => void;
    showConfirmPassword: boolean;
    toggleShowConfirmPassword: () => void;
}

const RegisterForm = (
    { onRegister, showPassword, toggleShowPassword, showConfirmPassword, toggleShowConfirmPassword }: RegisterFormProps
) => {
    const { signInWithGoogle } = useAuth();
    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    const handleGoogleLogin = async () => {
        const result = await signInWithGoogle();
        if (!result.success) {
            toast.error(result.error || "Google লগইন ব্যর্থ হয়েছে");
        }
        // Note: Success toast will be shown after OAuth callback in useAuth hook
    };
    const handleRegister = async (data: RegisterFormData) => {
        await onRegister(data);
    };
    return (
        <div className="space-y-5">
            {/* Google button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-primary/6 border border-primary/20 text-white/75 text-sm font-medium hover:bg-primary/10 hover:border-primary/35 hover:text-white transition-all duration-200"
            >
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google দিয়ে সাইন আপ করুন
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-primary/15" />
                <span className="text-xs text-white/30 font-medium">অথবা</span>
                <div className="flex-1 h-px bg-primary/15" />
            </div>

            <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/65 text-sm">পূর্ণ নাম</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="আপনার নাম" {...field}
                                        className="h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors" />
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
                                <FormLabel className="text-white/65 text-sm">ইমেইল</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="your@email.com" {...field}
                                        className="h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors" />
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
                                <FormLabel className="text-white/65 text-sm">পাসওয়ার্ড</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className="h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
                                            onClick={toggleShowPassword}
                                        >
                                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
                                <FormLabel className="text-white/65 text-sm">পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className="h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
                                            onClick={toggleShowConfirmPassword}
                                        >
                                            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <label className="flex items-start gap-2.5 cursor-pointer text-sm">
                        <input type="checkbox" className="mt-1 accent-primary" required />
                        <span className="text-white/45 leading-relaxed">
                            আমি{' '}
                            <Link href="/terms-and-conditions" target="_blank" className="text-primary/80 hover:text-primary underline underline-offset-2">শর্তাবলী</Link>
                            {' '}এবং{' '}
                            <Link href="/privacy-policy" target="_blank" className="text-primary/80 hover:text-primary underline underline-offset-2">গোপনীয়তা নীতি</Link>
                            {' '}সম্মত
                        </span>
                    </label>

                    <div className={`relative p-[2px] rounded-xl overflow-hidden ${registerForm.formState.isSubmitting ? 'opacity-60' : ''}`}>
                        <span className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_35%,hsl(156_100%_60%)_50%,transparent_65%)]" />
                        <button type="submit" disabled={registerForm.formState.isSubmitting}
                            className="relative w-full bg-[#060f0a] hover:bg-primary/15 disabled:cursor-not-allowed transition-all duration-300 text-primary font-bold py-3 rounded-[10px] text-sm border border-primary/20 shadow-[inset_0_0_20px_hsl(156_70%_42%/0.08)]">
                            {registerForm.formState.isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RegisterForm;