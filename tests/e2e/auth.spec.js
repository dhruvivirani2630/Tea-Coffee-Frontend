import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173'; // Vite dev server default

test.describe('Authentication E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button:has-text("Login")');

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);
    expect(page.url()).toContain('/dashboard');
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');

    // Wait for error message
    const errorMessage = await page.waitForSelector('.alert.error');
    expect(errorMessage).toBeVisible();
  });

  test('should display validation error for empty fields', async ({ page }) => {
    await page.click('button:has-text("Login")');

    // Check for validation errors
    const emailError = await page.locator('text=Email is required');
    expect(emailError).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('a:has-text("Sign up")');
    await page.waitForURL(`${BASE_URL}/signup`);
    expect(page.url()).toContain('/signup');
  });

  test('should signup with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    await page.fill('input[name="fullName"]', 'New User');
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.fill('input[name="confirmPassword"]', 'Test@123');
    await page.click('button:has-text("Sign up")');

    // Wait for redirect to dashboard or login
    await page.waitForURL(new RegExp('(dashboard|login)'));
    expect(page.url()).toMatch(/(dashboard|login)/);
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    await page.fill('input[name="fullName"]', 'New User');
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.fill('input[name="confirmPassword"]', 'Different@123');
    await page.click('button:has-text("Sign up")');

    const errorMessage = await page.locator('text=/passwords|match/i');
    expect(errorMessage).toBeVisible();
  });

  test('should logout successfully', async ({ page, context }) => {
    // Login first
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button:has-text("Login")');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL(`${BASE_URL}/login`);
    expect(page.url()).toContain('/login');

    // Verify token is cleared (check localStorage)
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });
});
