import { ROLES, STATUS } from "../../../src/constants/roles";

const initialUsers = [
  {
    id: "admin-001",
    fullName: "Admin",
    employeeId: "00001",
    email: "admin@gmail.com",
    phone: "9876543210",
    password: "Admin@123",
    role: ROLES.ADMIN,
    status: STATUS.ACTIVE,
    createdDate: "2026-06-11T00:00:00.000Z",
    updatedDate: "2026-06-11T00:00:00.000Z",
  },
  {
    id: "user-001",
    fullName: "Demo User",
    employeeId: "00007",
    email: "user@company.com",
    phone: "9876501234",
    password: "User@1234",
    role: ROLES.USER,
    status: STATUS.ACTIVE,
    createdDate: "2026-06-11T00:00:00.000Z",
    updatedDate: "2026-06-11T00:00:00.000Z",
  },
];

const jsonResponse = (route, status, data) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify({ data }),
  });

const normalize = (value) => String(value || "").trim().toLowerCase();

const createToken = (user) =>
  Buffer.from(
    JSON.stringify({
      userId: user.id,
      role: user.role,
      exp: Date.now() + 60 * 60 * 1000,
    }),
  ).toString("base64");

const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

export const setupAuthApiMock = async (page) => {
  const db = initialUsers.map((user) => ({ ...user }));

  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.route(/\/auth\/profile(?:\?.*)?$/, async (route) => {
    await jsonResponse(route, 200, { user: null });
  });

  await page.route(/\/auth\/register(?:\?.*)?$/, async (route) => {
    const body = route.request().postDataJSON();
    const email = normalize(body.email);
    const phone = normalize(body.phone);
    const employeeId = normalize(body.employeeId);
    const fullName = String(body.name || "").trim();

    const duplicate = db.find(
      (user) =>
        normalize(user.email) === email ||
        (phone && normalize(user.phone) === phone) ||
        normalize(user.employeeId) === employeeId,
    );

    if (duplicate) {
      await jsonResponse(route, 400, {
        message: "User already exists.",
        errors: {
          email: normalize(duplicate.email) === email ? "Email must be unique." : undefined,
          phone: phone && normalize(duplicate.phone) === phone ? "Phone number must be unique." : undefined,
          employeeId:
            normalize(duplicate.employeeId) === employeeId ? "Employee ID must be unique." : undefined,
        },
      });
      return;
    }

    const createdUser = {
      id: `user-${String(db.length + 1).padStart(3, "0")}`,
      fullName,
      employeeId: body.employeeId,
      email: body.email,
      phone: body.phone,
      role: ROLES.USER,
      status: STATUS.ACTIVE,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      password: body.password,
    };

    db.push(createdUser);

    await jsonResponse(route, 200, {
      token: createToken(createdUser),
      user: sanitizeUser(createdUser),
    });
  });

  await page.route(/\/auth\/login(?:\?.*)?$/, async (route) => {
    const body = route.request().postDataJSON();
    const identifier = normalize(body.identifier || body.email || body.phone);
    const password = body.password || "";

    const user = db.find(
      (item) =>
        normalize(item.email) === identifier ||
        normalize(item.phone) === identifier ||
        normalize(item.employeeId) === identifier,
    );

    if (!user || user.password !== password) {
      await jsonResponse(route, 401, {
        message: "Invalid credentials.",
        errors: {
          identifier: "The email, phone number, or password is incorrect.",
        },
      });
      return;
    }

    await jsonResponse(route, 200, {
      token: createToken(user),
      user: sanitizeUser(user),
    });
  });

  await page.route(/\/users(?:\?.*)?$/, async (route) => {
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }

    const users = db.map(sanitizeUser);
    await jsonResponse(route, 200, {
      users,
      total: users.length,
      page: 1,
      totalPages: 1,
    });
  });

  return {
    getUsers: () => db.map((user) => ({ ...user })),
    findUserByEmail: (email) => db.find((user) => normalize(user.email) === normalize(email)),
  };
};
