import { baseApi } from "@/redux/api/baseApi";

const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => ({
                url: '/profile',
                method: 'GET',
            }),
            providesTags: ['Profile'],
        }),
        createProfile: builder.mutation({
            query: (profileData) => ({
                url: '/profile',
                method: 'POST',
                body: profileData,
            }),
            invalidatesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (updateData) => ({
                url: '/profile',
                method: 'PUT',
                body: updateData,
            }),
            invalidatesTags: ['Profile'],
        }),
        deleteProfile: builder.mutation({
            query: () => ({
                url: '/profile',
                method: 'DELETE',
            }),
            invalidatesTags: ['Profile'],
        }),
        updateInterests: builder.mutation({
            query: (interests) => ({
                url: '/profile/interests',
                method: 'PUT',
                body: { interests },
            }),
            invalidatesTags: ['Profile'],
        }),
        addInterest: builder.mutation({
            query: (interest) => ({
                url: '/profile/interests',
                method: 'POST',
                body: { interest },
            }),
            invalidatesTags: ['Profile'],
        }),
        removeInterest: builder.mutation({
            query: (interest) => ({
                url: '/profile/interests',
                method: 'DELETE',
                body: { interest },
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useCreateProfileMutation,
    useUpdateProfileMutation,
    useDeleteProfileMutation,
    useUpdateInterestsMutation,
    useAddInterestMutation,
    useRemoveInterestMutation,
} = profileApi;