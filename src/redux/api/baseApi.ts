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
import { logout } from "../features/auth/authSlice";
import { toast } from "sonner";
import Cookies from 'js-cookie';
// import { RootState } from "../store";

// const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
//   credentials: "include",
// });

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = Cookies.get("token"); // token must be set without httpOnly: true

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

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
        console.warn('[baseApi] 401 from request:', args);
        //* Send Refresh
        // console.log('Sending refresh token');

        const isSocialLogin = !!Cookies.get('better-auth.session_token');
        if (isSocialLogin) {
            console.warn('[baseApi] social login detected, dispatching logout without refresh');
            api.dispatch(logout());
            return result;
        }

        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
            console.warn('[baseApi] no refreshToken available, dispatching logout');
            api.dispatch(logout());
            return result;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            }
        );

        const data = await res.json();

        if (data?.data?.token) {
            // const user = (api.getState() as RootState).auth.user;
            Cookies.set("token", data?.data?.token, {
                secure: false,
                sameSite: "Lax",
            });
            if (data?.data?.refreshToken) {
                Cookies.set("refreshToken", data?.data?.refreshToken, { secure: false, sameSite: 'Lax' });
            }
            console.warn('[baseApi] refresh succeeded, retrying original request');
            result = await baseQuery(args, api, extraOptions);
        } else {
            console.warn('[baseApi] refresh failed, dispatching logout');
            api.dispatch(logout());
        }
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
        'Lessons'
    ],
    endpoints: () => ({}),
});