import { test, expect } from '@playwright/test';
import { AuthPage } from './pages/po';

const LEARNER_A = { email: 'cobixak123@hopefunder.com', password: 'cobixak123@hopefunder.com' };
const ENROLLMENT_URL = '/my-classes/6a211fc2323c00dc93059365?batchId=6a3f6610775a9d8f5817d6e9';

test.describe('Access gating by enrollment status', () => {
  test('active enrollment unlocks course content', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn(LEARNER_A.email, LEARNER_A.password);

    await page.goto(ENROLLMENT_URL);
    await expect(page.getByRole('button', { name: /Play video/ })).toBeVisible();
    await expect(page.getByText(/LSN-1/)).toBeVisible();
  });

  test('non-active enrollment blocks content with clear message', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.goto();
    await auth.signIn('cixote3489@hopefunder.com', 'cixote3489@hopefunder.com');

    await page.goto(ENROLLMENT_URL);
    await expect(page.getByText(/Content not available/)).toBeVisible();
  });
});
