import { baseApi } from "../../api/baseApi";

const batchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBatch: builder.mutation({
            query: (batchData) => ({
                url: "/batch",
                method: "POST",
                body: batchData,
            }),
            invalidatesTags: ["Batches"],
        }),
        getAllBatches: builder.query({
            query: () => ({
                url: "/batch",
                method: "GET",
            }),
            providesTags: ["Batches"],
        }),
        updateBatch: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/batch/${id}`,
                method: "PATCH",
                body: updateData,
            }),
            invalidatesTags: ["Batches"],
        }),
    }),
});

export const {
    useCreateBatchMutation,
    useGetAllBatchesQuery,
    useUpdateBatchMutation,
} = batchApi;