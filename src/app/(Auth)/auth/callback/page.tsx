'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

/**
 * OAuth callback page
 * Handles redirect after successful OAuth authentication (Google, etc.)
 * Redirects users to appropriate dashboard based on their role
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      // No session found, redirect to login
      router.push('/auth');
      return;
    }

    // Determine dashboard route based on user role
    const role = (session.user as any).role || 'learner';
    let destination = '/dashboard/student';

    switch (role.toLowerCase()) {
      case 'superadmin':
      case 'admin':
        destination = '/dashboard/admin';
        break;
      case 'instructor':
        destination = '/dashboard/instructor';
        break;
      case 'learner':
      default:
        destination = '/dashboard/student';
        break;
    }

    router.push(destination);
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
