import { baseApi } from "./baseApi";

const lessonApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getModuleLessons: builder.query<{ data: unknown }, string>({
            query: (moduleId) => ({ url: `/admin/lessons/modules/${moduleId}/lessons` }),
            providesTags: ["Lessons"],
        }),
        getLessonById: builder.query<{ data: unknown }, string>({
            query: (lessonId) => ({ url: `/admin/lessons/lessons/${lessonId}` }),
            providesTags: ["Lessons"],
        }),
        createModuleLesson: builder.mutation<unknown, { moduleId: string } & Record<string, unknown>>({
            query: ({ moduleId, ...data }) => ({
                url: `/admin/lessons/modules/${moduleId}/lessons`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Lessons", "Modules"],
        }),
        updateModuleLesson: builder.mutation<unknown, { lessonId: string } & Record<string, unknown>>({
            query: ({ lessonId, ...data }) => ({
                url: `/admin/lessons/lessons/${lessonId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Lessons"],
        }),
        deleteModuleLesson: builder.mutation<unknown, string>({
            query: (lessonId) => ({
                url: `/admin/lessons/lessons/${lessonId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lessons", "Modules"],
        }),
        reorderLessons: builder.mutation<unknown, { moduleId: string; lessonOrders: unknown }>({
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
