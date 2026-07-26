import { test, expect } from '@playwright/test';

/**
 * Requires real seeded test accounts on whatever backend this runs against,
 * set via env vars, none exist in this sandbox. Set:
 *   E2E_STAFF_EMAIL, E2E_STAFF_PASSWORD           (account without MFA)
 *   E2E_MFA_EMAIL, E2E_MFA_PASSWORD, E2E_MFA_SEED (account with MFA enabled,
 *                                                   seed for generating a
 *                                                   valid TOTP code in test setup)
 */

test.describe('Login', () => {
  test('shows the same generic failure message for a wrong password as for an unknown email (FR-AUTH-01)', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('definitely-not-a-real-account@example.com');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    const unknownEmailError = await page.getByRole('alert').textContent();

    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.E2E_STAFF_EMAIL ?? 'staff@example.com');
    await page.getByLabel('Password').fill('definitely-wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    const wrongPasswordError = await page.getByRole('alert').textContent();

    // The whole point of FR-AUTH-01: these must be identical, never reveal
    // whether the email exists.
    expect(unknownEmailError).toBe(wrongPasswordError);
  });

  test('never shows a raw HTTP status code on a failed login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('nobody@example.com');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: /sign in/i }).click();

    const errorText = await page.getByRole('alert').textContent();
    expect(errorText).not.toMatch(/\b[45]\d{2}\b/); // no 4xx/5xx anywhere in the message
  });

  test('routes to /login/mfa when the account has MFA enabled, and /login/mfa is unreachable directly', async ({
    page,
  }) => {
    // Confirms the "unreachable without a pending mfaToken" rule from
    // TAD §11.7 / AuthProvider's pendingMfaToken state.
    await page.goto('/login/mfa');
    await expect(page).toHaveURL(/\/login$/);

    test.skip(!process.env.E2E_MFA_EMAIL, 'Set E2E_MFA_EMAIL/E2E_MFA_PASSWORD to run the full MFA routing check.');

    await page.getByLabel('Email').fill(process.env.E2E_MFA_EMAIL!);
    await page.getByLabel('Password').fill(process.env.E2E_MFA_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login\/mfa$/);
  });
});
