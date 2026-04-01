/* eslint-disable @typescript-eslint/no-explicit-any */
import { authServerApi } from '@/lib/auth-server-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '@/types/auth';
import { getAuthErrorMessage } from '@/lib/auth-errors';

/**
 * Centralized auth hook.
 * Session source of truth is backend GET /api/v1/auth/me.
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const session = useMemo(() => (user ? { user } : null), [user]);
  const isAuthenticated = !!user;

  const isAllowedRedirectUrl = useCallback((target?: string | null) => {
    if (!target) return false;

    try {
      if (target.startsWith('/')) return true;

      const url = new URL(target);
      const host = url.hostname.toLowerCase();
      const mainHost = process.env.NEXT_PUBLIC_MA_FRONTEND_URL
        ? new URL(process.env.NEXT_PUBLIC_MA_FRONTEND_URL).hostname.toLowerCase()
        : '';

      return host === mainHost;
    } catch {
      return false;
    }
  }, []);

  const goToRedirect = useCallback((target: string) => {
    if (target.startsWith('/')) {
      router.push(target);
      return;
    }

    if (typeof window !== 'undefined') {
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

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string, redirectUrl?: string) => {
    try {
      const result = await authServerApi.signInEmail({
        email,
        password,
      });

      if (result.error) {
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (result.data) {
        toast.success('Successfully logged in!');

        const responseUser = (result.data as any)?.user as AuthUser | undefined;
        const signedInUser = (await refetchSession()) || responseUser;
        const enrolledCourses = (signedInUser as any)?.enrolledCourses || [];

        const destination = getPostLoginDestination(
          signedInUser,
          redirectUrl,
          isAllowedRedirectUrl,
        );

        if (enrolledCourses.length > 0 && destination === '/my-classes') {
          router.push('/my-classes');
        } else {
          goToRedirect(destination);
        }

        return { success: true, user: responseUser || signedInUser || undefined };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Login failed');
      return { success: false, error: (error as Error).message };
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const result = await authServerApi.signUpEmail({
        email,
        password,
        name,
      });

      if (result.error) {
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (result.data) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { success: true, email };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Registration failed');
      return { success: false, error: (error as Error).message };
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      const result = await authServerApi.signOut();
      if (result.error) {
        throw new Error(result.error.message);
      }
      setUser(undefined);
      toast.success('Successfully logged out');
      router.push('/');
      return { success: true };
    } catch (error: unknown) {
      toast.error('Logout failed');
      return { success: false, error: (error as Error).message };
    }
  };

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async (redirectUrl?: string) => {
    try {
      if (!baseApiUrl) {
        return { success: false, error: 'Missing NEXT_PUBLIC_BASE_API_URL' };
      }

      const callbackURL = process.env.NEXT_PUBLIC_AUTH_URL
        ? `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/callback`
        : '/auth/callback';

      const validatedRedirect = isAllowedRedirectUrl(redirectUrl) ? redirectUrl : undefined;
      const finalCallbackUrl = validatedRedirect
        ? `${callbackURL}${callbackURL.includes('?') ? '&' : '?'}redirect_url=${encodeURIComponent(validatedRedirect)}`
        : callbackURL;

      const result = await authServerApi.signInSocial({
        provider: 'google',
        callbackURL: finalCallbackUrl,
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      const oauthRedirectUrl = (result.data as any)?.url as string | undefined;
      if (!oauthRedirectUrl) {
        return { success: false, error: 'No OAuth redirect URL returned by server' };
      }

      if (typeof window !== 'undefined') {
        window.location.assign(oauthRedirectUrl);
      }

      return { success: true };
    } catch (error: unknown) {
      toast.error('Google sign-in failed');
      return { success: false, error: (error as Error).message };
    }
  };

  /**
   * Forgot password - send reset email
   */
  const forgotPassword = async (email: string) => {
    try {

      const result = await authServerApi.requestPasswordReset({
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/reset-password`,
      });

      console.log('[forgotPassword] Result:', result);

      if (result.error) {
        const errorMsg = result.error.message || 'Failed to send reset email';
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { success: true, error: null };
    } catch (error: unknown) {
      console.error('[forgotPassword] Error:', error);
      const errorMsg = (error as Error).message || 'Failed to send reset email';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (newPassword: string, token: string) => {
    try {
      const result = await authServerApi.resetPassword({
        newPassword,
        token,
      });

      if (result.error) {
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      toast.success('Password reset successful! You can now log in.');
      router.push('/auth');
      return { success: true };
    } catch (error: unknown) {
      toast.error('Failed to reset password');
      return { success: false, error: (error as Error).message };
    }
  };

  /**
   * Verify email with token
   */
  /**
   * Verify email with token
   */
  const verifyEmailToken = useCallback(async (token: string) => {
    try {
      const result = await authServerApi.verifyEmail(token);

      if (result.error) {
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      toast.success('Email verified successfully! You can now log in.');
      router.push('/auth');
      return { success: true };
    } catch (error: unknown) {
      toast.error('Email verification failed');
      return { success: false, error: (error as Error).message };
    }
  }, [router]);

  return {
    // Session data
    user,
    session,
    isAuthenticated,
    isLoading,
    error,

    // Auth actions
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    forgotPassword,
    resetPassword,
    verifyEmail: verifyEmailToken,

    // Manual session refresh
    refetchSession,

    // User update with automatic session refresh
    updateUserProfile: async (data: Partial<AuthUser>) => {
      try {
        const result = await authServerApi.updateUser(data as Record<string, unknown>);

        if (result.error) {
          return { success: false, error: result.error.message };
        }

        // Automatically refresh session to get updated user data
        await refetchSession();

        return { success: true, data: result.data };
      } catch (error: unknown) {
        return { success: false, error: (error as Error).message };
      }
    },
  };
}

/**
 * Post-login redirect priority:
 * 1) learners with enrollments -> /my-classes
 * 2) validated redirect_url
 * 3) role landing or home
 */
function getPostLoginDestination(
  user: AuthUser | null | undefined,
  redirectUrl: string | undefined,
  isAllowedRedirectUrl: (target?: string | null) => boolean,
): string {
  const enrolledCourses = ((user as any)?.enrolledCourses || []) as any[];
  if (enrolledCourses.length > 0) {
    return '/my-classes';
  }

  if (redirectUrl && isAllowedRedirectUrl(redirectUrl)) {
    return redirectUrl;
  }

  const role = user?.role || 'learner';

  switch (role.toLowerCase()) {
    case 'superadmin':
    case 'admin':
      return '/dashboard/admin';
    case 'instructor':
      return '/dashboard/instructor';
    case 'learner':
    default:
      return '/dashboard/student';
  }
}