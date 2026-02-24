import { baseApi } from './baseApi';
import type { Salary, LeaveRequest } from '../features/employee/employeeApi';

export interface Employee {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    image?: string;
    phone?: string;
    address?: string;
    createdAt: string;
}

export interface CreateSalaryRequest {
    employeeId: string;
    employeeName: string;
    jobTitle: string;
    month: string;
    year: number;
    amount: number;
    bonus?: number;
    paymentDate?: string;
}

const employeeAdminApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        // Get all employees
        getAllEmployees: build.query<{ data: { employees: Employee[]; total: number; totalPages: number; page: number } }, { page?: number; limit?: number; search?: string }>({
            query: (params = {}) => ({ url: '/employee/admin/employees', params }),
            providesTags: ['Employees'],
        }),
        // Get all salary records
        getAllSalariesAdmin: build.query<{ data: { salaries: Salary[]; total: number; totalPages: number; page: number } }, { page?: number; limit?: number; employeeId?: string; status?: string }>({
            query: (params = {}) => ({ url: '/employee/admin/salaries', params }),
            providesTags: ['Employees'],
        }),
        // Create salary record
        addSalary: build.mutation<{ data: Salary }, CreateSalaryRequest>({
            query: (body) => ({ url: '/employee/admin/salaries', method: 'POST', body }),
            invalidatesTags: ['Employees'],
        }),
        // Update salary status
        updateSalaryStatus: build.mutation<{ data: Salary }, { id: string; status: 'Paid' | 'Pending' }>({
            query: ({ id, status }) => ({ url: `/employee/admin/salaries/${id}/status`, method: 'PATCH', body: { status } }),
            invalidatesTags: ['Employees'],
        }),
        // Get all leave requests (admin)
        getAllLeaveRequestsAdmin: build.query<{ data: { requests: LeaveRequest[]; total: number; totalPages: number; page: number } }, { page?: number; limit?: number; status?: string }>({
            query: (params = {}) => ({ url: '/employee/admin/leave', params }),
            providesTags: ['Employees'],
        }),
        // Approve / reject leave
        updateLeaveStatus: build.mutation<{ data: LeaveRequest }, { id: string; status: 'Approved' | 'Rejected' }>({
            query: ({ id, status }) => ({ url: `/employee/admin/leave/${id}/status`, method: 'PATCH', body: { status } }),
            invalidatesTags: ['Employees'],
        }),
    }),
});

export const {
    useGetAllEmployeesQuery,
    useGetAllSalariesAdminQuery,
    useAddSalaryMutation,
    useUpdateSalaryStatusMutation,
    useGetAllLeaveRequestsAdminQuery,
    useUpdateLeaveStatusMutation,
} = employeeAdminApi;

export default employeeAdminApi;
