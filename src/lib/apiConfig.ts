/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * Standard API error response from server
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorDetails?: Array<{
    field?: string;
    message: string;
  }>;
  stack?: string;
}

/**
 * Standard API success response from server
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

/**
 * Extract error message from RTK Query error
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';

  // Check if it's a FetchBaseQueryError
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const fetchError = error as FetchBaseQueryError;

    // Check if error has data with our API error format
    if (fetchError.data && typeof fetchError.data === 'object') {
      const errorData = fetchError.data as ApiErrorResponse;
      
      if (errorData.message) {
        return errorData.message;
      }

      if (errorData.errorDetails && errorData.errorDetails.length > 0) {
        return errorData.errorDetails.map(e => e.message).join(', ');
      }
    }

    // Handle specific HTTP status codes
    if (typeof fetchError.status === 'number') {
      switch (fetchError.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authenticated. Please log in.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This resource already exists.';
        case 422:
          return 'Validation failed. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return `Request failed with status ${fetchError.status}`;
      }
    }

    if (fetchError.status === 'FETCH_ERROR') {
      return 'Network error. Please check your connection.';
    }

    if (fetchError.status === 'PARSING_ERROR') {
      return 'Failed to parse server response.';
    }

    if (fetchError.status === 'TIMEOUT_ERROR') {
      return 'Request timeout. Please try again.';
    }
  }

  // Handle SerializedError
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message: string }).message;
  }

  return 'An unexpected error occurred';
};

/**
 * Extract field-specific errors for form validation
 */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!error) return {};

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const fetchError = error as FetchBaseQueryError;

    if (fetchError.data && typeof fetchError.data === 'object') {
      const errorData = fetchError.data as ApiErrorResponse;

      if (errorData.errorDetails && errorData.errorDetails.length > 0) {
        const fieldErrors: Record<string, string> = {};
        errorData.errorDetails.forEach(detail => {
          if (detail.field) {
            fieldErrors[detail.field] = detail.message;
          }
        });
        return fieldErrors;
      }
    }
  }

  return {};
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (!error) return false;

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const fetchError = error as FetchBaseQueryError;
    return fetchError.status === 401;
  }

  return false;
};

/**
 * Check if error is a forbidden error
 */
export const isForbiddenError = (error: unknown): boolean => {
  if (!error) return false;

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const fetchError = error as FetchBaseQueryError;
    return fetchError.status === 403;
  }

  return false;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (!error) return false;

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const fetchError = error as FetchBaseQueryError;
    return fetchError.status === 400 || fetchError.status === 422;
  }

  return false;
};

/**
 * Format pagination params for API requests
 */
export const formatPaginationParams = (params: {
  page?: number;
  limit?: number;
  [key: string]: any;
}) => {
  const { page = 1, limit = 10, ...rest } = params;
  return {
    page,
    limit,
    ...rest,
  };
};

/**
 * Build query string from params object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Retry configuration for failed requests
 */
export const retryCondition = (error: FetchBaseQueryError): boolean => {
  // Retry on network errors
  if (error.status === 'FETCH_ERROR') return true;
  
  // Retry on timeout
  if (error.status === 'TIMEOUT_ERROR') return true;
  
  // Retry on 5xx server errors
  if (typeof error.status === 'number' && error.status >= 500) return true;
  
  // Don't retry on 4xx client errors
  return false;
};

/**
 * Token management utilities
 */
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

/**
 * API request configuration
 */
export const apiConfig = {
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};
