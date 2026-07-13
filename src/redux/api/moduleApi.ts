import { baseApi } from "./baseApi";

const moduleApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getCourseModules: builder.query<{ data: unknown }, { courseId: string; batchId?: string }>({
            query: ({ courseId, batchId }) => ({
                url: `/admin/modules/courses/${courseId}/modules`,
                params: { batchId },
            }),
            providesTags: ["Modules"],
        }),
        getModuleById: builder.query<{ data: unknown }, string>({
            query: (moduleId) => ({ url: `/admin/modules/modules/${moduleId}` }),
            providesTags: ["Modules"],
        }),
        getUnassignedCourseModules: builder.query<{ data: unknown }, string>({
            query: (courseId) => ({ url: `/admin/modules/courses/${courseId}/modules/unassigned` }),
            providesTags: ["Modules"],
        }),
        createCourseModule: builder.mutation<unknown, { courseId: string; batchId?: string } & Record<string, unknown>>({
            query: ({ courseId, batchId, ...data }) => ({
                url: `/admin/modules/courses/${courseId}/modules`,
                method: "POST",
                params: { batchId },
                body: data,
            }),
            invalidatesTags: ["Modules"],
        }),
        updateCourseModule: builder.mutation<unknown, { moduleId: string } & Record<string, unknown>>({
            query: ({ moduleId, ...data }) => ({
                url: `/admin/modules/modules/${moduleId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Modules"],
        }),
        deleteCourseModule: builder.mutation<unknown, string>({
            query: (moduleId) => ({
                url: `/admin/modules/modules/${moduleId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Modules"],
        }),
        reorderModules: builder.mutation<unknown, { courseId: string; batchId?: string; moduleOrders: unknown }>({
            query: ({ courseId, batchId, moduleOrders }) => ({
                url: `/admin/modules/courses/${courseId}/modules/reorder`,
                method: "PUT",
                params: { batchId },
                body: { moduleOrders },
            }),
            invalidatesTags: ["Modules"],
        }),
    }),
});

export const {
    useGetCourseModulesQuery,
    useGetModuleByIdQuery,
    useGetUnassignedCourseModulesQuery,
    useCreateCourseModuleMutation,
    useUpdateCourseModuleMutation,
    useDeleteCourseModuleMutation,
    useReorderModulesMutation,
} = moduleApi;
