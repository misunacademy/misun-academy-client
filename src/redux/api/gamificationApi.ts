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

        getZamesStats: builder.query<IZamesStats, { courseId?: string; batchId?: string }>({
            query: ({ courseId, batchId } = {}) => {
                const params = new URLSearchParams();
                if (courseId) params.set('courseId', courseId);
                if (batchId) params.set('batchId', batchId);
                const qs = params.toString();
                return { url: `/gamification/zames/stats${qs ? `?${qs}` : ''}` };
            },
            providesTags: ['Zames'],
        }),

        getZamesHistory: builder.query<PaginatedResponse<IZamesTransaction>, { courseId?: string; batchId?: string; page?: number; limit?: number }>({
            query: ({ courseId, batchId, page = 1, limit = 20 } = {}) => {
                const params = new URLSearchParams();
                params.set('page', String(page));
                params.set('limit', String(limit));
                if (courseId) params.set('courseId', courseId);
                if (batchId) params.set('batchId', batchId);
                return { url: `/gamification/zames/history?${params.toString()}` };
            },
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
