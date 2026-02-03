/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[]; // Optional role-based access control
}

export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = useSession();
    const [hasChecked, setHasChecked] = useState(false);

    const user = session?.user as any;
    const isAuthenticated = !!user;
    const userRole = user?.role || null;

    useEffect(() => {
        if (isPending) return;

        if (!isAuthenticated) {
            console.warn('[AuthGuard] No valid session — redirecting to /auth');
            const redirectUrl = `/auth?redirectTo=${encodeURIComponent(pathname)}`;
            router.replace(redirectUrl);
            return;
        }

        setHasChecked(true);
    }, [isPending, isAuthenticated, router, pathname]);

    // Role-based access control
    useEffect(() => {
        if (!hasChecked || !isAuthenticated || !userRole) return;

        // Check if user is accessing admin routes
        const isAdminRoute = pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin');
        const isInstructorRoute = pathname.startsWith('/dashboard/instructor') || pathname.startsWith('/instructor');
        const isStudentRoute = pathname.startsWith('/dashboard/student') || pathname.startsWith('/dashboard');

        const role = userRole.toLowerCase();
        const hasAdminAccess = ['superadmin', 'admin'].includes(role);
        const hasInstructorAccess = role === 'instructor';
        const hasStudentAccess = role === 'learner';

        // Redirect if user doesn't have access to the route
        if (isAdminRoute && !hasAdminAccess) {
            console.warn('[AuthGuard] Insufficient permissions for admin route');
            if (hasInstructorAccess) {
                router.replace('/instructor/dashboard');
            } else {
                router.replace('/dashboard/student');
            }
            return;
        }

        if (isInstructorRoute && !hasInstructorAccess && !hasAdminAccess) {
            console.warn('[AuthGuard] Insufficient permissions for instructor route');
            router.replace('/dashboard/student');
            return;
        }

        // Optional: Check required roles if specified
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some(
                (requiredRole) => requiredRole.toLowerCase() === role
            );

            if (!hasRequiredRole) {
                console.warn('[AuthGuard] User does not have required role');
                // Redirect based on role
                if (hasAdminAccess) {
                    router.replace('/dashboard/admin');
                } else if (hasInstructorAccess) {
                    router.replace('/instructor/dashboard');
                } else {
                    router.replace('/dashboard/student');
                }
                return;
            }
        }
    }, [hasChecked, isAuthenticated, userRole, pathname, router, requiredRoles]);

    if (isPending || !hasChecked) {
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