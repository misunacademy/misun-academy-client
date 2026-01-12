/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";
import { Course, ApiResponse } from "@/types/common";

const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: (params) => ({
                url: "/courses",
                method: "GET",
                params,
            }),
            transformResponse: (response: any) => {
                if (response.data && Array.isArray(response.data)) {
                    response.data = response.data
                        .filter((course: any) => course && course.status) // filter out undefined or courses without status
                        .map((course: any) => ({
                            ...course,
                            isPublished: course.status === 'published',
                        }));
                }
                return response;
            },
            providesTags: ["Courses"],
        }),
        getCourseBySlug: builder.query<Course, string>({
            query: (slug) => ({
                url: `/courses/slug/${slug}`,
                method: "GET",
            }),
            transformResponse: (result: any) => {
                const course = (result as any)?.data as Course;
                if (course && course.status) {
                    return {
                        ...course,
                        isPublished: course.status === 'published',
                    } as Course;
                }
                return course;
            },
            providesTags: ["Courses"],
        }),
        getCourseById: builder.query<Course, string>({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "GET",
            }),
            transformResponse: (result: any) => {
                const course = (result as any)?.data as Course;
                if (course && course.status) {
                    return {
                        ...course,
                        isPublished: course.status === 'published',
                    } as Course;
                }
                return course;
            },
            providesTags: ["Courses"],
        }),
        createCourse: builder.mutation({
            query: (courseData) => ({
                url: "/courses",
                method: "POST",
                body: courseData,
            }),
            invalidatesTags: ["Courses"],
        }),
        updateCourse: builder.mutation({
            query: ({ id, ...courseData }) => ({
                url: `/courses/${id}`,
                method: "PUT",
                body: courseData,
            }),
            invalidatesTags: ["Courses"],
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Courses"],
        }),
        // Course Enrollment APIs
        enrollInCourse: builder.mutation({
            query: (courseId) => ({
                url: `/course-enrollment/${courseId}/enroll`,
                method: "POST",
            }),
            invalidatesTags: ["CourseEnrollments"],
        }),
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `/course-enrollment/${courseId}/progress`,
                method: "GET",
            }),
            providesTags: ["CourseEnrollments"],
        }),
        completeLesson: builder.mutation({
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
    useGetCoursesQuery,
    useGetCourseBySlugQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useEnrollInCourseMutation,
    useGetCourseProgressQuery,
    useCompleteLessonMutation,
} = courseApi;