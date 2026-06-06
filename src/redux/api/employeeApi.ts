import { baseApi } from './baseApi';

export interface Salary {
    _id: string;
    employeeId: string;
    employeeName: string;
    jobTitle: string;
    month: string;
    year: number;
    amount: number;
    bonus: number;
    totalAmount: number;
    paymentDate?: string;
    status: 'Paid' | 'Pending';
    createdAt: string;
}

export interface LeaveRequest {
    _id: string;
    employeeId: string;
    employeeName: string;
    type: 'Paid Leave' | 'Sick Leave' | 'Vacation' | 'Other';
    from: string;
    to: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
}

export interface EmployeeDashboardData {
    totalSalaryPaid: number;
    pendingLeaveCount: number;
    approvedLeaveCount: number;
    recentSalaries: Salary[];
}

export interface EmployeeProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
    avatar?: string;
    whatsapp?: string | null;
    bloodGroup?: string | null;
    nidNumber?: string | null;
    dateOfBirth?: string | null;
    tshirtSize?: string | null;
    designation?: string | null;
    nidPhotoFrontUrl?: string | null;
    nidPhotoBackUrl?: string | null;
    nidPhotoUrl?: string | null;
}

const employeeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        // My profile (merged User + EmployeeProfile)
        getMyEmployeeProfile: build.query<{ data: EmployeeProfile }, void>({
            query: () => ({ url: '/employee/profile' }),
            providesTags: ['Employees'],
        }),
        // Update my profile
        updateMyEmployeeProfile: build.mutation<{ data: EmployeeProfile }, Partial<EmployeeProfile>>({
            query: (body) => ({ url: '/employee/profile', method: 'PATCH', body }),
            invalidatesTags: ['Employees'],
        }),
        // Dashboard
        getEmployeeDashboardData: build.query<{ data: EmployeeDashboardData }, void>({
            query: () => ({ url: '/dashboard/employee' }),
            providesTags: ['Employees'],
        }),
        // My salaries
        getMySalaries: build.query<{ data: { salaries: Salary[]; total: number; totalPages: number; page: number } }, { page?: number; limit?: number }>({
            query: (params = {}) => ({ url: '/employee/salaries', params }),
            providesTags: ['Employees'],
        }),
        // My leave requests
        getMyLeaveRequests: build.query<{ data: { requests: LeaveRequest[]; total: number; totalPages: number; page: number } }, { page?: number; limit?: number; status?: string }>({
            query: (params = {}) => ({ url: '/employee/leave', params }),
            providesTags: ['Employees'],
        }),
        // Submit leave request
        addLeaveRequest: build.mutation<{ data: LeaveRequest }, { type: string; from: string; to: string; reason: string }>({
            query: (body) => ({ url: '/employee/leave', method: 'POST', body }),
            invalidatesTags: ['Employees'],
        }),
    }),
});

export const {
    useGetMyEmployeeProfileQuery,
    useUpdateMyEmployeeProfileMutation,
    useGetEmployeeDashboardDataQuery,
    useGetMySalariesQuery,
    useGetMyLeaveRequestsQuery,
    useAddLeaveRequestMutation,
} = employeeApi;

export default employeeApi;
