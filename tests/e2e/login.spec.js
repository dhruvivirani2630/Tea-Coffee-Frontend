import { test, expect } from "@playwright/test";

const fillLoginForm = async (page, identifier, password) => {
  await page.goto("/login");
  await page.getByLabel("Email or Phone Number").fill(identifier);
  await page.getByLabel("Password").fill(password);
};

test("User can login and reach the dashboard", async ({ page }) => {
  const fullName = "Demo User";
  const email = "user@company.com";

  await page.route("**/auth/login", async (route) => {
    const body = route.request().postDataJSON();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          token: "mock-user-token",
          user: {
            id: "user-001",
            fullName,
            employeeId: "EMP001",
            email: body.email || email,
            role: "User",
            status: "Active",
            createdDate: new Date().toISOString(),
          },
        },
      }),
    });
  });

  await fillLoginForm(page, email, "User@1234");
await page.pause();
  await Promise.all([
    page.waitForURL(/\/dashboard\/?$/),
    page.getByRole("button", { name: "Login" }).click(),
  ]);

  await expect(page).toHaveURL(/\/dashboard\/?$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText(`Welcome back, ${fullName}.`)).toBeVisible();
});

test("Admin can login and reach the admin dashboard", async ({ page }) => {
  const fullName = "Admin";
  const email = "admin@gmail.com";

  await page.route("**/auth/login", async (route) => {
    const body = route.request().postDataJSON();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          token: "mock-admin-token",
          user: {
            id: "admin-001",
            fullName,
            employeeId: "ADM001",
            email: body.email || email,
            password: body.password,
            role: "Admin",
            status: "Active",
            createdDate: new Date().toISOString(),
          },
        },
      }),
    });
  });

  await fillLoginForm(page, email, "Admin@12345");

  await Promise.all([
    page.waitForURL(/\/admin\/?$/),
    page.getByRole("button", { name: "Login" }).click(),
  ]);

  await expect(page).toHaveURL(/\/admin\/?$/);
  await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
  await expect(page.getByText("Monitor users, roles, and account status.")).toBeVisible();
});
