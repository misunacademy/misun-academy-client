// Error message translations for Better Auth error codes
import { authClient } from './auth-client';

type ErrorCode = keyof typeof authClient.$ERROR_CODES;

// Map common error codes/messages to Bengali translations
// Using a simple Record to avoid strict type checking issues
const errorMessages: Record<string, string> = {
  // User errors
  USER_NOT_FOUND: "ব্যবহারকারী পাওয়া যায়নি",
  USER_ALREADY_EXISTS: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে",
  FAILED_TO_CREATE_USER: "ব্যবহারকারী তৈরি করতে ব্যর্থ হয়েছে",
  FAILED_TO_UPDATE_USER: "ব্যবহারকারীর তথ্য আপডেট করতে ব্যর্থ হয়েছে",
  
  // Session errors
  FAILED_TO_CREATE_SESSION: "সেশন তৈরি করতে ব্যর্থ হয়েছে",
  FAILED_TO_GET_SESSION: "সেশন পেতে ব্যর্থ হয়েছে",
  
  // Password errors
  INVALID_PASSWORD: "ভুল পাসওয়ার্ড",
  WEAK_PASSWORD: "পাসওয়ার্ড আরও শক্তিশালী হতে হবে",
  USER_ALREADY_HAS_PASSWORD: "ব্যবহারকারীর ইতিমধ্যে পাসওয়ার্ড রয়েছে",
  
  // Email errors
  INVALID_EMAIL: "অবৈধ ইমেইল ঠিকানা",
  EMAIL_NOT_VERIFIED: "আপনার ইমেইল ভেরিফাই করা হয়নি। আপনার ইনবক্স চেক করুন।",
  
  // Token errors
  INVALID_TOKEN: "অবৈধ বা মেয়াদোত্তীর্ণ টোকেন",
  
  // Auth errors
  INVALID_CREDENTIALS: "ভুল ইমেইল বা পাসওয়ার্ড",
  UNAUTHORIZED: "এই কাজটি করার অনুমতি নেই",
  
  // Common error messages (fallbacks)
  "Invalid email or password": "ভুল ইমেইল বা পাসওয়ার্ড",
  "User already exists": "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে",
  "Email not verified": "আপনার ইমেইল ভেরিফাই করা হয়নি",
  "Invalid token": "অবৈধ বা মেয়াদোত্তীর্ণ টোকেন",
};

export function getAuthErrorMessage(code?: string | ErrorCode, fallback?: string): string {
  if (!code) return fallback || "একটি ত্রুটি ঘটেছে";
  return errorMessages[code as string] || fallback || code;
}
