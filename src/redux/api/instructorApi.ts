import { baseApi } from "./baseApi";
import type { IQuestion, IQuizAnalytics } from "@/types/quiz";

export interface InstructorQuiz {
  _id: string;
  title: string;
  description?: string;
  instructions?: string;
  status: "draft" | "published";
  passingPercentage: number;
  timeLimit?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  maxAttempts: number;
  showCorrectAnswers: boolean;
  allowReview: boolean;
  totalQuestions?: number;
  totalMarks?: number;
}

export interface InstructorModuleQuiz {
  _id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  totalQuestions?: number;
  totalMarks?: number;
  timeLimit?: number;
}

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

    updateInstructorProfile: build.mutation<unknown, Partial<InstructorProfileResponse>>({
      query: (data) => ({ url: "/instructor/profile", method: "PUT", body: data }),
      invalidatesTags: ["Instructors"],
    }),

    // ── Dashboard ─────────────────────────────────────────────────────────────
    getInstructorDashboard: build.query<{ data: unknown }, void>({
      query: () => ({ url: "/instructor/dashboard" }),
      providesTags: ["Instructors"],
    }),

    // ── Batches ───────────────────────────────────────────────────────────────
    getAssignedBatches: build.query<{ data: unknown[] }, { status?: string }>({
      query: (params) => ({ url: "/instructor/batches", params }),
      providesTags: ["Batches", "Instructors"],
    }),

    getBatchStudents: build.query<{ data: unknown[] }, string>({
      query: (batchId) => ({ url: `/instructor/batches/${batchId}/students` }),
      providesTags: ["Students", "Instructors"],
    }),

    getBatchStatistics: build.query<{ data: unknown }, string>({
      query: (batchId) => ({ url: `/instructor/batches/${batchId}/statistics` }),
      providesTags: ["Batches", "Instructors"],
    }),

    getPendingSubmissions: build.query<{ data: unknown[] }, void>({
      query: () => ({ url: "/instructor/submissions/pending" }),
      providesTags: ["Instructors"],
    }),

    getInstructorEnrolledStudents: build.query<{ data: unknown[], meta: unknown }, Record<string, unknown>>({
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

    createInstructorModule: build.mutation<unknown, { courseId: string; batchId: string } & Partial<InstructorModule>>({
      query: ({ courseId, batchId, ...data }) => ({
        url: `/instructor/courses/${courseId}/modules`,
        method: "POST",
        params: { batchId },
        body: data,
      }),
      invalidatesTags: ["Modules"],
    }),

    reorderInstructorModules: build.mutation<unknown, { courseId: string; batchId: string; moduleOrders: { moduleId: string; orderIndex: number }[] }>({
      query: ({ courseId, batchId, moduleOrders }) => ({
        url: `/instructor/courses/${courseId}/modules/reorder`,
        method: "PUT",
        params: { batchId },
        body: { moduleOrders },
      }),
      invalidatesTags: ["Modules"],
    }),

    updateInstructorModule: build.mutation<unknown, { moduleId: string } & Partial<InstructorModule>>({
      query: ({ moduleId, ...data }) => ({
        url: `/instructor/modules/${moduleId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Modules"],
    }),

    deleteInstructorModule: build.mutation<unknown, string>({
      query: (moduleId) => ({ url: `/instructor/modules/${moduleId}`, method: "DELETE" }),
      invalidatesTags: ["Modules", "Lessons"],
    }),

    // ── Lessons (instructor-scoped) ───────────────────────────────────────────
    getInstructorModuleLessons: build.query<{ data: InstructorLesson[] }, string>({
      query: (moduleId) => ({ url: `/instructor/modules/${moduleId}/lessons` }),
      providesTags: ["Lessons"],
    }),

    createInstructorLesson: build.mutation<unknown, { moduleId: string } & Partial<InstructorLesson>>({
      query: ({ moduleId, ...data }) => ({
        url: `/instructor/modules/${moduleId}/lessons`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lessons", "Modules"],
    }),

    updateInstructorLesson: build.mutation<unknown, { lessonId: string } & Partial<InstructorLesson>>({
      query: ({ lessonId, ...data }) => ({
        url: `/instructor/lessons/${lessonId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lessons"],
    }),

    deleteInstructorLesson: build.mutation<unknown, string>({
      query: (lessonId) => ({ url: `/instructor/lessons/${lessonId}`, method: "DELETE" }),
      invalidatesTags: ["Lessons", "Modules"],
    }),

    // ── Quizzes (instructor-scoped) ───────────────────────────────────────────
    getInstructorModuleQuizzes: build.query<{ data: InstructorModuleQuiz[] }, string>({
      query: (moduleId) => ({ url: `/instructor/modules/${moduleId}/quizzes` }),
      providesTags: ["Quizzes"],
    }),

    getInstructorQuizById: build.query<{ data: InstructorQuiz }, string>({
      query: (quizId) => ({ url: `/instructor/quizzes/${quizId}` }),
      providesTags: ["Quizzes"],
    }),

    createInstructorQuiz: build.mutation<unknown, { moduleId: string; data: Partial<InstructorQuiz> }>({
      query: ({ moduleId, data }) => ({
        url: `/instructor/modules/${moduleId}/quizzes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quizzes", "Modules"],
    }),

    updateInstructorQuiz: build.mutation<unknown, { quizId: string; data: Partial<InstructorQuiz> }>({
      query: ({ quizId, data }) => ({
        url: `/instructor/quizzes/${quizId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Quizzes"],
    }),

    deleteInstructorQuiz: build.mutation({
      query: (quizId: string) => ({ url: `/instructor/quizzes/${quizId}`, method: "DELETE" }),
      invalidatesTags: ["Quizzes", "Modules"],
    }),

    getInstructorQuizAnalytics: build.query<IQuizAnalytics, string>({
      query: (quizId) => ({ url: `/instructor/quizzes/${quizId}/analytics` }),
      providesTags: ["Quizzes"],
    }),

    // ── Questions (instructor-scoped) ─────────────────────────────────────────
    getInstructorQuizQuestions: build.query<{ data: IQuestion[] }, string>({
      query: (quizId) => ({ url: `/instructor/quizzes/${quizId}/questions` }),
      providesTags: ["Questions"],
    }),

    getInstructorQuestionById: build.query<{ data: IQuestion }, string>({
      query: (questionId: string) => ({ url: `/instructor/questions/${questionId}` }),
      providesTags: (_result, _err, questionId) => [{ type: "Questions", id: questionId }],
    }),

    createInstructorQuestion: build.mutation<unknown, { quizId: string; data: Partial<IQuestion> }>({
      query: ({ quizId, data }) => ({
        url: `/instructor/quizzes/${quizId}/questions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questions", "Quizzes"],
    }),

    updateInstructorQuestion: build.mutation<unknown, { questionId: string; data: Partial<IQuestion> }>({
      query: ({ questionId, data }) => ({
        url: `/instructor/questions/${questionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _err, { questionId }) => [{ type: "Questions", id: questionId }],
    }),

    deleteInstructorQuestion: build.mutation({
      query: (questionId: string) => ({ url: `/instructor/questions/${questionId}`, method: "DELETE" }),
      invalidatesTags: ["Questions", "Quizzes"],
    }),

    duplicateInstructorQuestion: build.mutation({
      query: (questionId: string) => ({ url: `/instructor/questions/${questionId}/duplicate`, method: "POST" }),
      invalidatesTags: ["Questions", "Quizzes"],
    }),

    reorderInstructorQuestions: build.mutation({
      query: ({ quizId, questionOrders }: { quizId: string; questionOrders: { questionId: string; orderIndex: number }[] }) => ({
        url: `/instructor/quizzes/${quizId}/questions/reorder`,
        method: "PUT",
        body: { questionOrders },
      }),
      invalidatesTags: ["Questions"],
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
  useGetInstructorModuleQuizzesQuery,
  useGetInstructorQuizByIdQuery,
  useGetInstructorQuizAnalyticsQuery,
  useCreateInstructorQuizMutation,
  useUpdateInstructorQuizMutation,
  useDeleteInstructorQuizMutation,
  useGetInstructorQuizQuestionsQuery,
  useGetInstructorQuestionByIdQuery,
  useCreateInstructorQuestionMutation,
  useUpdateInstructorQuestionMutation,
  useDeleteInstructorQuestionMutation,
  useDuplicateInstructorQuestionMutation,
  useReorderInstructorQuestionsMutation,
} = instructorApi;
