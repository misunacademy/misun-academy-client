/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface UpdateLessonProgressRequest {
  enrollmentId: string;
  lessonId: string;
  watchTime: number;
  lastWatchedPosition: number;
}

export interface LessonProgressResponse {
  _id: string;
  enrollmentId: string;
  lessonId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  watchTime: number;
  lastWatchedPosition: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleProgressResponse {
  _id: string;
  enrollmentId: string;
  moduleId: string;
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  completionPercentage: number;
  startedAt?: Date;
  completedAt?: Date;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const progressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Update lesson progress (track video watch time)
    // Server route: POST /content/progress/lessons/:lessonId
    updateLessonProgress: build.mutation<any, UpdateLessonProgressRequest & { lessonId: string }>({
      query: ({ lessonId, ...data }) => ({
        url: `/content/progress/lessons/${lessonId}`,  // Fixed: was /progress/lesson
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Progress", "CourseEnrollments"],
    }),

    // Get batch progress
    // Server route: GET /content/progress/batches/:batchId
    getBatchProgress: build.query<{ data: any }, string>({
      query: (batchId) => ({
        url: `/content/progress/batches/${batchId}`,
      }),
      providesTags: ["Progress"],
    }),

    // Get modules for enrolled batch
    // Server route: GET /content/batches/:batchId/modules
    getBatchModules: build.query<{ data: any }, string>({
      query: (batchId) => ({
        url: `/content/batches/${batchId}/modules`,
      }),
      providesTags: ["Progress", "Courses"],
    }),

    // Get lessons for a module in batch
    // Server route: GET /content/batches/:batchId/modules/:moduleId/lessons
    getModuleLessons: build.query<{ data: any }, { batchId: string; moduleId: string }>({
      query: ({ batchId, moduleId }) => ({
        url: `/content/batches/${batchId}/modules/${moduleId}/lessons`,
      }),
      providesTags: ["Progress", "Courses"],
    }),

    // Get lesson details
    // Server route: GET /content/batches/:batchId/modules/:moduleId/lessons/:lessonId
    getLessonDetails: build.query<{ data: any }, { batchId: string; moduleId: string; lessonId: string }>({
      query: ({ batchId, moduleId, lessonId }) => ({
        url: `/content/batches/${batchId}/modules/${moduleId}/lessons/${lessonId}`,
      }),
      providesTags: ["Progress", "Courses"],
    }),
  }),
});

export const {
  useUpdateLessonProgressMutation,
  useGetBatchProgressQuery,
  useGetBatchModulesQuery,
  useGetModuleLessonsQuery,
  useGetLessonDetailsQuery,
} = progressApi;
