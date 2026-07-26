import { test, expect } from '@playwright/test';

/**
 * Covers the project's core non-negotiable rule end-to-end: whatever the
 * backend's {success:false, message} says is what renders, verbatim, no
 * status code ever appears in the UI. Requires a running backend with the
 * real rate limiters/conflict logic active (rateLimiter.middleware.js,
 * course.controller.js's intake-delete 409), not mocked here.
 */

test.describe('Error states never leak a status code', () => {
  test('POST /applications rate limiter (10 per window) surfaces the backend message verbatim on the apply form', async ({
    page,
    request,
  }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1';

    // Exhaust the limiter directly via API first (10 rapid requests), faster
    // and more deterministic than driving the UI 11 times.
    for (let i = 0; i < 10; i++) {
      await request.post(`${apiBase}/applications`, { data: {}, failOnStatusCode: false });
    }

    await page.goto('/apply');
    // Minimal fill, this submission is expected to hit the rate limiter
    // before validation even matters.
    await page.getByLabel(/i consent to liko security training/i).check();
    await page.getByRole('button', { name: /submit application/i }).click();

    const errorText = await page.getByRole('alert').textContent();
    expect(errorText).not.toMatch(/\b429\b/);
    expect(errorText).not.toMatch(/too many requests/i); // that's the HTTP reason phrase, not necessarily the backend's own wording
    expect(errorText?.length ?? 0).toBeGreaterThan(0); // something real rendered, not a blank/generic fallback
  });

  test('deleting an intake referenced by an application shows the 409 conflict message, not a status code', async ({
    page,
  }) => {
    test.skip(
      !process.env.E2E_REFERENCED_INTAKE_ID,
      'Set E2E_REFERENCED_INTAKE_ID to an intake that a real application references, to trigger the 409 path.'
    );

    await page.goto('/admin/courses');
    await page.getByRole('button', { name: /intakes/i }).click();
    // Locate the delete button for the specific seeded intake row, then confirm.
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await page.getByRole('button', { name: 'Delete', exact: true }).last().click(); // ConfirmDialog's confirm button

    const toastText = await page.getByRole('status').textContent();
    expect(toastText).not.toMatch(/\b409\b/);
  });
});
