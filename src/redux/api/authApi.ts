/**
 * CONSOLIDATED AUTH API - Production Ready
 * Supports both JWT (email/password) and Better Auth (social login)
 * All endpoints verified against server implementation
 */

import { baseApi } from "./baseApi";

// ============================================================================
// REQUEST INTERFACES
// ============================================================================

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;  // Server expects "currentPassword", not "oldPassword"
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;  // Server expects "phoneNumber", not "phone"
  profilePicture?: string;
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN' | 'SUPERADMIN';
  emailVerified: boolean;
  phoneNumber?: string;
  profilePicture?: string;
  image?: string; // Alternative field name used by server
  status: 'active' | 'suspended' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: true;
  message: string;
  data: {
    user: UserResponse;
    token: string;
    refreshToken: string;
  };
}

export interface RegisterResponse {
  success: true;
  message: string;
  data: {
    userId: string;
    email: string;
  };
}

export interface ProfileResponse {
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
// AUTH API ENDPOINTS
// ============================================================================

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Register new user (email/password)
     * POST /api/v1/auth/register
     */
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    /**
     * Login with email/password
     * POST /api/v1/auth/login
     * Returns user, token, and refreshToken
     */
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    /**
     * Verify email with token
     * POST /api/v1/auth/verify-email
     */
    verifyEmail: build.mutation<MessageResponse, { token: string }>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Resend verification email
     * POST /api/v1/auth/resend-verification
     */
    resendVerification: build.mutation<MessageResponse, ResendVerificationRequest>({
      query: (data) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Request password reset email
     * POST /api/v1/auth/forgot-password
     */
    forgotPassword: build.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Reset password with token
     * POST /api/v1/auth/reset-password
     */
    resetPassword: build.mutation<MessageResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Change password (requires authentication)
     * POST /api/v1/auth/change-password
     */
    changePassword: build.mutation<MessageResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Get current user profile
     * GET /api/v1/auth/profile
     */
    getProfile: build.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/profile",
      }),
      providesTags: ["Profile"],
    }),

    /**
     * Update current user profile
     * PUT /api/v1/auth/profile
     */
    updateProfile: build.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    /**
     * Get current user (alternative endpoint for Better Auth compatibility)
     * GET /api/v1/auth/me
     */
    getMe: build.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/me",
      }),
      providesTags: ["Profile"],
    }),
  }),
});

// Export hooks for use in components
export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetMeQuery,
} = authApi;

export default authApi;
