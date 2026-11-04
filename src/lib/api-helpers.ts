export function extractApiData<T>(payload: unknown): T | undefined {
  if (payload !== null && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    if (data !== undefined) return data as T;
  }
  return payload === null || payload === undefined ? undefined : (payload as T);
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const e = err as {
      data?: { message?: string; correlationId?: string };
      error?: string;
      message?: string;
    };
    const message = e.data?.message || e.error || e.message || fallback;
    const correlationId = e.data?.correlationId;
    // Server 5xx bodies are intentionally generic ("Something went wrong !").
    // The correlation id is the only handle support has to find the real
    // error in the server logs, so surface a short reference with it.
    return correlationId ? `${message} (ref: ${correlationId.slice(0, 8)})` : message;
  }
  return fallback;
}
