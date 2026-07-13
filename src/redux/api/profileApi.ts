import { baseApi } from "@/redux/api/baseApi";

export interface ProfileUser {
    studentId?: string;
    phone?: string;
}

export interface EducationEntry {
    degree: string;
    institution: string;
    passingYear: string;
    result?: string;
}

export interface ProfileData {
    user?: ProfileUser;
    wpnumber?: string;
    bio?: string;
    dateOfBirth?: string;
    address?: string;
    education?: EducationEntry[];
    linkedinUrl?: string;
}

const profileApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getUserProfile: builder.query<{ data: ProfileData }, void>({
            query: () => ({ url: '/profile' }),
            providesTags: ['Profile'],
        }),
        createProfile: builder.mutation<unknown, object>({
            query: (profileData) => ({
                url: '/profile',
                method: 'POST',
                body: profileData,
            }),
            invalidatesTags: ['Profile'],
        }),
        updateUserProfile: builder.mutation<unknown, object>({
            query: (updateData) => ({
                url: '/profile',
                method: 'PUT',
                body: updateData,
            }),
            invalidatesTags: ['Profile'],
        }),
        deleteProfile: builder.mutation<unknown, void>({
            query: () => ({
                url: '/profile',
                method: 'DELETE',
            }),
            invalidatesTags: ['Profile'],
        }),
        updateInterests: builder.mutation<unknown, unknown[]>({
            query: (interests) => ({
                url: '/profile/interests',
                method: 'PUT',
                body: { interests },
            }),
            invalidatesTags: ['Profile'],
        }),
        addInterest: builder.mutation<unknown, unknown>({
            query: (interest) => ({
                url: '/profile/interests',
                method: 'POST',
                body: { interest },
            }),
            invalidatesTags: ['Profile'],
        }),
        removeInterest: builder.mutation<unknown, unknown>({
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
    useGetUserProfileQuery,
    useCreateProfileMutation,
    useUpdateUserProfileMutation,
    useDeleteProfileMutation,
    useUpdateInterestsMutation,
    useAddInterestMutation,
    useRemoveInterestMutation,
} = profileApi;
