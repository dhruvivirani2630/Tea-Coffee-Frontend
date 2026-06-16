import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Profile E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button:has-text("Login")');
    await page.waitForURL(`${BASE_URL}/dashboard`);
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.click('a:has-text("Profile")');
    await page.waitForURL(`${BASE_URL}/profile`);
    expect(page.url()).toContain('/profile');
  });

  test('should display current user profile information', async ({ page }) => {
    await page.click('a:has-text("Profile")');
    
    // Wait for profile data to load
    await page.waitForSelector('text=Test User');
    expect(await page.locator('text=Test User')).toBeVisible();
    expect(await page.locator('text=test@example.com')).toBeVisible();
  });

  test('should edit profile successfully', async ({ page }) => {
    await page.click('a:has-text("Edit Profile")');
    await page.waitForURL(`${BASE_URL}/edit-profile`);

    // Clear and update name
    const nameField = page.locator('input[name="fullName"]');
    await nameField.clear();
    await nameField.fill('Updated Name');

    // Update phone
    const phoneField = page.locator('input[name="phone"]');
    await phoneField.clear();
    await phoneField.fill('9876543210');

    // Submit form
    await page.click('button:has-text("Save changes")');

    // Wait for success message
    const successMessage = await page.waitForSelector('.alert.success');
    expect(successMessage).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.click('a:has-text("Edit Profile")');
    await page.waitForURL(`${BASE_URL}/edit-profile`);

    const emailField = page.locator('input[name="email"]');
    await emailField.clear();
    await emailField.fill('invalid-email');

    await page.click('button:has-text("Save changes")');

    const errorMessage = await page.locator('text=/valid email/i');
    expect(errorMessage).toBeVisible();
  });

  test('should upload profile image', async ({ page }) => {
    await page.click('a:has-text("Edit Profile")');
    await page.waitForURL(`${BASE_URL}/edit-profile`);

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles('./tests/fixtures/test-image.jpg');
    }

    await page.click('button:has-text("Save changes")');

    const successMessage = await page.waitForSelector('.alert.success');
    expect(successMessage).toBeVisible();
  });

  test('should not allow changing email to existing email', async ({ page }) => {
    await page.click('a:has-text("Edit Profile")');
    await page.waitForURL(`${BASE_URL}/edit-profile`);

    const emailField = page.locator('input[name="email"]');
    await emailField.clear();
    await emailField.fill('admin@example.com');

    await page.click('button:has-text("Save changes")');

    const errorMessage = await page.locator('text=/email.*exists|already.*used/i');
    expect(errorMessage).toBeVisible();
  });
});
