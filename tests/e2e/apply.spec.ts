import { test, expect } from '@playwright/test';

/**
 * These specs are authored against the actual labels/selectors built in
 * Phase 3 (ApplicationForm.tsx etc.), not generic placeholders, but they
 * have NOT been executed in this sandbox, there's no network access here
 * to install Playwright's browser binaries or run a live backend. Run
 * `npx playwright install` then `npm run e2e` against a real backend
 * before trusting these as passing.
 */

test.describe('Apply flow', () => {
  test('submit is disabled until POPIA consent is checked', async ({ page }) => {
    await page.goto('/apply');

    const submit = page.getByRole('button', { name: /submit application/i });
    await expect(submit).toBeDisabled();

    await page.getByLabel(/i consent to liko security training/i).check();
    await expect(submit).toBeEnabled();
  });

  test('rejects an invalid SA ID number with an inline message, not a silent failure', async ({ page }) => {
    await page.goto('/apply');

    await page.getByLabel('ID number').fill('123'); // too short, fails validateSaId's length check
    await expect(page.getByText(/13 digits/i)).toBeVisible();
  });

  test('rejects a disallowed file type on the ID document upload', async ({ page }) => {
    await page.goto('/apply');

    const fileInput = page.locator('#idDocument');
    // A .txt file is outside the accepted jpeg/png/pdf set.
    await fileInput.setInputFiles({ name: 'not-an-id.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
    await expect(page.getByText(/JPEG, PNG, or PDF/i)).toBeVisible();
  });

  test('full happy path reaches the success screen with a reference code', async ({ page }) => {
    await page.goto('/apply');

    await page.getByLabel('Full name').fill('Nomvula Khumalo');
    // Real Luhn-valid test ID, same one used in tests/unit/idNumber.test.ts.
    await page.getByLabel('ID number').fill('8001015000086');
    await page.getByLabel('Phone').fill('0821234567');
    await page.getByLabel('Email').fill('nomvula@example.com');
    await page.getByPlaceholder('Street address').fill('123 Main Road');
    await page.getByPlaceholder('City').fill('Mount Frere');
    await page.getByPlaceholder('Province').fill('Eastern Cape');
    await page.getByPlaceholder('Postal code').fill('5090');

    // Selects the first available course/intake on the page rather than a
    // hardcoded name, since course data is live from the backend and not
    // fixed content this spec should assume.
    await page.locator('input[type="checkbox"]').first().check();
    await page.getByLabel(/preferred intake/i).selectOption({ index: 1 });

    await page
      .locator('#idDocument')
      .setInputFiles({ name: 'id.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake-image-bytes') });

    await page.getByLabel(/i consent to liko security training/i).check();
    await page.getByRole('button', { name: /submit application/i }).click();

    await expect(page.getByText(/application received/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/your reference code is/i)).toBeVisible();
  });
});
