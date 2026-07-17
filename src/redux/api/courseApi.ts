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
  coverImage?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'draft' | 'published' | 'archived';
  price?: number;
  discountPercentage?: number;
  duration?: unknown;
  durationEstimate?: string;
  totalModules?: number;
  totalLessons?: number;
  learningOutcomes?: string[];
  prerequisites?: string[];
  instructor?: string;
  instructorId?: string;
  features?: string[];
  highlights?: string[];
  curriculum?: unknown[];
  targetAudience?: string;
  tags?: string[];
  featured?: boolean;
  isCertificateAvailable?: boolean;
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
    getAllCourses: build.query<{ data: CourseResponse[] }, { status?: string; category?: string; level?: string }>({
      query: (params) => {
        const cleaned = params
          ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null))
          : undefined;
        if (cleaned && Object.keys(cleaned).length === 0) return { url: "/courses" };
        return { url: "/courses", params: cleaned };
      },
      providesTags: ["Courses"],
    }),

    getCourseBySlug: build.query<{ data: CourseResponse }, string>({
      query: (slug) => ({
        url: `/courses/slug/${slug}`,
      }),
      providesTags: ["Courses"],
    }),

    getCourseById: build.query<CourseResponse, string | { id: string; batchId?: string }>({
      query: (arg) => {
        const id = typeof arg === "string" ? arg : arg.id;
        const batchId = typeof arg === "string" ? undefined : arg.batchId;
        return {
          url: `/courses/${id}`,
          params: batchId ? { batchId } : undefined,
        };
      },
      transformResponse: (response: { data: CourseResponse }) => response.data,
      providesTags: ["Courses"],
    }),

    createCourse: build.mutation<unknown, Partial<CourseResponse>>({
      query: (data) => ({
        url: "/courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: build.mutation<unknown, { id: string; data: Partial<CourseResponse> }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteCourse: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    assignCourseInstructor: build.mutation<unknown, { courseId: string; instructorId: string | null }>({
      query: ({ courseId, instructorId }) => ({
        url: `/courses/${courseId}/instructor`,
        method: "PATCH",
        body: { instructorId },
      }),
      invalidatesTags: ["Courses", "Instructors"],
    }),

    getAllInstructorProfiles: build.query<{ data: unknown[] }, { unassignedOnly?: boolean } | void>({
      query: (params) =>
        params
          ? { url: "/admin/instructors", params }
          : { url: "/admin/instructors" },
      providesTags: ["Instructors"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseBySlugQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAssignCourseInstructorMutation,
  useGetAllInstructorProfilesQuery,
} = courseApi;
