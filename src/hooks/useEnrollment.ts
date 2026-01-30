/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from '@/redux/hooks';
import { useGetEnrollmentsQuery } from '@/redux/api/enrollmentApi';

interface EnrollmentStatus {
  hasEnrollments: boolean;
  enrolledBatchIds: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to check if user has active enrollments
 * Used for conditional access to enrolled-only content
 */
export function useEnrollment(): EnrollmentStatus {
  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading, error } = useGetEnrollmentsQuery(undefined, {
    skip: !user?.id,
  });

  if (!user?.id) {
    return {
      hasEnrollments: false,
      enrolledBatchIds: [],
      isLoading: false,
      error: 'User not authenticated',
    };
  }

  if (isLoading) {
    return {
      hasEnrollments: false,
      enrolledBatchIds: [],
      isLoading: true,
      error: null,
    };
  }

  if (error) {
    return {
      hasEnrollments: false,
      enrolledBatchIds: [],
      isLoading: false,
      error: 'Failed to fetch enrollments',
    };
  }

  const enrollments = data?.data || [];
  const activeEnrollments = enrollments.filter(
    (enrollment: any) => enrollment.status === 'active'
  );

  return {
    hasEnrollments: activeEnrollments.length > 0,
    enrolledBatchIds: activeEnrollments.map((e: any) => e.batchId),
    isLoading: false,
    error: null,
  };
}
