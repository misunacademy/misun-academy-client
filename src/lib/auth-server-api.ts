/* eslint-disable @typescript-eslint/no-explicit-any */
type AuthServerError = {
  code?: string;
  message: string;
};

export type AuthServerResult<T = any> = {
  data: T | null;
  error: AuthServerError | null;
  status: number;
};

type SocialSignInInput = {
  provider: string;
  callbackURL?: string;
  errorCallbackURL?: string;
  newUserCallbackURL?: string;
};

const getBaseApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!baseUrl) {
    throw new Error('Missing NEXT_PUBLIC_BASE_API_URL');
  }
  return baseUrl;
};

const getAuthServerBaseUrl = () => {
  return `${getBaseApiUrl()}/auth/server`;
};

const parseResponsePayload = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text ? { message: text } : null;
  } catch {
    return null;
  }
};

const buildError = (status: number, payload: any): AuthServerError => {
  const code = payload?.code || payload?.error?.code;
  const message =
    payload?.message ||
    payload?.error?.message ||
    payload?.error ||
    `Authentication request failed (${status})`;

  return { code, message };
};

const authServerRequest = async <T = any>(
  path: string,
  init?: RequestInit
): Promise<AuthServerResult<T>> => {
  const response = await fetch(`${getAuthServerBaseUrl()}${path}`, {
    credentials: 'include',
    ...init,
  });

  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    return {
      data: null,
      error: buildError(response.status, payload),
      status: response.status,
    };
  }

  return {
    data: (payload as T) ?? null,
    error: null,
    status: response.status,
  };
};

const absoluteRequest = async <T = any>(
  url: string,
  init?: RequestInit
): Promise<AuthServerResult<T>> => {
  const response = await fetch(url, {
    credentials: 'include',
    ...init,
  });

  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    return {
      data: null,
      error: buildError(response.status, payload),
      status: response.status,
    };
  }

  return {
    data: (payload as T) ?? null,
    error: null,
    status: response.status,
  };
};

const jsonRequest = <T = any>(
  path: string,
  method: 'POST' | 'PATCH',
  body?: unknown
) => {
  return authServerRequest<T>(path, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
};

export const authServerApi = {
  signInEmail: (body: {
    email: string;
    password: string;
    callbackURL?: string;
    rememberMe?: boolean;
  }) => jsonRequest('/sign-in/email', 'POST', body),

  signInSocial: async (body: SocialSignInInput) => {
    const socialPayload = {
      ...body,
      disableRedirect: true,
    };

    const wrappedEndpointResult = await jsonRequest('/sign-in/social', 'POST', socialPayload);
    if (wrappedEndpointResult.status !== 404) {
      return wrappedEndpointResult;
    }

    // Backward-compatible fallback for environments where /auth/server route is not deployed yet.
    return absoluteRequest(`${getBaseApiUrl()}/auth/sign-in/social`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(socialPayload),
    });
  },

  signUpEmail: (body: {
    name: string;
    email: string;
    password: string;
    image?: string;
    callbackURL?: string;
  }) => jsonRequest('/sign-up/email', 'POST', body),

  signOut: () => jsonRequest('/sign-out', 'POST'),

  requestPasswordReset: (body: { email: string; redirectTo?: string }) =>
    jsonRequest('/request-password-reset', 'POST', body),

  resetPassword: (body: { newPassword: string; token: string }) =>
    jsonRequest('/reset-password', 'POST', body),

  verifyEmail: (token: string) =>
    authServerRequest(`/verify-email?token=${encodeURIComponent(token)}`),

  changePassword: (body: {
    currentPassword: string;
    newPassword: string;
    revokeOtherSessions?: boolean;
  }) => jsonRequest('/change-password', 'POST', body),

  updateUser: (body: Record<string, unknown>) =>
    jsonRequest('/update-user', 'PATCH', body),

  listSessions: () => authServerRequest<any[]>('/list-sessions'),

  revokeSession: (token: string) =>
    jsonRequest('/revoke-session', 'POST', { token }),
};
