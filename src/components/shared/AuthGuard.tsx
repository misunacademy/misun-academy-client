/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthUser } from '@/types/auth';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[]; // Optional role-based access control
}

export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();

    const authUser = user as AuthUser | undefined;
    const isAuthenticated = !!authUser;
    const userRole = authUser?.role || null;

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            console.warn('[AuthGuard] No valid session — redirecting to /auth');
            const currentPath = typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : `${pathname}`;
            const redirectUrl = `/auth?redirect_url=${encodeURIComponent(currentPath)}`;
            router.replace(redirectUrl);
            return;
        }
    }, [isLoading, isAuthenticated, router, pathname]);

    // Role-based access control
    useEffect(() => {
        if (!isAuthenticated || isLoading) return;

        // Check if user is accessing admin routes
        const isAdminRoute = pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin');
        const isInstructorRoute = pathname.startsWith('/dashboard/instructor') || pathname.startsWith('/instructor');

        const role = userRole?.toLowerCase() || 'learner'; //  Safe null check
        const hasAdminAccess = ['superadmin', 'admin'].includes(role);
        const hasInstructorAccess = role === 'instructor';

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
    }, [isAuthenticated, userRole, pathname, router, requiredRoles, isLoading]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}