import { baseApi } from "../../api/baseApi";

const batchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBatch: builder.mutation({
            query: (batchData) => ({
                url: "/batches",
                method: "POST",
                body: batchData,
            }),
            invalidatesTags: ["Batches"],
        }),
        getAllBatches: builder.query({
            query: () => ({
                url: "/batches",
                method: "GET",
            }),
            providesTags: ["Batches"],
        }),
        updateBatch: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/batches/${id}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: ["Batches"],
        }),
        deleteBatch: builder.mutation({
            query: (id) => ({
                url: `/batches/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Batches"],
        }),
    }),
});

export const {
    useCreateBatchMutation,
    useGetAllBatchesQuery,
    useUpdateBatchMutation,
    useDeleteBatchMutation,
} = batchApi;