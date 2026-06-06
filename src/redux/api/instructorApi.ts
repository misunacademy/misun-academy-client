/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface InstructorProfileResponse {
  _id: string;
  userId: string;
  bio: string;
  expertise: string[];
  socialLinks?: {
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };
  verified: boolean;
  rating?: number;
  totalBatchesTaught: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface InstructorModule {
  _id: string;
  courseId: string;
  batchId?: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: string;
  learningObjectives: string[];
  status: 'draft' | 'published';
  lessonCount: number;
}

export interface InstructorLesson {
  _id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: 'video' | 'reading' | 'quiz' | 'project';
  orderIndex: number;
  videoSource?: 'youtube' | 'googledrive';
  videoId?: string;
  videoUrl?: string;
  videoDuration?: number;
  content?: string;
  isMandatory: boolean;
  resources?: { title: string; type: 'link' | 'text'; url?: string; textContent?: string }[];
}

export interface InstructorCourse {
  _id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  thumbnailImage?: string;
  status?: string;
  category?: string;
  level?: string;
  batches: {
    _id: string;
    title: string;
    batchNumber: number;
    status: string;
    startDate: string;
    endDate: string;
    currentEnrollment: number;
  }[];
}

const instructorApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // ── Profile ───────────────────────────────────────────────────────────────
    getInstructorProfile: build.query<{ data: InstructorProfileResponse }, void>({
      query: () => ({ url: "/instructor/profile" }),
      providesTags: ["Instructors"],
    }),

    updateInstructorProfile: build.mutation<any, Partial<InstructorProfileResponse>>({
      query: (data) => ({ url: "/instructor/profile", method: "PUT", body: data }),
      invalidatesTags: ["Instructors"],
    }),

    // ── Dashboard ─────────────────────────────────────────────────────────────
    getInstructorDashboard: build.query<{ data: any }, void>({
      query: () => ({ url: "/instructor/dashboard" }),
      providesTags: ["Instructors"],
    }),

    // ── Batches ───────────────────────────────────────────────────────────────
    getAssignedBatches: build.query<{ data: any[] }, { status?: string }>({
      query: (params) => ({ url: "/instructor/batches", params }),
      providesTags: ["Batches", "Instructors"],
    }),

    getBatchStudents: build.query<{ data: any[] }, string>({
      query: (batchId) => ({ url: `/instructor/batches/${batchId}/students` }),
      providesTags: ["Students", "Instructors"],
    }),

    getBatchStatistics: build.query<{ data: any }, string>({
      query: (batchId) => ({ url: `/instructor/batches/${batchId}/statistics` }),
      providesTags: ["Batches", "Instructors"],
    }),

    getPendingSubmissions: build.query<{ data: any[] }, void>({
      query: () => ({ url: "/instructor/submissions/pending" }),
      providesTags: ["Instructors"],
    }),

    getInstructorEnrolledStudents: build.query<{ data: any[], meta: any }, Record<string, any>>({
      query: (params) => ({ url: "/instructor/students", params }),
      providesTags: ["Students", "Instructors"],
    }),

    // ── Assigned Courses ──────────────────────────────────────────────────────
    getInstructorCourses: build.query<{ data: InstructorCourse[] }, void>({
      query: () => ({ url: "/instructor/courses" }),
      providesTags: ["Instructors", "Courses"],
    }),

    // ── Modules (instructor-scoped) ───────────────────────────────────────────
    getInstructorCourseModules: build.query<{ data: InstructorModule[] }, { courseId: string; batchId: string }>({
      query: ({ courseId, batchId }) => ({
        url: `/instructor/courses/${courseId}/modules`,
        params: { batchId },
      }),
      providesTags: ["Modules"],
    }),

    createInstructorModule: build.mutation<any, { courseId: string; batchId: string } & Partial<InstructorModule>>({
      query: ({ courseId, batchId, ...data }) => ({
        url: `/instructor/courses/${courseId}/modules`,
        method: "POST",
        params: { batchId },
        body: data,
      }),
      invalidatesTags: ["Modules"],
    }),

    reorderInstructorModules: build.mutation<any, { courseId: string; batchId: string; moduleOrders: { moduleId: string; orderIndex: number }[] }>({
      query: ({ courseId, batchId, moduleOrders }) => ({
        url: `/instructor/courses/${courseId}/modules/reorder`,
        method: "PUT",
        params: { batchId },
        body: { moduleOrders },
      }),
      invalidatesTags: ["Modules"],
    }),

    updateInstructorModule: build.mutation<any, { moduleId: string } & Partial<InstructorModule>>({
      query: ({ moduleId, ...data }) => ({
        url: `/instructor/modules/${moduleId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Modules"],
    }),

    deleteInstructorModule: build.mutation<any, string>({
      query: (moduleId) => ({ url: `/instructor/modules/${moduleId}`, method: "DELETE" }),
      invalidatesTags: ["Modules", "Lessons"],
    }),

    // ── Lessons (instructor-scoped) ───────────────────────────────────────────
    getInstructorModuleLessons: build.query<{ data: InstructorLesson[] }, string>({
      query: (moduleId) => ({ url: `/instructor/modules/${moduleId}/lessons` }),
      providesTags: ["Lessons"],
    }),

    createInstructorLesson: build.mutation<any, { moduleId: string } & Partial<InstructorLesson>>({
      query: ({ moduleId, ...data }) => ({
        url: `/instructor/modules/${moduleId}/lessons`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lessons", "Modules"],
    }),

    updateInstructorLesson: build.mutation<any, { lessonId: string } & Partial<InstructorLesson>>({
      query: ({ lessonId, ...data }) => ({
        url: `/instructor/lessons/${lessonId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lessons"],
    }),

    deleteInstructorLesson: build.mutation<any, string>({
      query: (lessonId) => ({ url: `/instructor/lessons/${lessonId}`, method: "DELETE" }),
      invalidatesTags: ["Lessons", "Modules"],
    }),
  }),
});

export const {
  useGetInstructorProfileQuery,
  useUpdateInstructorProfileMutation,
  useGetInstructorDashboardQuery,
  useGetAssignedBatchesQuery,
  useGetBatchStudentsQuery,
  useGetBatchStatisticsQuery,
  useGetPendingSubmissionsQuery,
  useGetInstructorCoursesQuery,
  useGetInstructorEnrolledStudentsQuery,
  useGetInstructorCourseModulesQuery,
  useCreateInstructorModuleMutation,
  useReorderInstructorModulesMutation,
  useUpdateInstructorModuleMutation,
  useDeleteInstructorModuleMutation,
  useGetInstructorModuleLessonsQuery,
  useCreateInstructorLessonMutation,
  useUpdateInstructorLessonMutation,
  useDeleteInstructorLessonMutation,
} = instructorApi;
