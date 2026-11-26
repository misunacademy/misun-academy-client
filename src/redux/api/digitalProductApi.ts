import { baseApi } from './baseApi';

export interface UploadedDigitalAsset {
    url: string;
    publicId: string;
    fileName: string;
    fileSize: string;
    fileSizeBytes: number;
    format: string;
    resourceType: 'image' | 'raw';
}

export interface DigitalProductFile {
    fileName: string;
    url: string;
    fileSize?: string;
}

export interface DigitalProduct {
    _id: string;
    title: string;
    slug: string;
    tagline?: string;
    description?: string;
    software: 'photoshop' | 'illustrator' | 'bundle' | 'other';
    priceBDT: number;
    discountPriceBDT?: number | null;
    priceINR: number;
    discountPriceINR?: number | null;
    thumbnail?: string;
    badge?: string;
    features: string[];
    scriptFile?: DigitalProductFile;
    guidePdf?: DigitalProductFile;
    isPublished: boolean;
    status?: 'draft' | 'published';
    salesCount: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface DigitalProductOrder {
    _id: string;
    orderNumber: string;
    product: DigitalProduct;
    productSnapshot: {
        title: string;
        slug: string;
        software: string;
    };
    customer: {
        name: string;
        email: string;
        phone: string;
        country: string;
    };
    paymentMethod: 'SSLCommerz' | 'PhonePe_Manual' | 'Perk' | 'Free';
    currency: 'BDT' | 'INR';
    amount: number;
    transactionId: string;
    senderNumber?: string;
    status: 'pending' | 'paid' | 'rejected';
    adminNote?: string;
    reviewedBy?: {
        name: string;
        email: string;
    };
    reviewedAt?: string;
    downloadToken: string;
    downloadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface DigitalProductOrderStats {
    totalRevenueBDT: number;
    totalRevenueINR: number;
    totalOrders: number;
    pendingManualOrders: number;
    paidOrders: number;
}

export interface MyPurchasedDigitalProduct {
    orderNumber: string;
    transactionId?: string;
    paymentMethod?: string;
    status?: string;
    adminNote?: string;
    createdAt?: string;
    paidAt?: string;
    amount: number;
    currency: 'BDT' | 'INR';
    product: {
        title: string;
        slug: string;
        software: string;
        thumbnail?: string;
        features?: string[];
        scriptFileName?: string;
        guideFileName?: string;
    };
    downloadToken?: string;
    scriptDownloadUrl?: string;
    guideDownloadUrl?: string;
}

export const digitalProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Public
        getPublishedDigitalProducts: builder.query<{ success: boolean; data: DigitalProduct[] }, void>({
            query: () => ({
                url: '/digital-products/bootcamp',
                method: 'GET',
            }),
            providesTags: ['DigitalProducts'],
        }),

        getProductBySlug: builder.query<{ success: boolean; data: DigitalProduct }, string>({
            query: (slug) => ({
                url: `/digital-products/products/${slug}`,
                method: 'GET',
            }),
            providesTags: (_res, _err, slug) => [{ type: 'DigitalProducts', id: slug }],
        }),

        initiateDigitalProductSSL: builder.mutation<
            { success: boolean; data: { paymentUrl: string; orderNumber: string; transactionId: string } },
            { productId: string; name: string; email: string; phone: string; address?: string; redirectPath?: string }
        >({
            query: (body) => ({
                url: '/digital-products/checkout/sslcommerz',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['DigitalProductOrders'],
        }),

        submitDigitalProductPhonePe: builder.mutation<
            { success: boolean; message: string; data: { orderNumber: string; status: string } },
            {
                productId: string;
                name: string;
                email: string;
                phone: string;
                senderPhonePe: string;
                transactionId: string;
            }
        >({
            query: (body) => ({
                url: '/digital-products/checkout/phonepe-manual',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['DigitalProductOrders'],
        }),

        claimFreeDigitalProduct: builder.mutation<
            {
                success: boolean;
                message: string;
                data: { orderNumber: string; downloadToken: string; alreadyClaimed: boolean };
            },
            {
                productId: string;
                name?: string;
                email?: string;
                phone?: string;
                currency?: 'BDT' | 'INR';
            }
        >({
            query: (body) => ({
                url: '/digital-products/checkout/free',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['DigitalProductOrders', 'DigitalProducts'],
        }),

        getMyDigitalPurchases: builder.query<{ success: boolean; data: MyPurchasedDigitalProduct[] }, void>({
            query: () => ({
                url: '/digital-products/my-purchases',
                method: 'GET',
            }),
            providesTags: ['DigitalProductOrders'],
        }),

        // Admin: Products
        getAdminDigitalProducts: builder.query<
            { success: boolean; data: DigitalProduct[]; meta: { total: number; page: number; limit: number; totalPage: number } },
            { search?: string; software?: string; isPublished?: boolean; status?: string; page?: number; limit?: number } | void
        >({
            query: (params) => ({
                url: '/digital-products/admin/products',
                method: 'GET',
                params: params || {},
            }),
            providesTags: ['DigitalProducts'],
        }),

        createAdminDigitalProduct: builder.mutation<
            { success: boolean; data: DigitalProduct },
            Partial<DigitalProduct>
        >({
            query: (body) => ({
                url: '/digital-products/admin/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['DigitalProducts'],
        }),

        updateAdminDigitalProduct: builder.mutation<
            { success: boolean; data: DigitalProduct },
            { id: string; data: Partial<DigitalProduct> }
        >({
            query: ({ id, data }) => ({
                url: `/digital-products/admin/products/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['DigitalProducts'],
        }),

        deleteAdminDigitalProduct: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/digital-products/admin/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DigitalProducts'],
        }),

        // Admin: Orders
        getAdminDigitalOrders: builder.query<
            { success: boolean; data: DigitalProductOrder[]; meta: { total: number; page: number; limit: number; totalPage: number } },
            { status?: string; paymentMethod?: string; search?: string; page?: number; limit?: number } | void
        >({
            query: (params) => ({
                url: '/digital-products/admin/orders',
                method: 'GET',
                params: params || {},
            }),
            providesTags: ['DigitalProductOrders'],
        }),

        getAdminDigitalOrdersStats: builder.query<{ success: boolean; data: DigitalProductOrderStats }, void>({
            query: () => ({
                url: '/digital-products/admin/orders/stats',
                method: 'GET',
            }),
            providesTags: ['DigitalProductOrders'],
        }),

        reviewAdminDigitalOrder: builder.mutation<
            { success: boolean; data: DigitalProductOrder },
            { id: string; status: 'paid' | 'rejected'; adminNote?: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/digital-products/admin/orders/${id}/review`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['DigitalProductOrders', 'DigitalProducts'],
        }),

        uploadDigitalProductAsset: builder.mutation<
            { success: boolean; message: string; data: UploadedDigitalAsset },
            FormData
        >({
            query: (formData) => ({
                url: '/digital-products/admin/upload-asset',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useGetPublishedDigitalProductsQuery,
    useGetProductBySlugQuery,
    useInitiateDigitalProductSSLMutation,
    useSubmitDigitalProductPhonePeMutation,
    useClaimFreeDigitalProductMutation,
    useGetMyDigitalPurchasesQuery,
    useGetAdminDigitalProductsQuery,
    useCreateAdminDigitalProductMutation,
    useUpdateAdminDigitalProductMutation,
    useDeleteAdminDigitalProductMutation,
    useGetAdminDigitalOrdersQuery,
    useGetAdminDigitalOrdersStatsQuery,
    useReviewAdminDigitalOrderMutation,
    useUploadDigitalProductAssetMutation,
} = digitalProductApi;
