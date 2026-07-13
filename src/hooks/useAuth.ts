import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '@/types/auth';
import {
  signInAction,
  signUpAction,
  signOutAction,
  signInWithGoogleAction,
  forgotPasswordAction,
  resetPasswordAction,
  verifyEmailTokenAction,
  updateUserProfileAction,
} from '@/lib/auth-actions';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const session = useMemo(() => (user ? { user } : null), [user]);
  const isAuthenticated = !!user;

  const goToRedirect = useCallback((target: string) => {
    if (target.startsWith('/')) {
      router.push(target);
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const host = new URL(target).hostname.toLowerCase();
        if (host === 'esun.misun-academy.com') {
          window.open(target, '_blank', 'noopener,noreferrer');
          return;
        }
      } catch {
        // Fall through to assign for malformed absolute URLs.
      }

      window.location.assign(target);
    }
  }, [router]);

  const refetchSession = useCallback(async () => {
    if (!baseApiUrl) {
      setUser(undefined);
      setError(new Error('Missing NEXT_PUBLIC_BASE_API_URL'));
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseApiUrl}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        setUser(undefined);
        setError(null);
        setIsLoading(false);
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch auth user: ${response.status}`);
      }

      const payload = await response.json();
      const nextUser = payload?.data?.user as AuthUser | undefined;
      setUser(nextUser);
      setError(null);
      return nextUser || null;
    } catch (err) {
      setError(err as Error);
      setUser(undefined);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [baseApiUrl]);

  useEffect(() => {
    refetchSession();
  }, [refetchSession]);

  const signIn = useCallback(
    (email: string, password: string, redirectUrl?: string) =>
      signInAction(email, password, redirectUrl, refetchSession, goToRedirect),
    [refetchSession, goToRedirect],
  );

  const signUp = useCallback(
    (name: string, email: string, password: string) =>
      signUpAction(name, email, password),
    [],
  );

  const signOut = useCallback(
    () => signOutAction(setUser, router.push),
    [router.push],
  );

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
    (data: Partial<AuthUser>) => updateUserProfileAction(data, refetchSession),
    [refetchSession],
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
    refetchSession,
    updateUserProfile,
  };
}
