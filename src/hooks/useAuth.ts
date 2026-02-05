/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AuthUser } from '@/types/auth';
import { getAuthErrorMessage } from '@/lib/auth-errors';

/**
 * Simplified auth hook using Better Auth
 * All authentication is now handled by Better Auth (no Redux, no custom JWT)
 */
export function useAuth() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } = useSession();

  const user = session?.user as AuthUser | undefined;
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
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
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
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
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
      // Use relative path - Better Auth will handle the full URL
      const callbackURL = redirectTo || '/auth/callback';
      
      await authClient.signIn.social({
        provider: 'google',
        callbackURL, // Relative path
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
      
      // Use Better Auth client's requestPasswordReset method (not forgetPassword)
      const result = await authClient.requestPasswordReset({
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
    } catch (error: any) {
      console.error('[forgotPassword] Error:', error);
      const errorMsg = error.message || 'Failed to send reset email';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
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
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
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
        const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
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
    
    // Manual session refresh
    refetchSession: refetch,
    
    // User update with automatic session refresh
    updateUserProfile: async (data: Partial<AuthUser>) => {
      try {
        const result = await authClient.updateUser(data);
        
        if (result.error) {
          return { success: false, error: result.error.message };
        }
        
        // Automatically refresh session to get updated user data
        await refetch();
        
        return { success: true, data: result.data };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
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
      return '/dashboard/instructor';
    case 'learner':
    default:
      return '/dashboard/student';
  }
}