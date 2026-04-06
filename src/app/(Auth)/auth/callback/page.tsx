/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAllowedRedirectUrl } from '@/lib/auth-redirect';


function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const redirectUrl = searchParams.get('redirect_url') || searchParams.get('redirectTo');

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // No session found, redirect to login
      router.push('/auth');
      return;
    }

    // Priority 1: valid redirect_url
    if (redirectUrl && isAllowedRedirectUrl(redirectUrl)) {
      if (redirectUrl.startsWith('/')) {
        router.replace(redirectUrl);
      } else {
        window.location.assign(redirectUrl);
      }
      return;
    }

    // Priority 2: role-based fallback
    const role = user.role || 'learner';
    let destination = '/';

    switch (role.toLowerCase()) {
      case 'superadmin':
      case 'admin':
      case 'employee':
      case 'instructor':
        destination = '/dashboard/admin';
        break;
      case 'learner':
        destination = '/my-classes';
        break;
      default:
        destination = '/my-classes';
        break;
    }

    router.replace(destination);
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
