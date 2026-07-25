import { test, expect } from '@playwright/test';

test.describe('Signup Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
  });

  // ===========================================
  // Register Successfully With Email
  // ===========================================
  test('Register Successfully With Email', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1001');
    await page.getByLabel(/^Email$/i).fill('john1001@gmail.com');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [response] = await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/api/auth/register') &&
        res.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /create account/i }).click()
    ]);

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.success).toBe(true);

    await expect(page).toHaveURL(/login/i);
  });

  // ===========================================
  // Register Successfully With Phone
  // ===========================================
  test('Register Successfully With Phone', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1002');
    await page.getByLabel(/Phone Number/i).fill('9876543210');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [response] = await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/api/auth/register') &&
        res.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /create account/i }).click()
    ]);

    expect(response.status()).toBe(201);
  });

  // ===========================================
  // Register With Email & Phone
  // ===========================================
  test('Register Successfully With Email And Phone', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1003');
    await page.getByLabel(/^Email$/i).fill('john1003@gmail.com');
    await page.getByLabel(/Phone Number/i).fill('9876543211');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [response] = await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/api/auth/register') &&
        res.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /create account/i }).click()
    ]);

    expect(response.status()).toBe(201);
  });

  // ===========================================
  // Empty Full Name
  // ===========================================
  test('Validation - Full Name Required', async ({ page }) => {

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByText(/full name.*required/i)
    ).toBeVisible();
  });

  // ===========================================
  // Empty Employee ID
  // ===========================================
  test('Validation - Employee ID Required', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByText(/employee id.*required/i)
    ).toBeVisible();
  });

  // ===========================================
  // Empty Email & Phone
  // ===========================================
  test('Validation - Email Or Phone Required', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1004');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByText(/email.*or.*phone/i)
    ).toBeVisible();
  });

  // ===========================================
  // Invalid Email
  // ===========================================
  test('Validation - Invalid Email', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1005');
    await page.getByLabel(/^Email$/i).fill('john@');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByText(/enter a valid email/i)
    ).toBeVisible();
  });

  // ===========================================
  // Invalid Phone
  // ===========================================
  test('Validation - Invalid Phone Number', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1006');
    await page.getByLabel(/Phone Number/i).fill('12345');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByText(/invalid phone/i)
    ).toBeVisible();
  });

  // ===========================================
  // Weak Password
  // ===========================================
  test('Validation - Weak Password', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1007');
    await page.getByLabel(/^Email$/i).fill('john1007@gmail.com');
    await page.getByLabel(/Password/i).fill('12345');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByText(/password/i)
    ).toBeVisible();
  });

  // ===========================================
  // Duplicate Email
  // ===========================================
  test('Validation - Email Already Exists', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP1008');
    await page.getByLabel(/^Email$/i).fill('admin@gmail.com');
    await page.getByLabel(/Password/i).fill('Admin@1234');

    const [response] = await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/api/auth/register') &&
        res.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /create account/i }).click()
    ]);

    expect(response.status()).toBe(409);

    await expect(
      page.getByText(/email.*already/i)
    ).toBeVisible();
  });

  // ===========================================
  // Duplicate Employee ID
  // ===========================================
  test('Validation - Employee ID Already Exists', async ({ page }) => {

    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Employee ID/i).fill('EMP001');
    await page.getByLabel(/^Email$/i).fill('newuser@gmail.com');
    await page.getByLabel(/Password/i).fill('New@1234');

    const [response] = await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/api/auth/register') &&
        res.request().method() === 'POST'
      ),
      page.getByRole('button', { name: /create account/i }).click()
    ]);

    expect(response.status()).toBe(409);
  });

});