import { baseApi } from './baseApi';
import { ILeaderboardEntry, IZamesStats, IZamesTransaction, IMotivationalMessage } from '@/types/quiz';

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const gamificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGlobalLeaderboard: builder.query<PaginatedResponse<ILeaderboardEntry>, { period?: string; page?: number; limit?: number }>({
            query: ({ period = 'all_time', page = 1, limit = 50 } = {}) => ({
                url: `/gamification/leaderboard?period=${period}&page=${page}&limit=${limit}`,
            }),
            providesTags: ['Leaderboard'],
        }),

        getCourseLeaderboard: builder.query<PaginatedResponse<ILeaderboardEntry>, { courseId: string; period?: string; page?: number; limit?: number }>({
            query: ({ courseId, period = 'all_time', page = 1, limit = 50 }) => ({
                url: `/gamification/leaderboard/course/${courseId}?period=${period}&page=${page}&limit=${limit}`,
            }),
            providesTags: ['Leaderboard'],
        }),

        getBatchLeaderboard: builder.query<PaginatedResponse<ILeaderboardEntry>, { batchId: string; period?: string; page?: number; limit?: number }>({
            query: ({ batchId, period = 'all_time', page = 1, limit = 50 }) => ({
                url: `/gamification/leaderboard/batch/${batchId}?period=${period}&page=${page}&limit=${limit}`,
            }),
            providesTags: ['Leaderboard'],
        }),

        getZamesStats: builder.query<IZamesStats, void>({
            query: () => ({ url: '/gamification/zames/stats' }),
            providesTags: ['Zames'],
        }),

        getZamesHistory: builder.query<PaginatedResponse<IZamesTransaction>, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: `/gamification/zames/history?page=${page}&limit=${limit}`,
            }),
            providesTags: ['Zames'],
        }),

        getMotivationalMessages: builder.query<{ success: boolean; data: IMotivationalMessage[] }, void>({
            query: () => ({ url: '/admin/gamification/messages' }),
            providesTags: ['Settings'],
        }),

        createMotivationalMessage: builder.mutation<IMotivationalMessage, Partial<IMotivationalMessage>>({
            query: (data) => ({
                url: '/admin/gamification/messages',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),

        updateMotivationalMessage: builder.mutation<IMotivationalMessage, { messageId: string; data: Partial<IMotivationalMessage> }>({
            query: ({ messageId, data }) => ({
                url: `/admin/gamification/messages/${messageId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),

        deleteMotivationalMessage: builder.mutation<void, string>({
            query: (messageId) => ({
                url: `/admin/gamification/messages/${messageId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetGlobalLeaderboardQuery,
    useGetCourseLeaderboardQuery,
    useGetBatchLeaderboardQuery,
    useGetZamesStatsQuery,
    useGetZamesHistoryQuery,
    useGetMotivationalMessagesQuery,
    useCreateMotivationalMessageMutation,
    useUpdateMotivationalMessageMutation,
    useDeleteMotivationalMessageMutation,
} = gamificationApi;
