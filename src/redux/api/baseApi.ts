import {
    BaseQueryApi,
    FetchArgs,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { authServerApi } from '@/lib/auth-server-api';

function getCSRFToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
            headers.set("X-CSRF-Token", csrfToken);
        }
        return headers;
    },
});

// Set once a 401 redirect starts so concurrent failures sign out exactly once.
let authRedirectInFlight = false;

const baseQueryWithSessionHandling = async (args: FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    const result = await baseQuery(args, api, extraOptions);

    const error = result.error as { status: number; data: { message?: string } } | undefined;
    const errorData = error?.data;

    if (error?.status === 404) {
        toast.error(errorData?.message || "Something went wrong");
    }
    if (error?.status === 403) {
        toast.error(errorData?.message || "Forbidden");
    }
    if (error?.status === 401) {
        const requestUrl = typeof args === "string" ? args : args.url;
        const isAuthRequest = requestUrl.includes("/auth/");
        const onAuthPage =
            typeof window !== "undefined" && window.location.pathname.startsWith("/auth");
        // Never react to auth-endpoint 401s (e.g. get-session) and never
        // redirect from the login page itself — both cause sign-out loops.
        // Dedupe concurrent 401s so N failing queries = one sign-out + toast.
        if (!isAuthRequest && !onAuthPage && !authRedirectInFlight) {
            authRedirectInFlight = true;
            // Better Auth handles sessions via HTTP-only cookies
            // Sign out and redirect to login
            try {
                await authServerApi.signOut();
            } catch {
                // Sign-out itself failing must not block the redirect.
            }

            if (typeof window !== 'undefined') {
                toast.error('Your session has expired. Please login again.');
                const loginUrl = new URL('/auth', window.location.origin);
                // Preserve where the user was (incl. mid-checkout) so login
                // can send them straight back.
                const redirectPath = `${window.location.pathname}${window.location.search}`;
                loginUrl.searchParams.set('redirect_url', redirectPath);
                window.location.href = loginUrl.toString();
            }

            // Page normally unloads on redirect; reset only as a fallback so
            // a cancelled navigation doesn't wedge future handling.
            setTimeout(() => {
                authRedirectInFlight = false;
            }, 5000);
        }

        return result;
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithSessionHandling,
    keepUnusedDataFor: 300,
    tagTypes: [
        'Users',
        'Students',
        'Batches',
        'Courses',
        'CourseEnrollments',
        'Profile',
        'Payments',
        'Refunds',
        'Recordings',
        'Certificates',
        'Instructors',
        'Dashboard',
        'Uploads',
        'Modules',
        'Lessons',
        'Settings',
        'Employees',
        'SpecialAccessEnrollments',
        'Notifications',
        'Quizzes',
        'Questions',
        'Attempts',
        'Leaderboard',
        'Zames',
        'AuditLogs',
        'Bootcamp',
        'Announcements',
    ],
    endpoints: () => ({}),
});