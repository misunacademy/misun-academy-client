/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '@/redux/api/baseApi';

export interface Recording {
    _id: string;
    courseId: string | { _id: string; title: string; slug: string };
    batchId: string | { _id: string; title: string; batchNumber: string };
    title: string;
    description?: string;
    sessionDate: string;
    videoSource: 'youtube' | 'googledrive';
    videoId: string;
    videoUrl?: string;
    duration?: number;
    thumbnailUrl?: string;
    instructor?: { _id: string; name: string; email: string };
    tags?: string[];
    isPublished: boolean;
    viewCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export const recordingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createRecording: builder.mutation<Recording, Partial<Recording>>({
            query: (data) => ({
                url: '/recordings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Recordings'],
        }),
        getRecordings: builder.query<
            { data: Recording[]; meta: { page: number; limit: number; total: number; totalPages: number } },
            { courseId?: string; batchId?: string; isPublished?: boolean; page?: number; limit?: number }
        >({
            query: (params) => ({
                url: '/recordings',
                method: 'GET',
                params,
            }),
            providesTags: ['Recordings'],
        }),
        getRecordingById: builder.query<Recording, string>({
            query: (id) => ({
                url: `/recordings/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => (response as any).data as Recording,
            providesTags: ['Recordings'],
        }),
        getBatchRecordings: builder.query<Recording[], string>({
            query: (batchId) => ({
                url: `/recordings/batch/${batchId}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => (response as any).data as Recording[],
            providesTags: ['Recordings'],
        }),
        getStudentRecordings: builder.query<Recording[], void>({
            query: () => ({
                url: '/recordings/student/my-recordings',
                method: 'GET',
            }),
            transformResponse: (response: any) => (response as any).data as Recording[],
            providesTags: ['Recordings'],
        }),
        updateRecording: builder.mutation<Recording, { id: string; data: Partial<Recording> }>({
            query: ({ id, data }) => ({
                url: `/recordings/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Recordings'],
        }),
        deleteRecording: builder.mutation<void, string>({
            query: (id) => ({
                url: `/recordings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Recordings'],
        }),
        incrementRecordingView: builder.mutation<void, string>({
            query: (id) => ({
                url: `/recordings/${id}/view`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useCreateRecordingMutation,
    useGetRecordingsQuery,
    useGetRecordingByIdQuery,
    useGetBatchRecordingsQuery,
    useGetStudentRecordingsQuery,
    useUpdateRecordingMutation,
    useDeleteRecordingMutation,
    useIncrementRecordingViewMutation,
} = recordingApi;