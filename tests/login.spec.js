import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  // ===========================
  // Login With Email
  // ===========================
  test('Login Successfully With Email', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('admin@gmail.com');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('/api/auth/login') &&
          response.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /login/i }).click(),
    ]);

    expect(loginResponse.status()).toBe(200);

    const body = await loginResponse.json();

    console.log(JSON.stringify(body, null, 2));

    expect(body.success).toBe(true);
    expect(body.message).toBe('Login successful');

    expect(body.data.token).toBeTruthy();
    expect(body.data.user.email).toBe('admin@gmail.com');
    expect(body.data.user.role).toBe('admin');

    await expect(page).toHaveURL(/admin/);

    await expect(
      page.getByRole('heading', { name: /Admin Dashboard/i })
    ).toBeVisible();
  });

  // ===========================
  // Login With Mobile
  // ===========================
  test('Login Successfully With Mobile Number', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('6353897826');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('/api/auth/login') &&
          response.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /login/i }).click(),
    ]);

    expect(loginResponse.status()).toBe(200);

    const body = await loginResponse.json();

    expect(body.success).toBe(true);
    expect(body.data.token).toBeTruthy();
    expect(body.data.user.phone).toBe('6353897826');

    await expect(page).toHaveURL(/admin/);
  });

  // ===========================
  // Empty Email / Phone
  // ===========================
  test('Validation - Empty Email or Phone', async ({ page }) => {
    await page.getByLabel(/Password/i).fill('Admin@1234');

    await page.getByRole('button', { name: /login/i }).click();

    await expect(
      page.getByText(/email or phone number is required/i)
    ).toBeVisible();
  });

  // ===========================
  // Empty Password
  // ===========================
  test('Validation - Empty Password', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('admin@gmail.com');

    await page.getByRole('button', { name: /login/i }).click();

    await expect(
      page.getByText(/password is required/i)
    ).toBeVisible();
  });

  // ===========================
  // Invalid Email
  // ===========================
  test('Validation - Invalid Email Format', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('admin@');

    await page.getByLabel(/Password/i).fill('Admin@1234');

    await page.getByRole('button', { name: /login/i }).click();

    await expect(
      page.getByText(/enter a valid email address or phone number/i)
    ).toBeVisible();
  });

  // ===========================
  // Invalid Mobile
  // ===========================
  test('Validation - Invalid Mobile Number', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('12345');

    await page.getByLabel(/Password/i).fill('Admin@1234');

    await page.getByRole('button', { name: /login/i }).click();

    await expect(
      page.getByText(/enter a valid email address or phone number/i)
    ).toBeVisible();
  });

  // ===========================
  // Wrong Password
  // ===========================
  test('Validation - Wrong Password', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('admin@gmail.com');

    await page.getByLabel(/Password/i).fill('WrongPassword');

    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('/api/auth/login') &&
          response.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /login/i }).click(),
    ]);

    expect(loginResponse.status()).toBe(401);

    const body = await loginResponse.json();

    expect(body.success).toBe(false);

    await expect(
      page.getByText(/Invalid password/i)
    ).toBeVisible();
  });

  // ===========================
  // Email Not Found
  // ===========================
  test('Validation - Email Not Registered', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('unknown@gmail.com');

    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('/api/auth/login') &&
          response.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /login/i }).click(),
    ]);

    expect(loginResponse.status()).toBe(401);

    const body = await loginResponse.json();

    expect(body.success).toBe(false);
  });

  // ===========================
  // Mobile Not Registered
  // ===========================
  test('Validation - Mobile Number Not Registered', async ({ page }) => {
    await page.getByLabel(/Email or Phone Number/i).fill('9999999999');

    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('/api/auth/login') &&
          response.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /login/i }).click(),
    ]);

    expect(loginResponse.status()).toBe(401);

    const body = await loginResponse.json();

    expect(body.success).toBe(false);
  });

});