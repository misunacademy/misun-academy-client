import { baseApi } from './baseApi';
import { IQuiz, IAdminQuizListResponse } from '@/types/quiz';

export const quizApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllQuizzes: builder.query<IAdminQuizListResponse, {
            search?: string;
            status?: string;
            courseId?: string;
            page?: number;
            limit?: number;
        }>({
            query: (params) => {
                const query = new URLSearchParams();
                if (params.search) query.set('search', params.search);
                if (params.status) query.set('status', params.status);
                if (params.courseId) query.set('courseId', params.courseId);
                if (params.page) query.set('page', String(params.page));
                if (params.limit) query.set('limit', String(params.limit));
                return { url: `/admin/quizzes?${query.toString()}` };
            },
            providesTags: ['Quizzes'],
        }),

        getModuleQuizzes: builder.query<IQuiz[], string>({
            query: (moduleId) => ({ url: `/admin/quizzes/modules/${moduleId}/quizzes` }),
            providesTags: (_result, _err, moduleId) => [{ type: 'Quizzes', id: moduleId }],
        }),

        getQuizById: builder.query<IQuiz, string>({
            query: (quizId) => ({ url: `/admin/quizzes/quizzes/${quizId}` }),
            providesTags: (_result, _err, quizId) => [{ type: 'Quizzes', id: quizId }],
        }),

        createQuiz: builder.mutation<IQuiz, { moduleId: string; data: Partial<IQuiz> }>({
            query: ({ moduleId, data }) => ({
                url: `/admin/quizzes/modules/${moduleId}/quizzes`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _err, { moduleId }) => [
                { type: 'Quizzes', id: moduleId },
                { type: 'Modules' },
            ],
        }),

        updateQuiz: builder.mutation<IQuiz, { quizId: string; data: Partial<IQuiz> }>({
            query: ({ quizId, data }) => ({
                url: `/admin/quizzes/quizzes/${quizId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _err, { quizId }) => [{ type: 'Quizzes', id: quizId }],
        }),

        deleteQuiz: builder.mutation<void, string>({
            query: (quizId) => ({
                url: `/admin/quizzes/quizzes/${quizId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Quizzes'],
        }),

        reorderQuizzes: builder.mutation<IQuiz[], { moduleId: string; quizOrders: { quizId: string; orderIndex: number }[] }>({
            query: ({ moduleId, quizOrders }) => ({
                url: `/admin/quizzes/modules/${moduleId}/quizzes/reorder`,
                method: 'PUT',
                body: { quizOrders },
            }),
            invalidatesTags: (_result, _err, { moduleId }) => [{ type: 'Quizzes', id: moduleId }],
        }),
    }),
});

export const {
    useGetAllQuizzesQuery,
    useGetModuleQuizzesQuery,
    useGetQuizByIdQuery,
    useCreateQuizMutation,
    useUpdateQuizMutation,
    useDeleteQuizMutation,
    useReorderQuizzesMutation,
} = quizApi;
