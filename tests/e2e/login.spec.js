import { test, expect } from "@playwright/test";
import { setupAuthApiMock } from "./support/authApi";

const fillLoginForm = async (page, identifier, password) => {
  await page.goto("/login");
  await page.getByLabel("Email or Phone Number").fill(identifier);
  await page.getByLabel("Password").fill(password);
};

test("User can login and reach the dashboard", async ({ page }) => {
  await setupAuthApiMock(page);
  const fullName = "Demo User";
  const email = "user@company.com";

  await fillLoginForm(page, email, "User@1234");

  await Promise.all([
    page.waitForURL(/\/dashboard\/?$/),
    page.getByRole("button", { name: "Login" }).click(),
  ]);

  await expect(page).toHaveURL(/\/dashboard\/?$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText(`Welcome back, ${fullName}.`)).toBeVisible();
});

test("Admin can login and reach the admin dashboard", async ({ page }) => {
  await setupAuthApiMock(page);
  const fullName = "Admin";
  const email = "admin@gmail.com";

  await fillLoginForm(page, email, "Admin@123");

  await Promise.all([
    page.waitForURL(/\/admin\/?$/),
    page.getByRole("button", { name: "Login" }).click(),
  ]);

  await expect(page).toHaveURL(/\/admin\/?$/);
  await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
  await expect(page.getByText("Monitor users, roles, and account status.")).toBeVisible();
});
