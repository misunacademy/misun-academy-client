"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/features/auth/authSlice';
import { getValidatedRedirectUrl } from '@/lib/authUtils';
import { useEnrollment } from '@/hooks/useEnrollment';

const VerifyEmailPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { hasEnrollments } = useEnrollment();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
    const [message, setMessage] = useState(token ? '' : 'Invalid verification link');

    useEffect(() => {
        if (!token) return;

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const result = data.data;

                    // Store token in cookies and update Redux state
                    if (result.token) {
                        Cookies.set('token', result.token, { expires: 7, secure: false });
                        if (result.refreshToken) {
                            Cookies.set('refreshToken', result.refreshToken, { expires: 30, secure: false });
                        }
                        dispatch(setUser(result.user));
                    }

                    setStatus('success');
                    setMessage('Email verified successfully! You are now logged in.');
                    toast.success('Email verified successfully!');

                    // Redirect to intended page after a short delay
                    setTimeout(() => {
                        const redirectTo = searchParams.get('redirectTo');
                        const redirectUrl = getValidatedRedirectUrl(redirectTo, result.user.role, hasEnrollments);
                        router.push(redirectUrl);
                    }, 2000);
                } else {
                    const error = await response.json();
                    setStatus('error');
                    setMessage(error.message || 'Verification failed');
                    toast.error(error.message || 'Verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Network error occurred');
                toast.error('Network error occurred');
            }
        };

        verifyEmail();
    }, [token, dispatch, router, searchParams, hasEnrollments]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Breadcrumb */}
            <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Email Verification</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Card */}
            <div className="flex items-center justify-center p-4 flex-1">
                <Card className="max-w-md w-full overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                            <div className="flex items-center justify-center mb-2">
                                {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin" />}
                                {status === 'success' && <CheckCircle className="w-8 h-8" />}
                                {status === 'error' && <XCircle className="w-8 h-8" />}
                            </div>
                            <h2 className="text-2xl font-bold text-center">
                                {status === 'loading' && 'Verifying Email'}
                                {status === 'success' && 'Email Verified!'}
                                {status === 'error' && 'Verification Failed'}
                            </h2>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">{message}</p>
                            {status === 'success' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                                        <span className="text-green-600 font-medium">Redirecting to dashboard...</span>
                                    </div>
                                    <p className="text-sm text-gray-500">You will be automatically redirected in a few seconds.</p>
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="space-y-4">
                                    <Button onClick={() => router.push('/auth')} variant="outline" className="w-full">
                                        Back to Login
                                    </Button>
                                    <Button onClick={() => router.push('/auth?mode=register')} className="w-full">
                                        Register Again
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmailPage;