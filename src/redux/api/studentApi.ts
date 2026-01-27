// Student API wrapper: re-export canonical hooks from `redux/api/*` and keep student-specific endpoints here.
import { baseApi } from "./baseApi";

import {
    useGetAllEnrollmentsQuery,
    useInitiateEnrollmentMutation,
    useEnrollStudentManualMutation as useEnrollStudentManualMutationFromEnrollment,
} from "@/redux/api/enrollmentApi";

import {
    useGetMyPaymentsQuery,
    useUpdatePaymentStatusMutation as useUpdatePaymentStatusMutationFromPayment,
    useVerifyManualPaymentMutation as useVerifyManualPaymentMutationFromPayment,
} from "@/redux/api/paymentApi";

import { useGetDashboardMetadataQuery } from "@/redux/api/dashboardApi";

// Back-compat: expose legacy hook name `useGetMetadataQuery` used across the app
export const useGetMetadataQuery = useGetDashboardMetadataQuery;

const studentsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Keep only student-specific endpoints here
        getStudentDashboardData: builder.query({
            query: () => ({
                url: "/dashboard/student",
            }),
            providesTags: ["Students"],
        }),
    }),
});

export const { useGetStudentDashboardDataQuery } = studentsApi;

// Re-export canonical hooks under the original feature hook names to preserve usage
export const useGetEnrolledStudentsQuery = useGetAllEnrollmentsQuery;
export const useGetPaymentHistoryQuery = useGetMyPaymentsQuery;
export const useUpdatePaymentStatusMutation = useUpdatePaymentStatusMutationFromPayment;
export const useVerifyManualPaymentMutation = useVerifyManualPaymentMutationFromPayment;
export const useEnrollStudentMutation = useInitiateEnrollmentMutation;
export const useEnrollStudentManualMutation = useEnrollStudentManualMutationFromEnrollment;