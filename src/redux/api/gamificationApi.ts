import { baseApi } from './baseApi';
import { ILeaderboardEntry, IZamesStats, IZamesTransaction } from '@/types/quiz';

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


    }),
});

export const {
    useGetGlobalLeaderboardQuery,
    useGetCourseLeaderboardQuery,
    useGetBatchLeaderboardQuery,
    useGetZamesStatsQuery,
    useGetZamesHistoryQuery,
} = gamificationApi;
