/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSession, setLoading, logout, setUser } from '@/redux/features/auth/authSlice';
import { signInWithEmail, signUpWithEmail } from '@/actions/auth';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useEnrollment } from './useEnrollment';
import { useRouter } from 'next/navigation';
// Utility function to serialize session data for Redux
const serializeSession = (session: any) => {
  if (!session) return null;

  try {
    // Use JSON serialization to handle all non-serializable values
    const serialized = JSON.parse(JSON.stringify(session, (key, value) => {
      // Handle Date objects
      if (value instanceof Date) {
        return value.toISOString();
      }
      // Handle functions, undefined, and other non-serializable values
      if (typeof value === 'function' || value === undefined) {
        return null;
      }
      return value;
    }));

    return serialized;
  } catch (error) {
    console.warn('Failed to serialize session data:', error);
    // Fallback: return a minimal serializable object
    return {
      user: session.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      } : null,
    };
  }
};

// Function to check server auth
const checkServerAuth = async () => {

  const token = Cookies.get('token');
  if (!token) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Failed to validate server token:', error);
  }
  return null;
};

// Function to handle social login
const handleSocialLogin = async (userData: { email: string; name?: string; image?: string }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/social-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        image: userData.image,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const result = data.data;

      if (result.token) {
        // Store token and refresh token in cookies
        Cookies.set('token', result.token, { expires: 7, secure: false }); // 7 days
        if (result.refreshToken) {
          Cookies.set('refreshToken', result.refreshToken, { expires: 30, secure: false }); // refresh token long-lived
        }
        console.debug('[useAuth] social login tokens stored');
        return result.user;
      }
    }
  } catch (error) {
    console.error('Failed to handle social login:', error);
  }
  return null;
};

export function useAuth() {
  const dispatch = useDispatch();
  const { hasEnrollments } = useEnrollment();
  const router = useRouter();
  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      dispatch(setLoading(true));
      try {
        // First check if we already have a valid JWT token (user is already logged in)
        const existingToken = Cookies.get('token');
        if (existingToken) {
          const serverUser = await checkServerAuth();
          if (serverUser) {
            dispatch(setUser(serverUser));
            dispatch(setLoading(false));
            return;
          }
        }

        // Check Better Auth session (for social login)
        const session = await authClient.getSession();
        const betterPayload = (session as any)?.data ?? (session as any)?.user ?? (session as any)?.session;
        if (betterPayload && betterPayload.user?.email) {
          // Handle social login - get JWT tokens
          const user = await handleSocialLogin({
            email: betterPayload.user.email,
            name: betterPayload.user.name,
            image: betterPayload.user.image,
          });
          if (user) {
            dispatch(setUser(user));
            toast.success("Google দিয়ে সফলভাবে লগইন হয়েছে!");
            // Redirect to dashboard after successful social login
            if (typeof window !== 'undefined') {
              const roleMap: Record<string, string> = {
                'superadmin': '/dashboard/admin',
                'admin': '/dashboard/admin',
                'instructor': '/dashboard/admin',
                'learner': `${hasEnrollments ? '/dashboard/student' : '/checkout'}`,
              };
              const dashboardPath = user.role ? roleMap[user.role.toLowerCase()] || '/dashboard/student' : '/dashboard/student';
              // window.location.href = dashboardPath;
              router.push(dashboardPath);
            }
          } else {
            // If social login failed, fall back to session data
            dispatch(setSession(serializeSession(betterPayload)));
          }
        } else {
          // No social session, check server auth
          const serverUser = await checkServerAuth();
          if (serverUser) {
            dispatch(setUser(serverUser));
          } else {
            dispatch(logout());
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  const signIn = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const result = await signInWithEmail(email, password);

      if (result.token) {
        // Store token and refresh token in cookies
        Cookies.set('token', result.token, { expires: 7, secure: false }); // 7 days
        if (result.refreshToken) {
          Cookies.set('refreshToken', result.refreshToken, { expires: 30, secure: false }); // refresh token long-lived
        }        // Debug: confirm cookies presence after login
        console.debug('[useAuth] after signIn cookies token:', !!Cookies.get('token'), 'refreshToken:', !!Cookies.get('refreshToken'));
        dispatch(setUser(result.user));
        // toast.success('সফলভাবে লগইন হয়েছে!');
        return { success: true, user: result.user };
      } else {
        // toast.error('Login failed');
        return { success: false, error: 'Login failed' };
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const result = await signUpWithEmail(name, email, password);

      if (result.token) {
        // Store token and refresh token in cookies
        Cookies.set('token', result.token, { expires: 7 }); // 7 days
        if (result.refreshToken) {
          Cookies.set('refreshToken', result.refreshToken, { expires: 30 }); // refresh token long-lived
        }
        dispatch(setUser(result.user));
        toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
        return { success: true, user: result.user };
      } else {
        // toast.error('Registration failed');
        return { success: false, error: 'Registration failed' };
      }
    } catch (error: any) {
      // toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signOut = async () => {
    dispatch(setLoading(true));
    try {
      await authClient.signOut();
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      dispatch(logout());
      // Redirect to login page after logout
      if (typeof window !== 'undefined') {
        // window.location.href = '/auth';
        router.push('/auth');
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signInWithGoogle = async () => {
    dispatch(setLoading(true));
    try {
      const result = await authClient.signIn.social({
        provider: 'google',
      });

      if (result.data?.url) {
        // Redirect to the OAuth provider
        // window.location.href = result.data.url;
        router.push(result.data.url);

        return { success: true };
      } else {
        return { success: false, error: 'No redirect URL received' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
}