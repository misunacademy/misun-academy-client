import { authServerApi } from '@/lib/auth-server-api';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { getRedirectUrlFromLocation, isAllowedRedirectUrl } from '@/lib/auth-redirect';
import { toast } from 'sonner';
import type { AuthUser } from '@/types/auth';

export function getPostLoginDestination(
  user: AuthUser | null | undefined,
  redirectUrl: string | undefined,
  isAllowedRedirectFn: (target?: string | null) => boolean,
): string {
  if (redirectUrl && isAllowedRedirectFn(redirectUrl)) {
    return redirectUrl;
  }

  const role = user?.role || 'learner';

  switch (role.toLowerCase()) {
    case 'superadmin':
    case 'admin':
      return '/dashboard/admin';
    case 'instructor':
      return '/dashboard/instructor';
    case 'employee':
      return '/dashboard/employee';
    case 'learner':
      return '/my-classes';
    default:
      return '/my-classes';
  }
}

export async function signInAction(
  email: string,
  password: string,
  redirectUrl: string | undefined,
  refetchSession: () => Promise<AuthUser | null | undefined>,
  goToRedirect: (url: string) => void,
) {
  try {
    const result = await authServerApi.signInEmail({ email, password });

    if (result.error) {
      const errorMsg = getAuthErrorMessage(result.error.code, result.error.message);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (result.data) {
      toast.success('Successfully logged in!');
      const responseUser = result.data?.user;
      const signedInUser = (await refetchSession()) || responseUser;

      const destination = getPostLoginDestination(
        signedInUser,
        redirectUrl,
        (target?: string | null) => isAllowedRedirectUrl(target),
      );

      goToRedirect(destination);

      return { success: true, user: responseUser || signedInUser || undefined };
    }

    return { success: false, error: 'Login failed' };
  } catch (error: unknown) {
    toast.error((error as Error).message || 'Login failed');
    return { success: false, error: (error as Error).message };
  }
}

export async function signInWithGoogleAction(
  baseApiUrl: string | undefined,
  redirectUrl?: string,
) {
  try {
    if (!baseApiUrl) {
      return { success: false, error: 'Missing NEXT_PUBLIC_BASE_API_URL' };
    }

    const callbackURL = process.env.NEXT_PUBLIC_AUTH_URL
      ? `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/callback`
      : '/auth/callback';

    const redirectCandidate = redirectUrl || getRedirectUrlFromLocation();
    const validatedRedirect = isAllowedRedirectUrl(redirectCandidate) ? redirectCandidate : undefined;
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

    const oauthRedirectUrl = result.data?.url;
    if (!oauthRedirectUrl) {
      return { success: false, error: 'No OAuth redirect URL returned by server' };
    }

    if (typeof window !== 'undefined') {
      let finalOauthUrl = oauthRedirectUrl;

      if (validatedRedirect) {
        try {
          const parsedOauthUrl = new URL(oauthRedirectUrl, window.location.origin);
          if (!parsedOauthUrl.searchParams.get('redirect_url')) {
            parsedOauthUrl.searchParams.set('redirect_url', validatedRedirect);
          }
          finalOauthUrl = parsedOauthUrl.toString();
        } catch {
          // Keep original URL when parsing fails.
        }
      }

      window.location.assign(finalOauthUrl);
    }

    return { success: true };
  } catch (error: unknown) {
    toast.error('Google sign-in failed');
    return { success: false, error: (error as Error).message };
  }
}
