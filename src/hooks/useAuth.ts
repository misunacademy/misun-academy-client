/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authClient } from '@/lib/auth-client';
import { setSession, setLoading, logout, setUser } from '@/redux/features/auth/authSlice';
import { signInWithEmail, signUpWithEmail } from '@/actions/auth';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

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

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      dispatch(setLoading(true));
      try {
        // Check Better Auth session first (for social login)
        const session = await authClient.getSession();
        const betterPayload = (session as any)?.data ?? (session as any)?.user ?? (session as any)?.session;
        if (betterPayload) {
          dispatch(setSession(serializeSession(betterPayload)));
        } else {
          // Check server auth (for email/password login)
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
        Cookies.set('token', result.token, { expires: 7 }); // 7 days
        if (result.refreshToken) {
          Cookies.set('refreshToken', result.refreshToken, { expires: 30 }); // refresh token long-lived
        }
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
console.log("res from useAuth.ts",result)
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
      dispatch(logout());
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
        window.location.href = result.data.url;
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