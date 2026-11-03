import { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerTab: Locator;
  readonly googleSignIn: Locator;
  readonly forgotPassword: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: /ইমেইল/ });
    this.passwordInput = page.getByRole('textbox', { name: /পাসওয়ার্ড/ });
    this.signInButton = page.getByRole('button', { name: /লগইন করুন/ });
    this.registerTab = page.getByRole('button', { name: /রেজিস্টার/ });
    this.googleSignIn = page.getByRole('button', { name: /Google/ });
    this.forgotPassword = page.getByRole('button', { name: /ভুলে গেছেন/ });
  }

  async goto() {
    await this.page.goto('/auth');
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async assertSignedIn() {
    await expect(this.page).toHaveURL(/my-classes/);
  }

  async assertSignedOut() {
    await expect(this.page.getByRole('textbox', { name: /ইমেইল/ })).toBeVisible();
  }
}

export class CheckoutPage {
  readonly page: Page;
  readonly sslCommerzRadio: Locator;
  readonly termsCheckbox: Locator;
  readonly completeEnrollmentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sslCommerzRadio = page.getByRole('radio', { name: /SSLCommerz/ });
    this.termsCheckbox = page.getByRole('checkbox', { name: /Terms and Conditions/ });
    this.completeEnrollmentButton = page.getByRole('button', { name: /Complete Enrollment/ });
  }

  async selectSslCommerz() {
    await this.sslCommerzRadio.click();
  }

  async checkTerms() {
    await this.termsCheckbox.click();
  }

  async completeEnrollment() {
    await this.completeEnrollmentButton.click();
  }
}

export class CoursePlayerPage {
  readonly page: Page;
  readonly playButton: Locator;
  readonly contentNotAvailable: Locator;
  readonly progressText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.playButton = page.getByRole('button', { name: /Play video/ });
    this.contentNotAvailable = page.getByText(/Content not available/);
    this.progressText = page.getByText(/\d+%/);
  }
}
