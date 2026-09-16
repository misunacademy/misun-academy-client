'use client';

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { InputField } from "@/components/forms/input-field";
import { AuthSubmitButton } from "@/components/shared/AuthSubmitButton";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

const forgetPasswordSchema = z.object({
  email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন"),
});

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

const INPUT_CLASSES = "h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors";

const ForgotPasswordModal = ({ onClose }: { onClose: () => void }) => {
  const { forgotPassword } = useAuth();
  const forgetPasswordForm = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleForgetPassword = async (data: ForgetPasswordFormData) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      onClose();
      forgetPasswordForm.reset();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface border border-primary/25 shadow-[0_0_60px_hsl(156_70%_42%/0.2)]">
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
              <AnimatedBorder variant="simple" speed="4s" />
              <div className="relative w-14 h-14 rounded-full bg-surface flex items-center justify-center">
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
              <InputField name="email" label="ইমেইল" labelClassName="text-white/70" type="email" placeholder="your@email.com" required className={INPUT_CLASSES} />

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-primary/25 text-white/55 hover:border-primary/45 hover:text-white/80 transition-all text-sm font-medium">
                  বাতিল
                </button>
                <div className="flex-1">
                  <AuthSubmitButton loadingText="পাঠানো হচ্ছে..." buttonClassName="py-2.5 rounded-[10px] text-sm">
                    ইমেইল পাঠান
                  </AuthSubmitButton>
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
