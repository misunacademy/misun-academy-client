import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL! + '/auth',
  fetchOptions: {
    credentials: "include", // Important for cookies and session management
  },
  plugins: [
    // Manually specify additional fields since server is separate
    // Note: input:false means users cannot set these fields during signup/signin
    inferAdditionalFields({
      user: {
        role: { 
          type: "string",
          input: false, // Server sets this, not users
        },
        status: { 
          type: "string",
          input: false, // Server sets this, not users
        },
        phone: { 
          type: "string",
          required: false,
        },
        address: { 
          type: "string",
          required: false,
        },
        avatar: { 
          type: "string",
          required: false,
        },
      },
    }),
  ],
});

export const {
  signOut,
  signIn,
  signUp,
  useSession,
  updateUser
} = authClient;



