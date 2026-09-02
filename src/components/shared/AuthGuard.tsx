"use client";
import { useEffect, useRef, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthUser } from '@/types/auth';

type Role = AuthUser['role'];

interface AuthGuardProps {
    children: ReactNode;
    requiredRoles?: Role[];
    fallback?: ReactNode;
    unauthorizedRedirectTo?: string;
}

const roleHome: Record<Role, string> = {
    superadmin: '/dashboard/admin',
    admin: '/dashboard/admin',
    instructor: '/dashboard/instructor',
    employee: '/dashboard/employee',
    learner: '/my-classes',
};

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen" suppressHydrationWarning>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        </div>
    );
}

export default function AuthGuard({
    children,
    requiredRoles,
    fallback,
    unauthorizedRedirectTo,
}: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const mountedRef = useRef(false);

    const isAuthenticated = !!user;
    const userRole = (user as AuthUser | undefined)?.role || null;

    useEffect(() => {
        mountedRef.current = true;
    }, []);

    useEffect(() => {
        if (!mountedRef.current || isLoading) return;

        if (!isAuthenticated) {
            const currentPath = `${window.location.pathname}${window.location.search}`;
            const redirectUrl = `/auth?redirect_url=${encodeURIComponent(currentPath)}`;
            router.replace(redirectUrl);
            return;
        }

        const status = (user as AuthUser | undefined)?.status;

        if (status === 'suspended' && !pathname.startsWith('/auth/suspended')) {
            router.replace('/auth/suspended');
            return;
        }

        const role = userRole?.toLowerCase() as Role | undefined || 'learner';

        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            const destination = unauthorizedRedirectTo || roleHome[role] || '/my-classes';
            router.replace(destination);
            return;
        }

        const isAdminRoute = pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin');
        const isInstructorRoute = pathname.startsWith('/dashboard/instructor') || pathname.startsWith('/instructor');
        const isEmployeeRoute = pathname.startsWith('/dashboard/employee') || pathname.startsWith('/employee');
        const hasAdminAccess = ['superadmin', 'admin'].includes(role);
        const hasInstructorAccess = role === 'instructor';
        const hasEmployeeAccess = role === 'employee';
        const hasDashboardAccess = hasAdminAccess || hasInstructorAccess || hasEmployeeAccess;

        if (isAdminRoute && !hasAdminAccess) {
            router.replace(hasInstructorAccess ? '/dashboard/instructor' : hasEmployeeAccess ? '/dashboard/employee' : '/my-classes');
            return;
        }
        if (isInstructorRoute && !hasInstructorAccess && !hasAdminAccess) {
            router.replace('/my-classes');
            return;
        }
        if (isEmployeeRoute && !hasEmployeeAccess && !hasAdminAccess) {
            router.replace('/my-classes');
            return;
        }
        if (pathname.startsWith('/dashboard') && !hasDashboardAccess) {
            router.replace('/my-classes');
            return;
        }
    }, [isLoading, isAuthenticated, user, userRole, pathname, router, requiredRoles, unauthorizedRedirectTo]);

    if (!mountedRef.current) {
        return <>{children}</>;
    }

    if (isLoading || !isAuthenticated) {
        return <>{fallback || <LoadingFallback />}</>;
    }

    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole as Role)) {
        return <>{fallback || <LoadingFallback />}</>;
    }

    return <>{children}</>;
}
