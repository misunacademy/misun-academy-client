/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface SettingsResponse {
  _id?: string;
  featuredEnrollmentCourse?: string;
  featuredEnrollmentBatch?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const settingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // Get settings
    getSettings: build.query<{ data: SettingsResponse | null }, void>({
      query: () => ({
        url: "/settings",
      }),
      providesTags: ["Settings"],
    }),

    // Update settings
    updateSettings: build.mutation<any, Partial<SettingsResponse>>({
      query: (data) => ({
        url: "/settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;