const ADMIN_ROLES = new Set(['superadmin', 'admin', 'instructor']);

const SAFE_ROUTES = new Set([
  '/',
  '/courses',
  '/about',
  '/checkout',
  '/blogs',
  '/feedback',
  '/payment',
  '/privacy-policy',
  '/refund-policy',
  '/terms-and-conditions',
]);

export const getValidatedRedirectUrl = (
  url: string | null,
  role: string,
  hasEnrollments: boolean
): string => {

  // 🎯 Single source of truth for default redirect
  const defaultRedirect =
    role && ADMIN_ROLES.has(role.toLowerCase())
      ? '/dashboard/admin'
      : (hasEnrollments
        ? '/dashboard/student'
        : '/checkout');

   
  if (!url) return defaultRedirect;

  //  Block absolute or malformed URLs
  if (!url.startsWith('/')) return defaultRedirect;

  //  Prevent auth loops
  if (url.startsWith('/auth')) return defaultRedirect;

  //  Allow dashboards
  if (url.startsWith('/dashboard')) return url;

  //  Allow known public routes
  if (SAFE_ROUTES.has(url)) return url;

  return defaultRedirect;
};
