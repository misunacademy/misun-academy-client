import { z } from 'zod';

const envSchema = z.object({
    // Client-side variables (NEXT_PUBLIC_)
    NEXT_PUBLIC_BASE_API_URL: z.string().url().min(1, 'Base API URL is required'),
    NEXT_PUBLIC_FACEBOOK_PIXEL_ID: z.string().optional(),
    NEXT_PUBLIC_AUTH_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_GA_ID: z.string().optional(),

    // Server-side variables
    META_PIXEL_ID: z.string().optional(),
    META_CAPI_TOKEN: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
