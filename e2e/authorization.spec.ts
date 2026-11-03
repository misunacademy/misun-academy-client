import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/po';

const LEARNER_A = { email: 'cobixak123@hopefunder.com', password: 'cobixak123@hopefunder.com' };

test.describe('Cross-user access denied', () => {
  test('learner cannot access admin routes', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn(LEARNER_A.email, LEARNER_A.password);

    const adminRoutes = ['/dashboard/admin', '/dashboard/admin/enrollments', '/dashboard/admin/payments'];
    for (const route of adminRoutes) {
      await page.goto(route);
      await expect(page).not.toHaveURL(route);
      await expect(page).toHaveURL(/my-classes/);
    }
  });

  test('anonymous users are redirected to login for protected routes', async ({ page }) => {
    const protectedRoutes = ['/my-classes', '/checkout', '/dashboard/admin'];
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/auth/);
    }
  });
});
