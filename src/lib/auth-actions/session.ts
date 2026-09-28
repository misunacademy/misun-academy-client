import { authServerApi } from '@/lib/auth-server-api';
import { baseApi } from '@/redux/api/baseApi';
import { store } from '@/redux/store';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { toast } from 'sonner';
import type { AuthUser } from '@/types/auth';

export async function signOutAction(
  setUser: (user: AuthUser | undefined) => void,
  push: (url: string) => void,
) {
  try {
    const result = await authServerApi.signOut();
    if (result.error) {
      throw new Error(result.error.message);
    }
    setUser(undefined);
    // Purge cached queries so the next login starts clean.
    store.dispatch(baseApi.util.resetApiState());
    toast.success('Successfully logged out');
    push('/');
    return { success: true };
  } catch (error: unknown) {
    toast.error('Logout failed');
    return { success: false, error: (error as Error).message };
  }
}

export async function verifyEmailTokenAction(token: string, push: (url: string) => void) {
  try {
    const result = await authServerApi.verifyEmail(token);

    if (result.error) {
      const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    toast.success('Email verified successfully! You can now log in.');
    push('/auth');
    return { success: true };
  } catch (error: unknown) {
    toast.error('Email verification failed');
    return { success: false, error: (error as Error).message };
  }
}

export async function updateUserProfileAction(
  data: Partial<AuthUser>,
  refetchSession: () => Promise<AuthUser | null | undefined>,
) {
  try {
    // Client-side allowlist (server enforces input:false too): never forward
    // role/status even if a caller passes a full user object.
    const { name, image, phone, address, avatar } = data;
    const result = await authServerApi.updateUser({
      ...(name !== undefined ? { name } : {}),
      ...(image !== undefined ? { image } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(address !== undefined ? { address } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    await refetchSession();

    return { success: true, data: result.data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
