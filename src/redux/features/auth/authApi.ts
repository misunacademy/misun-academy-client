import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/login',
                method: 'POST',
                body: userInfo,
            }),
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/register',
                method: 'POST',
                body: userInfo,
            }),
        }),
        getMe: builder.query({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            }),
        }),
        updateUserProfile: builder.mutation({
            query: (updateData) => ({
                url: '/auth/update-profile',
                method: 'PUT',
                body: updateData,
            }),
        }),
        forgetPassword: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/forget-password',
                method: 'POST',
                body: userInfo,
            }),
        }),
        resetPassword: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: userInfo,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useUpdateUserProfileMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
} = authApi;