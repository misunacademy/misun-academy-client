"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// export async function getSession() {
//     const auth = await getAuth();
//     const session = await auth.api.getSession({
//         headers: await headers()
//     });
//     return session;
// }
export async function getSession() {
    // No need to await getAuth(); 'auth' is already the instance
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session;
}
export async function signInWithEmail(email: string, password: string) {
    // Normalize email and call server API for email/password login
    const normalizedEmail = email.trim().toLowerCase();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
    });

    if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
            const error = await response.json();
            errorMessage = error.errorMessages?.[0]?.message || error.message || 'Login failed';
        } catch (parseError) {
            // If response is not JSON (e.g., HTML error page), use status text
            errorMessage = `Login failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data ?? data;
}

export async function signUpWithEmail(name: string, email: string, password: string) {
    // Normalize email and call server API for email/password registration
    const normalizedEmail = email.trim().toLowerCase();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email: normalizedEmail, password }),
    });

    if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
            const error = await response.json();
            errorMessage = error.errorMessages?.[0]?.message || error.message || 'Registration failed';
        } catch (parseError) {
            // If response is not JSON (e.g., HTML error page), use status text
            errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();
    // The backend wraps the real payload under `data` (e.g. { data: { token, user } }),
    // normalize to return that inner payload when present so callers can access token/user directly.
    return data.data ?? data;
}

export async function resendVerificationEmail(email: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        let errorMessage = 'Resend failed';
        try {
            const error = await response.json();
            errorMessage = error.errorMessages?.[0]?.message || error.message || 'Resend failed';
        } catch (parseError) {
            errorMessage = `Resend failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data ?? data;
}