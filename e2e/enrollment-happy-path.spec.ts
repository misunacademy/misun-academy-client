import { test, expect } from '@playwright/test';
import { AuthPage, CheckoutPage } from './pages/po';

const LEARNER_A = { email: 'cobixak123@hopefunder.com', password: 'cobixak123@hopefunder.com' };
const LEARNER_B = { email: 'cixote3489@hopefunder.com', password: 'cixote3489@hopefunder.com' };

test.describe('Enrollment happy path', () => {
  test('learner signs in and reaches checkout', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn(LEARNER_A.email, LEARNER_A.password);
    await auth.assertSignedIn();

    await page.goto('/checkout?course=complete-graphic-design-with-freelancing');
    await expect(page.getByRole('heading', { name: /AI Powered Complete Graphic/ })).toBeVisible();
    await expect(page.getByText(/৳4,500/)).toBeVisible();
  });

  test('already enrolled learner sees graceful message', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn(LEARNER_A.email, LEARNER_A.password);

    await page.goto('/checkout?course=complete-graphic-design-with-freelancing');
    await expect(page.getByText(/ইতিমধ্যে এই ব্যাচে ভর্তি আছেন/)).toBeVisible();
    await expect(page.getByText(/MA-/)).toBeVisible();
  });
});
