import { authServerApi } from '@/lib/auth-server-api';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { toast } from 'sonner';

export async function forgotPasswordAction(email: string) {
  try {
    const result = await authServerApi.requestPasswordReset({
      email,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/reset-password`,
    });

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
}

export async function resetPasswordAction(newPassword: string, token: string, push: (url: string) => void) {
  try {
    const result = await authServerApi.resetPassword({ newPassword, token });

    if (result.error) {
      const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    toast.success('Password reset successful! You can now log in.');
    push('/auth');
    return { success: true };
  } catch (error: unknown) {
    toast.error('Failed to reset password');
    return { success: false, error: (error as Error).message };
  }
}
