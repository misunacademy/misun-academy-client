/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface CourseResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  price: number;
  duration: number;
  totalModules: number;
  totalLessons: number;
  learningOutcomes: string[];
  prerequisites: string[];
  instructorId: string;
  createdAt: Date;
  updatedAt: Date;
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
  endpoints: (build) => ({
    // Get all courses (public)
    getAllCourses: build.query<{ data: CourseResponse[] }, { status?: string; category?: string; level?: string }>({
      query: (params) => ({
        url: "/courses",
        params,
      }),
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
    getCourseById: build.query<{ data: CourseResponse }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
      }),
      providesTags: ["Courses"],
    }),

    // Get course curriculum
    getCourseCurriculum: build.query<{ data: { modules: ModuleResponse[] } }, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/curriculum`,
      }),
      providesTags: ["Courses"],
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
  useGetCourseByIdQuery,  // Added new hook
  useGetCourseCurriculumQuery,
  useCreateCourseMutation,
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
