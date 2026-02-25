"use client";
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const VerifyEmailPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { verifyEmail } = useAuth();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
    const [message, setMessage] = useState(token ? '' : 'Invalid verification link');

    const isVerifying = useRef(false);

    useEffect(() => {
        if (!token || isVerifying.current) return;

        isVerifying.current = true;

        const verify = async () => {
            try {
                const result = await verifyEmail(token);

                if (result.success) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in.');
                    // Toast and redirect are handled by verifyEmail method
                } else {
                    // Check if error suggests already verified
                    if (result.error?.toLowerCase().includes('already verified') ||
                        result.error?.toLowerCase().includes('invalid token')) {
                        // If we get invalid token but we just tried to verify, it might be a race condition
                        // or user clicked link again. 
                        // For now, respect the error but maybe show a friendlier message if needed
                    }

                    setStatus('error');
                    setMessage(result.error || 'Verification failed');
                }
            } catch {
                setStatus('error');
                setMessage('An unexpected error occurred');
            }
        };

        verify();
    }, [token, verifyEmail]);

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
                        <span className="font-semibold text-white/75 text-sm">Email Verification</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center p-4 flex-1 py-10">
                <div className="w-full max-w-md">

                    {/* Animated status icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative p-[1.5px] rounded-full overflow-hidden">
                            <span className={`absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)] ${
                                status === 'loading' ? 'animate-[spin_1.5s_linear_infinite]' : 'animate-[spin_5s_linear_infinite]'
                            }`} />
                            <div className="relative w-20 h-20 rounded-full bg-[#060f0a] flex items-center justify-center">
                                {status === 'loading' && <Loader2 className="w-9 h-9 text-primary animate-spin" />}
                                {status === 'success' && <CheckCircle className="w-9 h-9 text-primary" />}
                                {status === 'error' && <XCircle className="w-9 h-9 text-red-400" />}
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/20 shadow-[0_0_60px_hsl(156_70%_42%/0.12)]">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-2xl" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-2xl" />

                        <div className="p-8 text-center">
                            <h2 className="text-xl font-bold mb-2">
                                {status === 'loading' && (
                                    <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">ইমেইল যাচাই হচ্ছে...</span>
                                )}
                                {status === 'success' && (
                                    <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.5)]">ইমেইল যাচাই সম্পন্ন!</span>
                                )}
                                {status === 'error' && (
                                    <span className="text-red-400">যাচাই ব্যর্থ হয়েছে</span>
                                )}
                            </h2>

                            <p className="text-white/45 text-sm mb-7 leading-relaxed">{message}</p>

                            {status === 'loading' && (
                                <div className="flex items-center justify-center gap-2 text-white/35 text-sm">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                                    </span>
                                    অনুগ্রহ করে অপেক্ষা করুন
                                </div>
                            )}

                            {status === 'success' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/8 border border-primary/20">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                        <span className="text-primary/90 text-sm font-medium">আপনার ইমেইল সফলভাবে নিশ্চিত হয়েছে</span>
                                    </div>
                                    <div className="relative p-[2px] rounded-xl overflow-hidden">
                                        <span className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_35%,hsl(156_100%_60%)_50%,transparent_65%)]" />
                                        <button
                                            onClick={() => router.push('/auth')}
                                            className="relative w-full bg-[#060f0a] hover:bg-primary/15 transition-all duration-300 text-primary font-bold py-3 rounded-[10px] text-sm border border-primary/20 shadow-[inset_0_0_20px_hsl(156_70%_42%/0.08)]"
                                        >
                                            লগইন পেজে যান
                                        </button>
                                    </div>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/auth')}
                                        className="w-full py-3 rounded-xl border border-primary/25 text-white/55 hover:border-primary/45 hover:text-white/80 transition-all text-sm font-medium"
                                    >
                                        লগইন পেজে ফিরুন
                                    </button>
                                    <div className="relative p-[2px] rounded-xl overflow-hidden">
                                        <span className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_35%,hsl(156_100%_60%)_50%,transparent_65%)]" />
                                        <button
                                            onClick={() => router.push('/auth?mode=register')}
                                            className="relative w-full bg-[#060f0a] hover:bg-primary/15 transition-all duration-300 text-primary font-bold py-3 rounded-[10px] text-sm border border-primary/20 shadow-[inset_0_0_20px_hsl(156_70%_42%/0.08)]"
                                        >
                                            আবার রেজিস্টার করুন
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;