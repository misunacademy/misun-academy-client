/**
 * ADMIN API - User Management
 * Requires ADMIN or SUPERADMIN role
 * All endpoints verified against server /api/v1/admin/* routes
 */

import { baseApi } from "./baseApi";
import { UserResponse } from "./authApi";

// ============================================================================
// REQUEST INTERFACES
// ============================================================================

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN' | 'SUPERADMIN';
  status?: 'active' | 'suspended' | 'deleted';
}

export interface GetAllUsersParams {
  role?: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN' | 'SUPERADMIN';
  status?: 'active' | 'suspended' | 'deleted';
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface UsersListResponse {
  success: true;
  message: string;
  data: UserResponse[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserDetailResponse {
  success: true;
  message: string;
  data: UserResponse;
}

export interface MessageResponse {
  success: true;
  message: string;
  data: null;
}

// ============================================================================
// ADMIN API ENDPOINTS
// ============================================================================

const adminApi = baseApi.injectEndpoints({  
  overrideExisting: true,
  endpoints: (build) => ({
    /**
     * Get all users (with filters and pagination)
     * GET /api/v1/admin/users
     * Requires: ADMIN or SUPERADMIN
     */
    getAllUsers: build.query<UsersListResponse, GetAllUsersParams | void>({
      query: (params) => ({
        url: "/admin/users",
        params: params || {},
      }),
      providesTags: ["Users"],
    }),

    /**
     * Get user by ID
     * GET /api/v1/admin/users/:id
     * Requires: ADMIN or SUPERADMIN
     */
    getUserById: build.query<UserDetailResponse, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    /**
     * Create new admin user (SuperAdmin only)
     * POST /api/v1/admin/users
     * Requires: SUPERADMIN
     */
    createAdmin: build.mutation<UserDetailResponse, CreateAdminRequest>({
      query: (data) => ({
        url: "/admin/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    /**
     * Update user details
     * PUT /api/v1/admin/users/:id
     * Requires: ADMIN or SUPERADMIN
     */
    updateUser: build.mutation<UserDetailResponse, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id }, "Users"],
    }),

    /**
     * Update user status (suspend/activate)
     * PATCH /api/v1/admin/users/:id/status
     * Requires: ADMIN or SUPERADMIN
     * Note: Suspending a user also suspends their enrollments
     */
    updateUserStatus: build.mutation<MessageResponse, { id: string; status: 'active' | 'suspended' | 'deleted' }>({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id }, 
        "Users", 
        "CourseEnrollments"  // Invalidate enrollments since they may be affected
      ],
    }),

    /**
     * Delete user
     * DELETE /api/v1/admin/users/:id
     * Requires: SUPERADMIN
     */
    deleteUser: build.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateAdminMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} = adminApi;

export default adminApi;
