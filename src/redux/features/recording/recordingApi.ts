import { baseApi } from '@/redux/api/baseApi';

export const recordingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createRecording: builder.mutation({
            query: (data) => ({
                url: '/recordings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Recordings'],
        }),
        getRecordings: builder.query({
            query: (params) => ({
                url: '/recordings',
                method: 'GET',
                params,
            }),
            providesTags: ['Recordings'],
        }),
        getRecordingById: builder.query({
            query: (id) => ({
                url: `/recordings/${id}`,
                method: 'GET',
            }),
            providesTags: ['Recordings'],
        }),
        updateRecording: builder.mutation({
            query: ({ id, data }) => ({
                url: `/recordings/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Recordings'],
        }),
        deleteRecording: builder.mutation({
            query: (id) => ({
                url: `/recordings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Recordings'],
        }),
    }),
});

export const {
    useCreateRecordingMutation,
    useGetRecordingsQuery,
    useGetRecordingByIdQuery,
    useUpdateRecordingMutation,
    useDeleteRecordingMutation,
} = recordingApi;