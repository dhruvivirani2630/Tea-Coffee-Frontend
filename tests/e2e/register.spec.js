import { test, expect } from "@playwright/test";

test("User can register successfully", async ({ page }) => {
  const uniqueSuffix = Date.now();
  const fullName = `John Doe ${uniqueSuffix}`;
  const email = `john${uniqueSuffix}@test.com`;
  const employeeId = `${uniqueSuffix}`.slice(-5).padStart(5, "0");

  await page.route("**/auth/register", async (route) => {
    const body = route.request().postDataJSON();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          token: "mock-token",
          user: {
            id: "user-999",
            fullName: body.name,
            employeeId: body.employeeId,
            email: body.email,
            role: "User",
            status: "Active",
            createdDate: new Date().toISOString(),
          },
        },
      }),
    });
  });

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
});
