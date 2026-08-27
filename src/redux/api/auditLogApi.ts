import { baseApi } from "./baseApi";

export interface AuditLogEntry {
  _id: string;
  actor?: { _id: string; name: string; email: string; role?: string } | null;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  createdAt?: string;
}

export interface AuditLogsResponse {
  items: AuditLogEntry[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  action?: string;
  targetType?: string;
  actor?: string;
  from?: string;
  to?: string;
}

const auditLogApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getAuditLogs: build.query<AuditLogsResponse, AuditLogQuery | void>({
      query: (params) => ({
        url: "/audit-logs",
        params: (params as AuditLogQuery) || undefined,
      }),
      transformResponse: (raw: { data?: AuditLogsResponse }) =>
        raw?.data ?? { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } },
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogApi;
