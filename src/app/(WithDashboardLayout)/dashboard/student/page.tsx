'use client';

import { useSession } from '@/lib/auth-client';
import StudentDashboardClient from "./StudentDashboardClient";

export default function StudentDashboard() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!session?.user) {
        // Middleware will handle redirect to /auth
        return null;
    }

    return <StudentDashboardClient />;
}
