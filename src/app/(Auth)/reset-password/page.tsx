"use client";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/forms/password-field";
import { AuthSubmitButton } from "@/components/shared/AuthSubmitButton";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import PageBackground from '@/components/shared/PageBackground';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  confirmPassword: z.string().min(6, "পাসওয়ার্ড নিশ্চিতকরণ প্রয়োজন"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const INPUT_CLASSES = "h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const token = searchParams?.get('token');

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      router.push('/auth');
    }
  }, [token, router]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!token) return;
    await resetPassword(data.newPassword, token);
  };

  if (!token) {
    return null;
  }

  return (
    <PageBackground
      gradient="bg-surface flex flex-col"
      dotOpacity="opacity-[0.04]"
      orbs={[
        { position: "-top-24 left-1/4", size: "w-[500px] h-[500px]", opacity: "bg-primary/7", blur: "blur-[120px]" },
        { position: "bottom-0 right-1/4", size: "w-80 h-80", opacity: "bg-primary/5", blur: "blur-3xl" },
      ]}
    >
      <div className="relative z-10 border-b border-primary/15 bg-surface/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/55 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-white/75 text-sm">Reset Password</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 flex-1 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative p-[1.5px] rounded-full overflow-hidden">
                <AnimatedBorder variant="simple" speed="5s" />
                <div className="relative w-16 h-16 rounded-full bg-surface flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">MISUN Academy</span>
            </div>
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Reset your </span>
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.5)]">password</span>
            </h1>
            <p className="text-white/40 text-sm mt-2">নতুন পাসওয়ার্ড দিয়ে আপনার অ্যাকাউন্ট সুরক্ষিত করুন</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-surface border border-primary/20 shadow-[0_0_60px_hsl(156_70%_42%/0.12)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />

            <div className="p-6">
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-5">
                  <PasswordField name="newPassword" label="নতুন পাসওয়ার্ড" labelClassName="text-white/70" required className={INPUT_CLASSES} />
                  <PasswordField name="confirmPassword" label="পাসওয়ার্ড নিশ্চিত করুন" labelClassName="text-white/70" required className={INPUT_CLASSES} />
                  <AuthSubmitButton loadingText="রিসেট হচ্ছে...">
                    পাসওয়ার্ড রিসেট করুন
                  </AuthSubmitButton>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
