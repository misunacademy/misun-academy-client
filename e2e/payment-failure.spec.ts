import { test, expect } from '@playwright/test';
import { AuthPage, CheckoutPage } from './pages/po';

const LEARNER_B = { email: 'cixote3489@hopefunder.com', password: 'cixote3489@hopefunder.com' };

test.describe('Payment failure / cancel / replay', () => {
  test('complete enrollment fails with 409 when enrollment already exists', async ({ page }) => {
    const auth = new AuthPage(page);
    const checkout = new CheckoutPage(page);

    await auth.goto();
    await auth.signIn(LEARNER_B.email, LEARNER_B.password);

    await page.goto('/checkout?course=complete-graphic-design-with-freelancing');
    await checkout.selectSslCommerz();
    await checkout.checkTerms();

    // NOTE: sandbox card not available; this asserts the pre-gateway failure observed in QA
    const response = await page.waitForResponse((res) =>
      res.url().includes('/api/v1/enrollments') && res.status() === 409
    );
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('already exists');
  });
});
