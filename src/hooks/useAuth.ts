/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Simplified auth hook using Better Auth
 * All authentication is now handled by Better Auth (no Redux, no custom JWT)
 */
export function useAuth() {
  const router = useRouter();
  const { data: session, isPending, error } = useSession();

  const user = session?.user;
  const isAuthenticated = !!user;
  const isLoading = isPending;

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string, redirectTo?: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || 'Login failed');
        return { success: false, error: result.error.message };
      }

      if (result.data) {
        toast.success('Successfully logged in!');
        
        // Redirect to dashboard or specified page
        const destination = redirectTo || getDashboardRoute(result.data.user);
        router.push(destination);
        
        return { success: true, user: result.data.user };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        toast.error(result.error.message || 'Registration failed');
        return { success: false, error: result.error.message };
      }

      if (result.data) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { success: true, email };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      await authClient.signOut();
      toast.success('Successfully logged out');
      router.push('/auth');
      return { success: true };
    } catch (error: any) {
      toast.error('Logout failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      // Use absolute frontend URL for OAuth callback
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
      const callbackURL = redirectTo || `${frontendUrl}/auth/callback`;
      
      await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      });
      return { success: true };
    } catch (error: any) {
      toast.error('Google sign-in failed');
      return { success: false, error: error.message };
    }
  };

  /**
   * Forgot password - send reset email
   */
  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          redirectTo: '/reset-password',
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to send reset email');
        return { success: false, error: data.message };
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { success: true, error: null };
    } catch (error: any) {
      toast.error('Failed to send reset email');
      return { success: false, error: error.message };
    }
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (newPassword: string, token: string) => {
    try {
      const result = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to reset password');
        return { success: false, error: result.error.message };
      }

      toast.success('Password reset successful! You can now log in.');
      router.push('/auth');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to reset password');
      return { success: false, error: error.message };
    }
  };

  /**
   * Verify email with token
   */
  const verifyEmailToken = async (token: string) => {
    try {
      const result = await authClient.verifyEmail({
        query: {
          token,
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Email verification failed');
        return { success: false, error: result.error.message };
      }

      toast.success('Email verified successfully! You can now log in.');
      router.push('/auth');
      return { success: true };
    } catch (error: any) {
      toast.error('Email verification failed');
      return { success: false, error: error.message };
    }
  };

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
  };
}

/**
 * Helper to determine dashboard route based on user role
 */
function getDashboardRoute(user: any): string {
  const role = user?.role || 'learner';
  
  switch (role.toLowerCase()) {
    case 'superadmin':
    case 'admin':
      return '/dashboard/admin';
    case 'instructor':
      return '/instructor/dashboard';
    case 'learner':
    default:
      return '/dashboard/student';
  }
}