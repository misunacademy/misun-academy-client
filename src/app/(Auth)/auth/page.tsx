/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ForgotPasswordModal from "@/components/module/auth/ForgotPasswordModal";
import EmailVerificationModal from "@/components/module/auth/EmailVerificationModal";
import LoginForm from "@/components/module/auth/LoginForm";
import RegisterForm from "@/components/module/auth/RegisterForm";
import { useGetMyEnrollmentsQuery } from "@/redux/api/enrollmentApi";


const AuthPage = () => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const router = useRouter();
    const { signIn, signUp, user, isAuthenticated, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const {data:EnrollmentsData,isLoading:isEnrollmentsLoading}=useGetMyEnrollmentsQuery({status: "active"}, { skip: !user }); // prime the cache with user's enrollments if logged in

  // guard against undefined length by defaulting to 0
  const redirectTo = searchParams.get('redirectTo');
  const isEnrolled = (EnrollmentsData?.data?.length ?? 0) > 0

    // handlers passed to forms
    const handleLogin = async (data: { email: string; password: string }) => {
        const result = await signIn(data.email, data.password, redirectTo || undefined);
        if (result.success) {
            import('@/lib/metaPixel').then(({ track }) => track('Lead'));
            // redirect/notification logic is handled inside useAuth
        }
    };

    const handleRegister = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
        const result = await signUp(data.name, data.email, data.password);
        if (result.success) {
            //  Track Lead immediately
            import('@/lib/metaPixel').then(({ track }) => track('Lead'));
            setRegisteredEmail(data.email);
            setShowVerificationModal(true);
        }
    };

    useEffect(() => {
        if (isLoading || isEnrollmentsLoading) return;

        if (isAuthenticated && user) {
            // User is already logged in, redirect to requested page or dashboard
            if (redirectTo && redirectTo !== '/auth') {
                router.replace(redirectTo);
            } else {
                const userRole = (user as any).role;
                const dashboardRoute = userRole === 'admin' || userRole === 'superadmin'
                    ? '/dashboard/admin'
                    : userRole === 'instructor'
                        ? '/dashboard/instructor'
                        : isEnrolled?'/my-classes':'/';
                router.replace(dashboardRoute);
            }
        }
    }, [isAuthenticated, user, redirectTo, router, isLoading,isEnrollmentsLoading,isEnrolled]);




    return (
        <div className="min-h-screen bg-[#060f0a] flex flex-col relative overflow-hidden">
            {/* Dot-grid */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />
            {/* Ambient glows */}
            <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/7 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top nav bar */}
            <div className="relative z-10 border-b border-primary/15 bg-[#060f0a]/80 backdrop-blur-sm">
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
                        <span className="font-semibold text-white/75 text-sm">Authentication</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center p-4 flex-1 py-10">
                <div className="w-full max-w-md">

                    {/* Brand header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative p-[1.5px] rounded-full overflow-hidden">
                                <span className="absolute inset-[-100%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                <div className="relative w-16 h-16 rounded-full bg-[#060f0a] flex items-center justify-center">
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
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                                {authMode === 'login' ? 'Welcome ' : 'Create your '}
                            </span>
                            <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.5)]">
                                {authMode === 'login' ? 'back' : 'account'}
                            </span>
                        </h1>
                        <p className="text-white/40 text-sm mt-2">
                            {authMode === 'login'
                                ? 'Sign in to continue your learning journey'
                                : 'Join thousands of students already learning'}
                        </p>
                    </div>

                    {/* Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/20 shadow-[0_0_60px_hsl(156_70%_42%/0.12)]">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />

                        {/* Tab switcher */}
                        <div className="flex border-b border-primary/15">
                            {(['login', 'register'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setAuthMode(tab)}
                                    className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 relative ${
                                        authMode === tab ? 'text-primary' : 'text-white/40 hover:text-white/70'
                                    }`}
                                >
                                    {tab === 'login' ? 'লগইন' : 'রেজিস্টার'}
                                    {authMode === tab && (
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 space-y-5">
                            {authMode === 'login' && (
                                <LoginForm
                                    onForgotPassword={() => setShowForgotPassword(true)}
                                    onLogin={handleLogin}
                                    showPassword={showLoginPassword}
                                    toggleShowPassword={() => setShowLoginPassword(!showLoginPassword)}
                                />
                            )}
                            {authMode === 'register' && (
                                <RegisterForm
                                    onRegister={handleRegister}
                                    showPassword={showRegisterPassword}
                                    toggleShowPassword={() => setShowRegisterPassword(!showRegisterPassword)}
                                    showConfirmPassword={showConfirmPassword}
                                    toggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}

            {showVerificationModal && (
                <EmailVerificationModal
                    email={registeredEmail}
                    onClose={() => { setShowVerificationModal(false); setAuthMode('login'); }}
                />
            )}
        </div>
    );
};

export default AuthPage;