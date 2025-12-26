import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (userInfo) => ({
                url: '/admin/login',
                method: 'POST',
                body: userInfo,
            }),
        }),
    }),
});

export const {
    useAdminLoginMutation,
} = authApi;