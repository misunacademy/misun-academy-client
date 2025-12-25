export interface Student {
    _id: string;
    name: string;
    email: string;
    studentId: string;
    address: string;
    phone: string;
    paymentStatus: 'pending' | 'success' | 'failed';
    batch: object;
    createdAt?: unknown;
    updatedAt?: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export type PaymentStatus = 'pending' | 'success' | 'failed';