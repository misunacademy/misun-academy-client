import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { AuthUser } from '@/types/auth';
import {
  signInAction,
  signUpAction,
  signInWithGoogleAction,
  forgotPasswordAction,
  resetPasswordAction,
  verifyEmailTokenAction,
  updateUserProfileAction,
} from '@/lib/auth-actions';
import { useGetSessionQuery } from '@/redux/api/authApi';
import { baseApi } from '@/redux/api/baseApi';
import { store } from '@/redux/store';
import { authServerApi } from '@/lib/auth-server-api';
import { isAllowedRedirectUrl } from '@/lib/auth-redirect';

export function useAuth() {
  const router = useRouter();
  // Revalidate on focus/reconnect (no timer polling): suspend/role changes
  // propagate without a 5-minute stale window.
  const { data: sessionData, isLoading: isPending, error: sessionError, refetch: refetchSession } = useGetSessionQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const user = useMemo(() => {
    if (!sessionData?.user) return undefined;
    return sessionData.user as AuthUser;
  }, [sessionData]);

  const session = useMemo(() => (user ? { user } : null), [user]);
  const isAuthenticated = !!user;
  const isLoading = isPending;
  const error = sessionError as Error | null;

  const goToRedirect = useCallback((target: string) => {
    if (target.startsWith('/')) {
      router.push(target);
      return;
    }

    // Absolute URLs must be allowlisted — never blindly assign attacker input
    // (e.g. a crafted ?redirect_url=) to window.location.
    if (typeof window !== 'undefined' && isAllowedRedirectUrl(target)) {
      window.location.assign(target);
    } else {
      router.push('/');
    }
  }, [router]);

  const refetchSessionTyped = useCallback(async () => {
    const result = await refetchSession();
    return (result.data?.user as AuthUser | null | undefined) ?? undefined;
  }, [refetchSession]);

  const signIn = useCallback(
    (email: string, password: string, redirectUrl?: string) =>
      signInAction(email, password, redirectUrl, refetchSessionTyped, goToRedirect),
    [refetchSessionTyped, goToRedirect],
  );

  const signUp = useCallback(
    (name: string, email: string, password: string, agreedToTerms?: boolean) =>
      signUpAction(name, email, password, agreedToTerms),
    [],
  );

  const signOut = useCallback(async () => {
    try {
      const result = await authServerApi.signOut();
      if (result.error) {
        throw new Error(result.error.message);
      }
      // Drop all cached RTK data — the next login must not see this user's
      // dashboard queries.
      store.dispatch(baseApi.util.resetApiState());
      await refetchSession();
      toast.success('Successfully logged out');
      router.push('/');
      return { success: true };
    } catch (error) {
      toast.error('Logout failed');
      return { success: false, error: (error as Error).message };
    }
  }, [router, refetchSession]);

  const signInWithGoogle = useCallback(
    (redirectUrl?: string) => signInWithGoogleAction(baseApiUrl, redirectUrl),
    [baseApiUrl],
  );

  const forgotPassword = useCallback(
    (email: string) => forgotPasswordAction(email),
    [],
  );

  const resetPassword = useCallback(
    (newPassword: string, token: string) =>
      resetPasswordAction(newPassword, token, router.push),
    [router.push],
  );

  const verifyEmail = useCallback(
    (token: string) => verifyEmailTokenAction(token, router.push),
    [router.push],
  );

  const updateUserProfile = useCallback(
    (data: Partial<AuthUser>) => updateUserProfileAction(data, refetchSessionTyped),
    [refetchSessionTyped],
  );

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refetchSession: refetchSessionTyped,
    updateUserProfile,
  };
}
