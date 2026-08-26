export function extractApiData<T>(payload: unknown): T | undefined {
  if (payload !== null && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    if (data !== undefined) return data as T;
  }
  return payload === null || payload === undefined ? undefined : (payload as T);
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const e = err as { data?: { message?: string }; error?: string; message?: string };
    return e.data?.message || e.error || e.message || fallback;
  }
  return fallback;
}
