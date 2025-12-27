/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Cookies from 'js-cookie';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await authClient.getSession();
                const betterPayload = (session as any)?.data ?? (session as any)?.user ?? (session as any)?.session;
                if (betterPayload?.user || betterPayload?.id) {
                    setIsAuthenticated(true);
                    return;
                }

                // Fallback: check server token (email/password auth)
                const token = Cookies.get('token');
                if (token) {
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/me`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
console.log("res",res)
                        if (res.ok) {
                            const payload = await res.json();
                            if (payload?.data) {
                                setIsAuthenticated(true);
                                return;
                            }
                        }
                    } catch (err) {
                        console.error('Server token validation failed:', err);
                    }
                }

                setIsAuthenticated(false);
                console.warn('[AuthGuard] No valid session or token — redirecting to /auth');
                router.push('/auth');
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                console.warn('[AuthGuard] Error during auth check — redirecting to /auth', error);
                router.push('/auth');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}