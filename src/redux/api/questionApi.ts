import { baseApi } from './baseApi';
import { IQuestion } from '@/types/quiz';

export const questionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getQuizQuestions: builder.query<IQuestion[], string>({
            query: (quizId) => ({ url: `/admin/quizzes/quizzes/${quizId}/questions` }),
            providesTags: (_result, _err, quizId) => [{ type: 'Questions', id: quizId }],
        }),

        getQuestionById: builder.query<IQuestion, string>({
            query: (questionId) => ({ url: `/admin/quizzes/questions/${questionId}` }),
            providesTags: (_result, _err, questionId) => [{ type: 'Questions', id: questionId }],
        }),

        createQuestion: builder.mutation<IQuestion, { quizId: string; data: Partial<IQuestion> }>({
            query: ({ quizId, data }) => ({
                url: `/admin/quizzes/quizzes/${quizId}/questions`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _err, { quizId }) => [
                { type: 'Questions', id: quizId },
                { type: 'Quizzes', id: quizId },
            ],
        }),

        updateQuestion: builder.mutation<IQuestion, { questionId: string; data: Partial<IQuestion> }>({
            query: ({ questionId, data }) => ({
                url: `/admin/quizzes/questions/${questionId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _err, { questionId }) => [{ type: 'Questions', id: questionId }],
        }),

        deleteQuestion: builder.mutation<void, string>({
            query: (questionId) => ({
                url: `/admin/quizzes/questions/${questionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Questions'],
        }),

        duplicateQuestion: builder.mutation<IQuestion, string>({
            query: (questionId) => ({
                url: `/admin/quizzes/questions/${questionId}/duplicate`,
                method: 'POST',
            }),
            invalidatesTags: ['Questions'],
        }),

        reorderQuestions: builder.mutation<IQuestion[], { quizId: string; questionOrders: { questionId: string; orderIndex: number }[] }>({
            query: ({ quizId, questionOrders }) => ({
                url: `/admin/quizzes/quizzes/${quizId}/questions/reorder`,
                method: 'PUT',
                body: { questionOrders },
            }),
            invalidatesTags: (_result, _err, { quizId }) => [{ type: 'Questions', id: quizId }],
        }),
    }),
});

export const {
    useGetQuizQuestionsQuery,
    useGetQuestionByIdQuery,
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
    useDuplicateQuestionMutation,
    useReorderQuestionsMutation,
} = questionApi;
