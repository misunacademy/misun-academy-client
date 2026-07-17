import { baseApi } from "./baseApi";
import type { ModuleResponse, LessonResponse } from "./courseApi";

const courseContentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getModulesByCourse: build.query<{ data: ModuleResponse[] }, string>({
      query: (courseId) => ({
        url: `/content/modules?courseId=${courseId}`,
      }),
      providesTags: ["Courses"],
    }),

    getLessonsByModule: build.query<{ data: LessonResponse[] }, string>({
      query: (moduleId) => ({
        url: `/content/lessons?moduleId=${moduleId}`,
      }),
      providesTags: ["Courses"],
    }),

    createModule: build.mutation<unknown, Partial<ModuleResponse>>({
      query: (data) => ({
        url: "/content/modules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    createLesson: build.mutation<unknown, Partial<LessonResponse>>({
      query: (data) => ({
        url: "/content/lessons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateModule: build.mutation<unknown, { id: string; data: Partial<ModuleResponse> }>({
      query: ({ id, data }) => ({
        url: `/content/modules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateLesson: build.mutation<unknown, { id: string; data: Partial<LessonResponse> }>({
      query: ({ id, data }) => ({
        url: `/content/lessons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteModule: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/content/modules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteLesson: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/content/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetModulesByCourseQuery,
  useGetLessonsByModuleQuery,
  useCreateModuleMutation,
  useCreateLessonMutation,
  useUpdateModuleMutation,
  useUpdateLessonMutation,
  useDeleteModuleMutation,
  useDeleteLessonMutation,
} = courseContentApi;
