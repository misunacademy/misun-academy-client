/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface CourseResponse {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  fullDescription?: string;
  thumbnail?: string;
  thumbnailImage?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'draft' | 'published' | 'archived';
  price?: number;
  duration?: any; // could be number or an object with weeks/hours
  durationEstimate?: any;
  totalModules?: number;
  totalLessons?: number;
  learningOutcomes?: string[];
  prerequisites?: string[];
  instructor?: any; // string or populated instructor object
  instructorId?: string;
  features?: string[];
  highlights?: string[];
  curriculum?: any[]; // modules + lessons - flexible shape
  targetAudience?: string;
  tags?: string[];
  featured?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date; 
}

export interface ModuleResponse {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  duration: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonResponse {
  _id: string;
  moduleId: string;
  title: string;
  description: string;
  orderIndex: number;
  lessonType: 'video' | 'reading' | 'quiz' | 'project';
  videoUrl?: string;
  videoSource?: 'youtube' | 'googledrive';
  videoDuration?: number;
  content?: string;
  isPreview: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // Get all courses (public)
    getAllCourses: build.query<{ data: CourseResponse[] }, { status?: string; category?: string; level?: string }>({
      query: (params) => {
        let cleaned = params
          ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null))
          : undefined;
        if (cleaned && Object.keys(cleaned).length === 0) cleaned = undefined;
        return {
          url: "/courses",
          params: cleaned,
        };
      },
      providesTags: ["Courses"],
    }),

    // Get course by slug (public)
    // Server expects /courses/slug/:slug not /courses/:slug
    getCourseBySlug: build.query<{ data: CourseResponse }, string>({
      query: (slug) => ({
        url: `/courses/slug/${slug}`,
      }),
      providesTags: ["Courses"],
    }),

    // Get course by ID (public)
    // Returns the course object directly (transforms { data } -> data)
    getCourseById: build.query<CourseResponse, string>({
      query: (id) => ({
        url: `/courses/${id}`,
      }),
      transformResponse: (response: any) => response?.data,
      providesTags: ["Courses"],
    }),

    // Get course curriculum
    getCourseCurriculum: build.query<{ data: { modules: ModuleResponse[] } }, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/curriculum`,
      }),
      providesTags: ["Courses"],
    }),

    // Get course progress for the current user
    // Server route: GET /course-enrollment/:courseId/progress
    getCourseProgress: build.query<{ data: any }, string>({
      query: (courseId) => ({
        url: `/course-enrollment/${courseId}/progress`,
      }),
      providesTags: ["CourseEnrollments", "Progress"],
    }),

    // Complete a lesson for the current user's enrollment
    // Server route: POST /course-enrollment/:courseId/complete-lesson
    completeLesson: build.mutation<any, { courseId: string; moduleId: string; lessonId: string }>({
      query: ({ courseId, moduleId, lessonId }) => ({
        url: `/course-enrollment/${courseId}/complete-lesson`,
        method: "POST",
        body: { moduleId, lessonId },
      }),
      invalidatesTags: ["CourseEnrollments", "Progress"],
    }),

    // Admin: Create course
    createCourse: build.mutation<any, Partial<CourseResponse>>({
      query: (data) => ({
        url: "/courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Admin: Update course
    updateCourse: build.mutation<any, { id: string; data: Partial<CourseResponse> }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Admin: Delete course
    deleteCourse: build.mutation<any, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    // Get modules by course
    getModulesByCourse: build.query<{ data: ModuleResponse[] }, string>({
      query: (courseId) => ({
        url: `/content/modules?courseId=${courseId}`,
      }),
      providesTags: ["Courses"],
    }),

    // Get lessons by module
    getLessonsByModule: build.query<{ data: LessonResponse[] }, string>({
      query: (moduleId) => ({
        url: `/content/lessons?moduleId=${moduleId}`,
      }),
      providesTags: ["Courses"],
    }),

    // Create module
    createModule: build.mutation<any, Partial<ModuleResponse>>({
      query: (data) => ({
        url: "/content/modules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Create lesson
    createLesson: build.mutation<any, Partial<LessonResponse>>({
      query: (data) => ({
        url: "/content/lessons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Update module
    updateModule: build.mutation<any, { id: string; data: Partial<ModuleResponse> }>({
      query: ({ id, data }) => ({
        url: `/content/modules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Update lesson
    updateLesson: build.mutation<any, { id: string; data: Partial<LessonResponse> }>({
      query: ({ id, data }) => ({
        url: `/content/lessons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Delete module
    deleteModule: build.mutation<any, string>({
      query: (id) => ({
        url: `/content/modules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    // Delete lesson
    deleteLesson: build.mutation<any, string>({
      query: (id) => ({
        url: `/content/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseBySlugQuery,
  useGetCourseByIdQuery,
  useGetCourseCurriculumQuery,
  useGetCourseProgressQuery,
  useCreateCourseMutation,
  useCompleteLessonMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetModulesByCourseQuery,
  useGetLessonsByModuleQuery,
  useCreateModuleMutation,
  useCreateLessonMutation,
  useUpdateModuleMutation,
  useUpdateLessonMutation,
  useDeleteModuleMutation,
  useDeleteLessonMutation,
} = courseApi;
