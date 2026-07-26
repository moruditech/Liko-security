import { test, expect } from '@playwright/test';

/**
 * Requires a seeded staff account with applications:write but WITHOUT
 * invoices:issue, and a real application in 'under_review' status, plus
 * login helper via storageState. None of this exists in this sandbox,
 * these assertions describe the required behavior precisely so whoever
 * wires up real fixtures has an exact target.
 */

test.describe('Application status transition permission boundary', () => {
  test.skip(
    !process.env.E2E_LIMITED_STAFF_EMAIL || !process.env.E2E_TEST_APPLICATION_ID,
    'Set E2E_LIMITED_STAFF_EMAIL/PASSWORD (applications:write only, no invoices:issue) and E2E_TEST_APPLICATION_ID (an application in under_review status) to run this.'
  );

  test('a staff member with applications:write but not invoices:issue cannot see the payment_verified transition', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.E2E_LIMITED_STAFF_EMAIL!);
    await page.getByLabel('Password').fill(process.env.E2E_LIMITED_STAFF_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.goto(`/admin/applications/${process.env.E2E_TEST_APPLICATION_ID}`);

    // StatusChangeControl's isAllowed() requires BOTH applications:write AND
    // invoices:issue specifically for the payment_verified transition, this
    // button must not render for a applications:write-only session.
    await expect(page.getByRole('button', { name: /move to payment_verified/i })).not.toBeVisible();

    // But the reject transition (applications:write alone) should still be visible.
    await expect(page.getByRole('button', { name: /reject/i })).toBeVisible();
  });

  test('the backend itself rejects the transition even if a client were tampered with (defense in depth)', async ({
    page,
    request,
  }) => {
    // This hits the API directly, bypassing the UI entirely, to confirm the
    // frontend's button-hiding is a convenience, not the actual security
    // boundary, permission.middleware.js on the backend is.
    const response = await request.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1'}/applications/${process.env.E2E_TEST_APPLICATION_ID}/status`,
      {
        data: { status: 'payment_verified' },
        headers: { Authorization: `Bearer ${process.env.E2E_LIMITED_STAFF_TOKEN ?? ''}` },
        failOnStatusCode: false,
      }
    );
    expect(response.status()).toBe(403);
  });
});
