import { baseApi } from "../../api/baseApi";

const studentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getEnrolledStudents: builder.query({
            query: (params) => ({
                url: "/enrollments",
                method: "GET",
                params,
            }),
            providesTags: ["Students"],
        }),
        getPaymentHistory: builder.query({
            query: (params) => ({
                url: "/payments/history",
                method: "GET",
                params,
            }),
            providesTags: ["Students"],
        }),
        updatePaymentStatus: builder.mutation({
            query: ({ transactionId, status }) => ({
                url: `/payments/${transactionId}/status`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Students"],
        }),
        getMetadata: builder.query({
            query: () => ({
                url: "/dashboard/metadata",
                method: "GET",
            }),
            providesTags: ["Students"],
        }),
        getStudentDashboardData: builder.query({
            query: () => ({
                url: "/dashboard/student",
                method: "GET",
            }),
            providesTags: ["Students"],
        }),
        enrollStudent: builder.mutation({
            query: (studentData) => ({
                url: "/enrollments",
                method: "POST",
                body: studentData,
            }),
            invalidatesTags: ["Students"],
        }),
        enrollStudentManual: builder.mutation({
            query: (studentData) => ({
                url: "/enrollments/manual",
                method: "POST",
                body: studentData,
            }),
            invalidatesTags: ["Students"],
        }),
    }),
});

export const {
    useGetEnrolledStudentsQuery,
    useGetPaymentHistoryQuery,
    useUpdatePaymentStatusMutation,
    useGetMetadataQuery,
    useGetStudentDashboardDataQuery,
    useEnrollStudentMutation,
    useEnrollStudentManualMutation,
} = studentsApi;


// getStudentById: builder.query({
//             query: (id) => ({
//                 url: `/student/${id}`,
//                 method: "GET",
//             }),
//             providesTags: ["Students"],
//         }),

//         addStudent: builder.mutation({
//             query: (studentData) => ({
//                 url: "/student",
//                 method: "POST",
//                 body: studentData,
//             }),
//             invalidatesTags: ["Students"],
//         }),

//         updateStudent: builder.mutation({
//             query: ({ id, ...updateData }) => ({
//                 url: `/student/${id}`,
//                 method: "PATCH",
//                 body: updateData,
//             }),
//             invalidatesTags: ["Students"],
//         }),

//         deleteStudent: builder.mutation({
//             query: (id) => ({
//                 url: `/student/${id}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: ["Students"],
//         }),