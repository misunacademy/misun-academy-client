/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    BaseQueryApi,
    BaseQueryFn,
    DefinitionType,
    FetchArgs,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { authClient } from '@/lib/auth-client';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {

        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<
    FetchArgs,
    BaseQueryApi,
    DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 404) {
        //@ts-ignore
        toast.error(result.error.data.message || "Something went wrong");
    }
    if (result?.error?.status === 403) {
        //@ts-ignore
        toast.error(result.error.data.message);
    }
    if (result?.error?.status === 401) {
        console.warn('[baseApi] 401 Unauthorized - session expired or invalid');
        
        // Better Auth handles sessions via HTTP-only cookies
        // Sign out and redirect to login
        await authClient.signOut();
        
        if (typeof window !== 'undefined') {
            toast.error('Your session has expired. Please login again.');
            window.location.href = '/auth';
        }
        
        return result;
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: [
        'Users', 
        'Students', 
        'Batches', 
        'Pricing-Plan', 
        'Courses', 
        'CourseEnrollments', 
        'Profile', 
        'Payments', 
        'Recordings',
        'Certificates',
        'Instructors',
        'Progress',
        'Dashboard',
        'Uploads',
        'Modules',
        'Lessons',
        'Settings'
    ],
    endpoints: () => ({}),
});