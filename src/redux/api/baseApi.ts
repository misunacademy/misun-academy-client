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

        // Better Auth handles sessions via HTTP-only cookies
        // Sign out and redirect to login
        await authServerApi.signOut();

        if (typeof window !== 'undefined') {
            toast.error('Your session has expired. Please login again.');
            const loginUrl = new URL('/auth', window.location.origin);
            const redirectPath = `${window.location.pathname}${window.location.search}`;
            loginUrl.searchParams.set('redirect_url', redirectPath);
            window.location.href = loginUrl.toString();
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
    ],
    endpoints: () => ({}),
});