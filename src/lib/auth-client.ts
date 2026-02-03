import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL! + '/auth',
  fetchOptions: {
    credentials: "include", // Important for cookies and session management
  },
  plugins: [],
});

export const {
  signOut,
  signIn,
  signUp,
  useSession,
} = authClient;



