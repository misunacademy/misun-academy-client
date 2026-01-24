import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL!,
  // fetchOptions: {
  //   credentials: "include", // Important for cookies in OAuth flow
  // },
});

export const {
  signOut,
  useSession,
  getSession,
} = authClient;



