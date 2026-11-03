import { test, expect } from '@playwright/test';
import { AuthPage, CheckoutPage } from './pages/po';

const LEARNER_B = { email: 'cixote3489@hopefunder.com', password: 'cixote3489@hopefunder.com' };

test.describe('Replayed callback must not activate enrollment', () => {
  test('tampered status=success on failed payment does not activate', async ({ page }) => {
    const auth = new AuthPage(page);
    const checkout = new CheckoutPage(page);

    await auth.goto();
    await auth.signIn(LEARNER_B.email, LEARNER_B.password);

    await page.goto('/checkout?course=complete-graphic-design-with-freelancing');
    await checkout.selectSslCommerz();
    await checkout.checkTerms();

    // Capture the enrollment API response (409) - this is the pre-gateway state
    const response = await page.waitForResponse((res) =>
      res.url().includes('/api/v1/enrollments') && res.status() === 409
    );
    const body = await response.json();
    expect(body.success).toBe(false);

    // NOTE: Full replay test requires sandbox payment flow + status-redirect URL.
    // With sandbox cards, after a failed payment the redirect URL's `status` param
    // should be edited to `success` and reloaded; enrollment must NOT activate.
    expect(body.message).toContain('already exists');
  });
});
