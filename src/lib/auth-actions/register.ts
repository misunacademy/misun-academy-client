import { authServerApi } from '@/lib/auth-server-api';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { toast } from 'sonner';

export async function signUpAction(name: string, email: string, password: string) {
  try {
    const result = await authServerApi.signUpEmail({ email, password, name });

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
}
