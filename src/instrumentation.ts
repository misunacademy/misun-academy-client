// Fail fast on misconfigured env at server boot (validates via zod in lib/env).
export async function register() {
  await import('@/lib/env');
}
