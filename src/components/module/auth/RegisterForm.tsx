'use client';

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Link from "next/link";
import { InputField } from "@/components/forms/input-field";
import { PasswordField } from "@/components/forms/password-field";
import { AuthSubmitButton } from "@/components/shared/AuthSubmitButton";
import { GoogleSignInButton } from "@/components/shared/GoogleSignInButton";
import { Divider } from "@/components/shared/Divider";

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
}

const INPUT_CLASSES = "h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgb(13,31,18)] autofill:[-webkit-text-fill-color:white]";

const RegisterForm = ({ onRegister }: RegisterFormProps) => {
  const { signInWithGoogle } = useAuth();
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      toast.error(result.error || "Google লগইন ব্যর্থ হয়েছে");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    await onRegister(data);
  };

  return (
    <div className="space-y-5">
      <GoogleSignInButton onClick={handleGoogleLogin} label="Google দিয়ে সাইন আপ করুন" />
      <Divider />

      <Form {...registerForm}>
        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
          <InputField name="name" label="পূর্ণ নাম" labelClassName="text-white/70" type="text" placeholder="আপনার নাম" required className={INPUT_CLASSES} />
          <InputField name="email" label="ইমেইল" labelClassName="text-white/70" type="email" placeholder="your@email.com" required className={INPUT_CLASSES} />
          <PasswordField name="password" label="পাসওয়ার্ড" labelClassName="text-white/70" required className={INPUT_CLASSES} />
          <PasswordField name="confirmPassword" label="পাসওয়ার্ড নিশ্চিত করুন" labelClassName="text-white/70" required className={INPUT_CLASSES} />

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

          <AuthSubmitButton loadingText="অ্যাকাউন্ট তৈরি হচ্ছে...">
            অ্যাকাউন্ট তৈরি করুন
          </AuthSubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
