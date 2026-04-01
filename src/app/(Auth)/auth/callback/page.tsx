/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';


function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const redirectUrl = searchParams.get('redirect_url');

  const isAllowedRedirectUrl = (target?: string | null) => {
    if (!target) return false;

    try {
      if (target.startsWith('/')) return true;

      const parsed = new URL(target);
      const host = parsed.hostname.toLowerCase();
      const mainHost = process.env.NEXT_PUBLIC_MA_FRONTEND_URL
        ? new URL(process.env.NEXT_PUBLIC_MA_FRONTEND_URL).hostname.toLowerCase()
        : '';

      return host === mainHost;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // No session found, redirect to login
      router.push('/auth');
      return;
    }

    const enrolledCourses = ((user as any).enrolledCourses || []) as unknown[];
    if (enrolledCourses.length > 0) {
      router.replace('/my-classes');
      return;
    }

    if (redirectUrl && isAllowedRedirectUrl(redirectUrl)) {
      if (redirectUrl.startsWith('/')) {
        router.replace(redirectUrl);
      } else {
        window.location.assign(redirectUrl);
      }
      return;
    }

    // Determine dashboard route based on user role (admin/instructor stay on main domain)
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
        destination = '/';
        break;
      default:
        destination = '/';
        break;
    }

    router.push(destination);
  }, [user, isLoading, router, redirectUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-sm text-muted-foreground">Completing sign in...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
