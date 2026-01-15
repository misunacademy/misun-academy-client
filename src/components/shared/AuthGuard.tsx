/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Cookies from 'js-cookie';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[]; // Optional role-based access control
}

export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Best-effort Better Auth session check; don't bail if it errors
                let betterPayload: any = null;
                try {
                    const session = await authClient.getSession();
                    betterPayload = (session as any)?.data ?? (session as any)?.user ?? (session as any)?.session;
                } catch (sessionError) {
                    console.warn('[AuthGuard] better-auth session check failed, falling back to JWT token', sessionError);
                }

                if (betterPayload?.user || betterPayload?.id) {
                    setIsAuthenticated(true);
                    setUserRole(betterPayload?.user?.role || null);
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

                        if (res.ok) {
                            const payload = await res.json();
                            if (payload?.data) {
                                setIsAuthenticated(true);
                                setUserRole(payload.data.role);
                                return;
                            }
                        }
                    } catch (err) {
                        console.error('Server token validation failed:', err);
                    }
                }

                setIsAuthenticated(false);
                console.warn('[AuthGuard] No valid session or token — redirecting to /auth');
                const redirectUrl = `/auth?redirectTo=${encodeURIComponent(pathname)}`;
                router.push(redirectUrl);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                console.warn('[AuthGuard] Error during auth check — redirecting to /auth', error);
                const redirectUrl = `/auth?redirectTo=${encodeURIComponent(pathname)}`;
                router.push(redirectUrl);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    // Role-based access control
    useEffect(() => {
        if (!isLoading && isAuthenticated && userRole) {
            // Check if user is accessing admin routes
            const isAdminRoute = pathname.startsWith('/dashboard/admin');
            const isStudentRoute = pathname.startsWith('/dashboard/student');

            const hasAdminAccess = ['superadmin', 'admin', 'instructor'].includes(userRole.toLowerCase());
            const hasStudentAccess = userRole.toLowerCase() === 'learner';

            // Redirect if user doesn't have access to the route
            if (isAdminRoute && !hasAdminAccess) {
                console.warn('[AuthGuard] Insufficient permissions for admin route - redirecting to student dashboard');
                router.push('/dashboard/student');
                return;
            }

            if (isStudentRoute && !hasStudentAccess) {
                console.warn('[AuthGuard] Student accessing student route but has admin role - redirecting to admin dashboard');
                router.push('/dashboard/admin');
                return;
            }
        }
    }, [isLoading, isAuthenticated, userRole, pathname, router]);

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