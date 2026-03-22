'use client';

import { useAuth } from '@/hooks/useAuth';
import StudentDashboardClient from "./StudentDashboardClient";

export default function StudentDashboard() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        // Middleware will handle redirect to /auth
        return null;
    }

    return <StudentDashboardClient />;
}
