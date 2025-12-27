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
            providesTags: ["Courses"],
        }),
        getCourseBySlug: builder.query<Course, string>({
            query: (slug) => ({
                url: `/courses/slug/${slug}`,
                method: "GET",
            }),
            transformResponse: (result: { data: ApiResponse<Course> }) => result.data.data,
            providesTags: ["Courses"],
        }),
        getCourseById: builder.query<Course, string>({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "GET",
            }),
            transformResponse: (result: { data: ApiResponse<Course> }) => result.data.data,
            providesTags: ["Courses"],
        }),
    }),
});

export const {
    useGetCoursesQuery,
    useGetCourseBySlugQuery,
    useGetCourseByIdQuery,
} = courseApi;