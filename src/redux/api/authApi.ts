import { baseApi } from "./baseApi";
import type { AuthUser } from '@/types/auth';

interface SessionResponse {
  user: AuthUser | null;
  session: unknown;
}

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getSession: build.query<SessionResponse, void>({
      query: () => ({
        url: "/auth/get-session",
      }),
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetSessionQuery,
} = authApi;
