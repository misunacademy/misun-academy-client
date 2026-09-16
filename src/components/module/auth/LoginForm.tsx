'use client';

import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { InputField } from "@/components/forms/input-field";
import { PasswordField } from "@/components/forms/password-field";
import { AuthSubmitButton } from "@/components/shared/AuthSubmitButton";
import { GoogleSignInButton } from "@/components/shared/GoogleSignInButton";
import { Divider } from "@/components/shared/Divider";

const loginSchema = z.object({
  email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(1, "পাসওয়ার্ড প্রয়োজন"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<{ success: boolean; error?: string } | void>;
  onForgotPassword: () => void;
}

const INPUT_CLASSES = "h-11 !bg-[#0d1f12] !border-primary/25 text-white placeholder:text-white/30 focus-visible:!ring-1 focus-visible:!ring-primary/40 hover:!border-primary/40 transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgb(13,31,18)] autofill:[-webkit-text-fill-color:white]";

const LoginForm = ({ onLogin, onForgotPassword }: LoginFormProps) => {
  const { signInWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      toast.error(result.error || "Google লগইন ব্যর্থ হয়েছে");
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setErrorMessage(null);
    const result = await onLogin(data);
    if (result && !result.success) {
      setErrorMessage(result.error || "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="space-y-5">
      <GoogleSignInButton onClick={handleGoogleLogin} label="Google দিয়ে লগইন করুন" />
      <Divider />

      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <InputField
            name="email"
            label="ইমেইল"
            labelClassName="text-white/70"
            type="email"
            placeholder="your@email.com"
            required
            className={INPUT_CLASSES}
          />

          <PasswordField
            name="password"
            label="পাসওয়ার্ড"
            labelClassName="text-white/70"
            required
            className={INPUT_CLASSES}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-primary/80 hover:text-primary transition-colors font-medium"
              onClick={onForgotPassword}
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>

          <AuthSubmitButton loadingText="লগইন হচ্ছে...">
            লগইন করুন
          </AuthSubmitButton>

          {errorMessage && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400"
            >
              {errorMessage}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
