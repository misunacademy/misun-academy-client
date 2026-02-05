// Type definitions for Better Auth with custom fields
import type { authClient } from "@/lib/auth-client";

// Infer session type from Better Auth client
export type Session = typeof authClient.$Infer.Session;

// Base user type from Better Auth
type BaseUser = Session["user"];

// Extended user type with our custom fields
export interface AuthUser extends BaseUser {
  role: "learner" | "instructor" | "admin" | "superadmin";
  status: "active" | "suspended" | "deleted";
  phone?: string;
  address?: string;
  avatar?: string;
}

// Helper type for session with typed user
export interface TypedSession extends Omit<Session, "user"> {
  user: AuthUser;
}
