import { toast } from "sonner";

interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
  message?: string;
  status?: number;
}

export function parseApiFormError(error: unknown): {
  message: string;
  fieldErrors?: Record<string, string>;
} {
  if (!error || typeof error !== "object") {
    return { message: "An unexpected error occurred" };
  }

  const apiError = error as ApiError;

  const message =
    apiError?.data?.message || apiError?.message || "Something went wrong";

  const fieldErrors: Record<string, string> = {};

  if (apiError?.data?.errors) {
    for (const [field, messages] of Object.entries(apiError.data.errors)) {
      if (messages.length > 0) {
        fieldErrors[field] = messages[0];
      }
    }
  }

  return { message, fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined };
}

export function showFormToast(error: unknown, fallback?: string): void {
  const { message } = parseApiFormError(error);
  toast.error(message || fallback || "An unexpected error occurred");
}

export function showFormSuccessToast(message?: string): void {
  toast.success(message || "Saved successfully");
}

export function mapServerErrorsToForm<T extends Record<string, string>>(
  serverErrors: Record<string, string>,
): Partial<T> {
  return serverErrors as Partial<T>;
}
