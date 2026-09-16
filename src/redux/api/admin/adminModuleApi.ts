import { baseApi } from "../baseApi";

export interface AdminModuleResponse {
    _id: string;
    title: string;
    orderIndex: number;
    courseId: string;
    batchId: string;
    lessonCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const adminModuleApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        getAdminCourseModules: build.query<{ data: AdminModuleResponse[] }, { courseId: string; batchId: string }>({
            query: ({ courseId, batchId }) => ({
                url: `/admin/modules/courses/${courseId}/modules?batchId=${batchId}`,
            }),
            providesTags: ["Modules"],
        }),
    }),
});

export const {
    useGetAdminCourseModulesQuery,
} = adminModuleApi;
