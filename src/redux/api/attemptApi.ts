import { baseApi } from './baseApi';
import { QuizAttemptStart, IQuizAttempt, IAttemptResult, IQuiz, IModuleCurriculumItem } from '@/types/quiz';

interface SubmitAnswerInput {
    questionId: string;
    selectedAnswer: string | null;
}

interface SubmitAttemptInput {
    answers: SubmitAnswerInput[];
    timeTaken?: number;
}

export const attemptApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getQuizInfo: builder.query<IQuiz, string>({
            query: (quizId) => ({ url: `/quizzes/${quizId}/info` }),
            providesTags: (_result, _err, quizId) => [{ type: 'Quizzes', id: quizId }],
        }),

        startAttempt: builder.mutation<QuizAttemptStart, { quizId: string; enrollmentId: string }>({
            query: ({ quizId, enrollmentId }) => ({
                url: `/quizzes/${quizId}/attempts/start?enrollmentId=${enrollmentId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Attempts'],
        }),

        submitAttempt: builder.mutation<IQuizAttempt, { attemptId: string; quizId: string; data: SubmitAttemptInput }>({
            query: ({ quizId, attemptId, data }) => ({
                url: `/quizzes/${quizId}/attempts/${attemptId}/submit`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Attempts', 'Leaderboard', 'Zames', 'CourseEnrollments'],
        }),

        getAttemptResult: builder.query<IAttemptResult, { quizId: string; attemptId: string }>({
            query: ({ quizId, attemptId }) => ({
                url: `/quizzes/${quizId}/attempts/${attemptId}/result`,
            }),
            providesTags: (_result, _err, { attemptId }) => [{ type: 'Attempts', id: attemptId }],
        }),

        getUserAttempts: builder.query<IQuizAttempt[], string>({
            query: (quizId) => ({ url: `/quizzes/${quizId}/attempts` }),
            providesTags: (_result, _err, quizId) => [{ type: 'Attempts', id: quizId }],
        }),

        getAttemptById: builder.query<IQuizAttempt, string>({
            query: (attemptId) => ({ url: `/quizzes/attempts/${attemptId}` }),
            providesTags: (_result, _err, attemptId) => [{ type: 'Attempts', id: attemptId }],
        }),

        getModuleQuizzes: builder.query<IQuiz[], { batchId: string; moduleId: string }>({
            query: ({ batchId, moduleId }) => ({
                url: `/content/batches/${batchId}/modules/${moduleId}/quizzes`,
            }),
            providesTags: (_result, _err, { moduleId }) => [{ type: 'Quizzes', id: moduleId }],
        }),

        getModuleCurriculum: builder.query<IModuleCurriculumItem[], { batchId: string; moduleId: string }>({
            query: ({ batchId, moduleId }) => ({
                url: `/content/batches/${batchId}/modules/${moduleId}/curriculum`,
            }),
            providesTags: (_result, _err, { moduleId }) => [{ type: 'Modules', id: moduleId }],
        }),
    }),
});

export const {
    useGetQuizInfoQuery,
    useStartAttemptMutation,
    useSubmitAttemptMutation,
    useGetAttemptResultQuery,
    useGetUserAttemptsQuery,
    useGetAttemptByIdQuery,
    useGetModuleQuizzesQuery,
    useGetModuleCurriculumQuery,
} = attemptApi;
