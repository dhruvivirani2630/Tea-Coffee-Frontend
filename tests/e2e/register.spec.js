import { test, expect } from "@playwright/test";
import { setupAuthApiMock } from "./support/authApi";

test("User can register successfully", async ({ page }) => {
  const api = await setupAuthApiMock(page);
  const uniqueSuffix = Date.now();
  const fullName = `John Doe ${uniqueSuffix}`;
  const email = `john${uniqueSuffix}@test.com`;
  const employeeId = `${uniqueSuffix}`.slice(-5).padStart(5, "0");

  await page.goto("/signup");
  await page.getByLabel("Full Name").fill(fullName);
  await page.getByLabel("Employee ID").fill(employeeId);
  await page.locator('input[name="email"]').fill(email);
  await page.getByLabel("Password").fill("Test@123");

  await Promise.all([
    page.waitForURL(/\/dashboard\/?$/),
    page.getByRole("button", { name: "Create account" }).click(),
  ]);
  await expect(page).toHaveURL(/\/dashboard\/?$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText(`Welcome back, ${fullName}.`)).toBeVisible();
  await expect(api.findUserByEmail(email)).toMatchObject({
    fullName,
    employeeId,
    email,
    role: "User",
    status: "Active",
  });
});
