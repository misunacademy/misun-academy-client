/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function StudentDashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // Normalise BetterAuth session payload (accept multiple shapes returned by the lib)
    const betterPayload = (session as any)?.data ?? (session as any)?.user ?? (session as any)?.session;

    // If BetterAuth session is missing, fall back to server token validation using cookies
    if (!betterPayload?.user && !betterPayload?.id) {
        const cookieHeader = (await headers()).get('cookie') || '';
        const hasAppToken = /(^|;\s*)token=/.test(cookieHeader);

        if (hasAppToken) {
            // Validate token with backend /auth/me
            const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5000/api/v1';
            try {
                const res = await fetch(`${baseUrl}/auth/me`, {
                    headers: {
                        cookie: cookieHeader,
                    },
                    cache: 'no-store',
                });
                if (res.ok) {
                    const payload = await res.json();
                    if (payload?.data) {
                        return <StudentDashboardClient />;
                    }
                }
            } catch (err) {
                console.error('[StudentDashboard] server token validation failed', err);
            }
        }

        // No valid BetterAuth session or server token
        redirect('/auth');
    }

    return <StudentDashboardClient />;
}