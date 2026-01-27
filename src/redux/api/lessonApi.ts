import { baseApi } from "./baseApi";

const lessonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getModuleLessons: builder.query({
            query: (moduleId) => ({
                url: `/admin/lessons/modules/${moduleId}/lessons`,
                method: "GET",
            }),
            providesTags: ["Lessons"],
        }),
        getLessonById: builder.query({
            query: (lessonId) => ({
                url: `/admin/lessons/lessons/${lessonId}`,
                method: "GET",
            }),
            providesTags: ["Lessons"],
        }),
        // Admin: Create lesson 
        createModuleLesson: builder.mutation({
            query: ({ moduleId, ...data }) => ({
                url: `/admin/lessons/modules/${moduleId}/lessons`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Lessons", "Modules"],
        }),
        // Admin: Update lesson
        updateModuleLesson: builder.mutation({
            query: ({ lessonId, ...data }) => ({
                url: `/admin/lessons/lessons/${lessonId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Lessons"],
        }),
        // Admin: Delete lesson 
        deleteModuleLesson: builder.mutation({
            query: (lessonId) => ({
                url: `/admin/lessons/lessons/${lessonId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lessons", "Modules"],
        }),
        reorderLessons: builder.mutation({
            query: ({ moduleId, lessonOrders }) => ({
                url: `/admin/lessons/modules/${moduleId}/lessons/reorder`,
                method: "PUT",
                body: { lessonOrders },
            }),
            invalidatesTags: ["Lessons"],
        }),
    }),
});

export const {
    useGetModuleLessonsQuery,
    useGetLessonByIdQuery,
    useCreateModuleLessonMutation,
    useUpdateModuleLessonMutation,
    useDeleteModuleLessonMutation,
    useReorderLessonsMutation,
} = lessonApi;
