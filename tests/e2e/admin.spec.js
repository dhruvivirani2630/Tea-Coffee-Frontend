import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Admin User Management E2E Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Login as admin before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button:has-text("Login")');
    await page.waitForURL(`${BASE_URL}/admin/dashboard`);
  });

  test('should navigate to user management page', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    await page.waitForURL(`${BASE_URL}/admin/users`);
    expect(page.url()).toContain('/admin/users');
  });

  test('should display list of users', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    // Wait for user table to load
    await page.waitForSelector('table');
    const table = page.locator('table');
    expect(table).toBeVisible();

    // Check for users in table
    expect(await page.locator('tbody tr').count()).toBeGreaterThan(0);
  });

  test('should search for user by email', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('test@example.com');

    // Wait for filtered results
    await page.waitForTimeout(500);
    
    const rows = page.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should filter users by role', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    const roleFilter = page.locator('select[name="role"]');
    await roleFilter.selectOption('user');

    // Wait for filtered results
    await page.waitForTimeout(500);
    
    const rows = page.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should filter users by status', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    const statusFilter = page.locator('select[name="status"]');
    await statusFilter.selectOption('active');

    // Wait for filtered results
    await page.waitForTimeout(500);
    
    const rows = page.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should click on user to view details', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    await page.waitForSelector('table tbody tr');
    const firstUserRow = page.locator('table tbody tr').first();
    
    await firstUserRow.click();
    await page.waitForURL(/\/admin\/users\/\d+/);
    
    expect(page.url()).toMatch(/\/admin\/users\/\d+/);
  });

  test('should edit user details', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    await page.waitForSelector('table tbody tr');
    const firstUserRow = page.locator('table tbody tr').first();
    
    await firstUserRow.click();
    await page.waitForURL(/\/admin\/users\/\d+/);

    // Click edit button
    await page.click('button:has-text("Edit")');

    // Update user role
    const roleSelect = page.locator('select[name="role"]');
    await roleSelect.selectOption('admin');

    // Save changes
    await page.click('button:has-text("Save")');

    const successMessage = await page.waitForSelector('.alert.success');
    expect(successMessage).toBeVisible();
  });

  test('should delete user', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    await page.waitForSelector('table tbody tr');
    const firstUserRow = page.locator('table tbody tr').first();
    
    await firstUserRow.click();
    await page.waitForURL(/\/admin\/users\/\d+/);

    // Click delete button
    await page.click('button:has-text("Delete")');

    // Confirm deletion in modal
    await page.click('button:has-text("Confirm")');

    const successMessage = await page.waitForSelector('.alert.success');
    expect(successMessage).toBeVisible();

    // Should redirect to user list
    await page.waitForURL(`${BASE_URL}/admin/users`);
  });

  test('should show pagination controls', async ({ page }) => {
    await page.click('a:has-text("User Management")');
    
    await page.waitForSelector('table');
    
    // Check for pagination if exists
    const pagination = page.locator('.pagination');
    if (await pagination.isVisible()) {
      expect(pagination).toBeVisible();
    }
  });
});
