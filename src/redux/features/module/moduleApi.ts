import { baseApi } from "../../api/baseApi";

const moduleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourseModules: builder.query({
            query: (courseId) => ({
                url: `/admin/modules/courses/${courseId}/modules`,
                method: "GET",
            }),
            providesTags: ["Modules"],
        }),
        getModuleById: builder.query({
            query: (moduleId) => ({
                url: `/admin/modules/modules/${moduleId}`,
                method: "GET",
            }),
            providesTags: ["Modules"],
        }),
        createModule: builder.mutation({
            query: ({ courseId, ...data }) => ({
                url: `/admin/modules/courses/${courseId}/modules`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Modules"],
        }),
        updateModule: builder.mutation({
            query: ({ moduleId, ...data }) => ({
                url: `/admin/modules/modules/${moduleId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Modules"],
        }),
        deleteModule: builder.mutation({
            query: (moduleId) => ({
                url: `/admin/modules/modules/${moduleId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Modules"],
        }),
        reorderModules: builder.mutation({
            query: ({ courseId, moduleOrders }) => ({
                url: `/admin/modules/courses/${courseId}/modules/reorder`,
                method: "PUT",
                body: { moduleOrders },
            }),
            invalidatesTags: ["Modules"],
        }),
    }),
});

export const {
    useGetCourseModulesQuery,
    useGetModuleByIdQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation,
    useReorderModulesMutation,
} = moduleApi;
