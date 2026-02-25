
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth"; // need forgotPassword helper
const forgetPasswordSchema = z.object({
    email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন"),
});

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;
const ForgotPasswordModal = (
    { onClose }: { onClose: () => void }
) => {
    const { forgotPassword } = useAuth();
    const forgetPasswordForm = useForm<ForgetPasswordFormData>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });
    const handleForgetPassword = async (data: ForgetPasswordFormData) => {
        const result = await forgotPassword(data.email);
        if (result.success) {
            onClose();
            forgetPasswordForm.reset();
        }
        // Toast messages are handled by the forgotPassword method
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/25 shadow-[0_0_60px_hsl(156_70%_42%/0.2)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />
                <button onClick={onClose}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-primary/8 border border-primary/20 text-white/40 hover:text-white/80 hover:bg-primary/15 transition-all flex items-center justify-center text-lg leading-none">
                    &#x2715;
                </button>
                <div className="p-7">
                    <div className="flex justify-center mb-5">
                        <div className="relative p-[1.5px] rounded-full overflow-hidden">
                            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                            <div className="relative w-14 h-14 rounded-full bg-[#060f0a] flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white/90 text-center mb-1">পাসওয়ার্ড ভুলে গেছেন</h2>
                    <p className="text-sm text-white/45 text-center mb-6">
                        আপনার ইমেইল ঠিকানা দিন। আমরা আপনাকে পাসওয়ার্ড রিসেট লিঙ্ক পাঠাব।
                    </p>
                    <Form {...forgetPasswordForm}>
                        <form onSubmit={forgetPasswordForm.handleSubmit(handleForgetPassword)} className="space-y-4">
                            <FormField
                                control={forgetPasswordForm.control}
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
                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl border border-primary/25 text-white/55 hover:border-primary/45 hover:text-white/80 transition-all text-sm font-medium">
                                    বাতিল
                                </button>
                                <div className={`flex-1 relative p-[2px] rounded-xl overflow-hidden ${forgetPasswordForm.formState.isSubmitting ? 'opacity-60' : ''}`}>
                                    <span className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_35%,hsl(156_100%_60%)_50%,transparent_65%)]" />
                                    <button type="submit" disabled={forgetPasswordForm.formState.isSubmitting}
                                        className="relative w-full bg-[#060f0a] hover:bg-primary/15 disabled:cursor-not-allowed transition-all duration-300 text-primary font-bold py-2.5 rounded-[10px] text-sm border border-primary/20 shadow-[inset_0_0_20px_hsl(156_70%_42%/0.08)]">
                                        {forgetPasswordForm.formState.isSubmitting ? "পাঠানো হচ্ছে..." : "ইমেইল পাঠান"}
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

export default ForgotPasswordModal;