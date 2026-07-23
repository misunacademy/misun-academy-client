import { baseApi } from './baseApi';
import { IQuiz, IAdminQuizListResponse, IQuestion } from '@/types/quiz';

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

        // ── Questions (admin) ────────────────────────────────────────────────
        getAdminQuizQuestions: builder.query<IQuestion[], string>({
            query: (quizId) => ({ url: `/admin/quizzes/quizzes/${quizId}/questions` }),
            providesTags: (_result, _err, quizId) => [{ type: 'Questions', id: quizId }],
        }),

        getAdminQuestionById: builder.query<IQuestion, string>({
            query: (questionId) => ({ url: `/admin/quizzes/questions/${questionId}` }),
            providesTags: (_result, _err, questionId) => [{ type: 'Questions', id: questionId }],
        }),

        createAdminQuestion: builder.mutation<IQuestion, { quizId: string; data: Partial<IQuestion> }>({
            query: ({ quizId, data }) => ({
                url: `/admin/quizzes/quizzes/${quizId}/questions`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _err, { quizId }) => [
                { type: 'Questions', id: quizId },
                { type: 'Quizzes' },
            ],
        }),

        updateAdminQuestion: builder.mutation<IQuestion, { questionId: string; data: Partial<IQuestion> }>({
            query: ({ questionId, data }) => ({
                url: `/admin/quizzes/questions/${questionId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _err, { questionId }) => [{ type: 'Questions', id: questionId }],
        }),

        deleteAdminQuestion: builder.mutation<void, string>({
            query: (questionId) => ({
                url: `/admin/quizzes/questions/${questionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Questions'],
        }),

        duplicateAdminQuestion: builder.mutation<IQuestion, string>({
            query: (questionId) => ({
                url: `/admin/quizzes/questions/${questionId}/duplicate`,
                method: 'POST',
            }),
            invalidatesTags: ['Questions'],
        }),

        reorderAdminQuestions: builder.mutation<IQuestion[], { quizId: string; questionOrders: { questionId: string; orderIndex: number }[] }>({
            query: ({ quizId, questionOrders }) => ({
                url: `/admin/quizzes/quizzes/${quizId}/questions/reorder`,
                method: 'PUT',
                body: { questionOrders },
            }),
            invalidatesTags: (_result, _err, { quizId }) => [{ type: 'Questions', id: quizId }],
        }),

        // ── Analytics (admin) ─────────────────────────────────────────────────
        getAdminQuizAnalytics: builder.query<unknown, string>({
            query: (quizId) => ({ url: `/admin/quizzes/quizzes/${quizId}/analytics` }),
            providesTags: (_result, _err, quizId) => [{ type: 'Quizzes', id: quizId }],
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
    useGetAdminQuizQuestionsQuery,
    useGetAdminQuestionByIdQuery,
    useCreateAdminQuestionMutation,
    useUpdateAdminQuestionMutation,
    useDeleteAdminQuestionMutation,
    useDuplicateAdminQuestionMutation,
    useReorderAdminQuestionsMutation,
    useGetAdminQuizAnalyticsQuery,
} = quizApi;
