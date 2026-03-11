/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGetMyEnrollmentsQuery } from '@/redux/api/enrollmentApi';


export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: EnrollmentsData, isLoading: isEnrollmentsLoading } = useGetMyEnrollmentsQuery({ status: "active" }, { skip: !user }); // prime the cache with user's enrollments if logged in
  const isEnrolled = (EnrollmentsData?.data?.length ?? 0) > 0

  useEffect(() => {
    if (isLoading || isEnrollmentsLoading) return;

    if (!user) {
      // No session found, redirect to login
      router.push('/auth');
      return;
    }

    // Determine dashboard route based on user role
    const role = user.role || 'learner';
    let destination = '/';

    switch (role.toLowerCase()) {
      case 'superadmin':
      case 'admin':
        destination = '/dashboard/admin';
        break;
      case 'instructor':
        destination = '/dashboard/instructor';
        break;
      case 'learner':
        destination = isEnrolled ? '/my-classes' : '/';
        break;
      default:
        destination = '/';
        break;
    }

    router.push(destination);
  }, [user, isLoading, router, isEnrollmentsLoading, isEnrolled]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
