import { baseApi } from "./baseApi";

const courseEnrollmentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getCourseCurriculum: build.query<{ data: { modules: import("./courseApi").ModuleResponse[] } }, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/curriculum`,
      }),
      providesTags: ["Courses"],
    }),

    getCourseProgress: build.query<{ data: unknown }, string | { courseId: string; batchId?: string }>({
      query: (arg) => {
        const courseId = typeof arg === "string" ? arg : arg.courseId;
        const batchId = typeof arg === "string" ? undefined : arg.batchId;
        return {
          url: `/course-enrollment/${courseId}/progress`,
          params: batchId ? { batchId } : undefined,
        };
      },
      providesTags: ["CourseEnrollments"],
    }),

    completeLesson: build.mutation<unknown, { courseId: string; moduleId: string; lessonId: string }>({
      query: ({ courseId, moduleId, lessonId }) => ({
        url: `/course-enrollment/${courseId}/complete-lesson`,
        method: "POST",
        body: { moduleId, lessonId },
      }),
      invalidatesTags: ["CourseEnrollments"],
    }),
  }),
});

export const {
  useGetCourseCurriculumQuery,
  useGetCourseProgressQuery,
  useCompleteLessonMutation,
} = courseEnrollmentApi;
