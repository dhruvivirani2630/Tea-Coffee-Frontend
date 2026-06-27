import { test, expect } from '@playwright/test';

test('open localhost', async ({ page }) => {
  // Adjust port if your dev server uses a different port
  await page.goto('http://localhost:5173');
  await page.waitForSelector('body');
  await expect(page).toHaveURL(/localhost/);
});
