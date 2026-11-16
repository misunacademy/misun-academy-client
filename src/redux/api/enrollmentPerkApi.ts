import { baseApi } from './baseApi';

export interface PerkBenefit {
  type: 'free_course' | 'free_bootcamp' | 'discount_coupon' | 'resource' | 'certificate' | 'mentorship';
  targetCourseId?: string;
  targetBatchId?: string;
  targetBootcampId?: string;
  accessDuration?: {
    type: 'lifetime' | 'days';
    days?: number;
  };
  extraConfig?: Record<string, unknown>;
}

export interface PopulatedPerkBenefit {
  type: 'free_course' | 'free_bootcamp' | 'discount_coupon' | 'resource' | 'certificate' | 'mentorship';
  targetCourseId?: {
    _id: string;
    title: string;
    slug?: string;
    thumbnailImage?: string;
  };
  targetBatchId?: {
    _id: string;
    title: string;
    batchNumber?: number;
    status?: string;
  };
  targetBootcampId?: {
    _id: string;
    title: string;
    season?: string;
    slug?: string;
    thumbnail?: string;
    posterImage?: string;
  };
  accessDuration?: {
    type: 'lifetime' | 'days';
    days?: number;
  };
  extraConfig?: Record<string, unknown>;
}

export interface EnrollmentPerkRule {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    slug?: string;
    thumbnailImage?: string;
  };
  batchId: {
    _id: string;
    title: string;
    batchNumber?: number;
    status?: string;
  };
  title: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  note?: string;
  revokeOnCancel: boolean;
  applyToAdminGrants: boolean;
  benefits: PopulatedPerkBenefit[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PerkGrantLog {
  _id: string;
  studentId?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  ruleId?: {
    _id: string;
    title: string;
    courseId?: string;
    batchId?: string;
  };
  benefitType: string;
  targetCourseId?: {
    _id: string;
    title: string;
    slug?: string;
    thumbnailImage?: string;
  };
  targetBatchId?: {
    _id: string;
    title: string;
    batchNumber?: number;
  };
  targetBootcampId?: {
    _id: string;
    title: string;
    season?: string;
    slug?: string;
    thumbnail?: string;
  };
  sourceEnrollmentId?: {
    _id: string;
    enrollmentId?: string;
    batchId?: string;
    status?: string;
  };
  targetEnrollmentId?: {
    _id: string;
    enrollmentId?: string;
    status?: string;
  };
  status: 'granted' | 'revoked';
  grantedAt: string;
  revokedAt?: string;
  revokeReason?: string;
  grantedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface ListPerkRulesParams {
  courseId?: string;
  batchId?: string;
  isActive?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListPerkGrantsParams {
  ruleId?: string;
  studentId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePerkRulePayload {
  courseId: string;
  batchId: string;
  title: string;
  isActive?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  note?: string | null;
  revokeOnCancel?: boolean;
  applyToAdminGrants?: boolean;
  benefits: PerkBenefit[];
}

export interface UpdatePerkRulePayload {
  courseId?: string;
  batchId?: string;
  title?: string;
  isActive?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  note?: string | null;
  revokeOnCancel?: boolean;
  applyToAdminGrants?: boolean;
  benefits?: PerkBenefit[];
}

export interface BackfillPreviewResponse {
  ruleId: string;
  ruleTitle: string;
  totalEnrolled: number;
  eligibleCount: number;
  eligibleStudents: Array<{
    enrollmentId: string;
    studentId: string;
    name: string;
    email: string;
  }>;
}

export interface BackfillExecuteResponse {
  ruleId: string;
  totalEligible: number;
  totalGranted: number;
}

const enrollmentPerkApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getPerkRules: build.query<{
      success: boolean;
      data: EnrollmentPerkRule[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    }, ListPerkRulesParams | void>({
      query: (params) => ({
        url: '/enrollment-perks',
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'EnrollmentPerks' as const, id: _id })),
              { type: 'EnrollmentPerks', id: 'LIST' },
            ]
          : [{ type: 'EnrollmentPerks', id: 'LIST' }],
    }),

    getPerkRuleById: build.query<{ success: boolean; data: EnrollmentPerkRule }, string>({
      query: (id) => ({
        url: `/enrollment-perks/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'EnrollmentPerks', id }],
    }),

    createPerkRule: build.mutation<{ success: boolean; data: EnrollmentPerkRule; message?: string }, CreatePerkRulePayload>({
      query: (data) => ({
        url: '/enrollment-perks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'EnrollmentPerks', id: 'LIST' }],
    }),

    updatePerkRule: build.mutation<{ success: boolean; data: EnrollmentPerkRule; message?: string }, { id: string; data: UpdatePerkRulePayload }>({
      query: ({ id, data }) => ({
        url: `/enrollment-perks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'EnrollmentPerks', id },
        { type: 'EnrollmentPerks', id: 'LIST' },
      ],
    }),

    togglePerkRuleStatus: build.mutation<{ success: boolean; data: EnrollmentPerkRule; message?: string }, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/enrollment-perks/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'EnrollmentPerks', id },
        { type: 'EnrollmentPerks', id: 'LIST' },
      ],
    }),

    deletePerkRule: build.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/enrollment-perks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'EnrollmentPerks', id: 'LIST' }],
    }),

    previewPerkBackfill: build.query<{ success: boolean; data: BackfillPreviewResponse }, string>({
      query: (id) => ({
        url: `/enrollment-perks/${id}/backfill-preview`,
      }),
    }),

    executePerkBackfill: build.mutation<{ success: boolean; data: BackfillExecuteResponse; message: string }, string>({
      query: (id) => ({
        url: `/enrollment-perks/${id}/backfill`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'EnrollmentPerks', id: 'LOGS' }],
    }),

    getPerkGrantLogs: build.query<{
      success: boolean;
      data: PerkGrantLog[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    }, ListPerkGrantsParams | void>({
      query: (params) => ({
        url: '/enrollment-perks/grants/logs',
        params: params || undefined,
      }),
      providesTags: [{ type: 'EnrollmentPerks', id: 'LOGS' }],
    }),
  }),
});

export const {
  useGetPerkRulesQuery,
  useGetPerkRuleByIdQuery,
  useCreatePerkRuleMutation,
  useUpdatePerkRuleMutation,
  useTogglePerkRuleStatusMutation,
  useDeletePerkRuleMutation,
  usePreviewPerkBackfillQuery,
  useLazyPreviewPerkBackfillQuery,
  useExecutePerkBackfillMutation,
  useGetPerkGrantLogsQuery,
} = enrollmentPerkApi;
