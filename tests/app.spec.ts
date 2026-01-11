import { test, expect } from '@playwright/test';

test.describe('CampRecord App', () => {
    test('should redirect to login page when accessing home without auth', async ({ page }) => {
        // Attempt to go to dashboard
        await page.goto('/');

        // Should be redirected to /login
        await expect(page).toHaveURL(/\/login/);

        // Check for login button
        await expect(page.getByRole('button', { name: 'Googleでログイン' })).toBeVisible();
    });

    test('login page should have correct title', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: 'CampRecord' })).toBeVisible();
        await expect(page.getByText('キャンプの思い出を記録しよう')).toBeVisible();
    });
});
