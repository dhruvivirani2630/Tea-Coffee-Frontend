import { ROLES, STATUS } from "../constants/roles";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { nowIso } from "./date";

const seedDate = "2026-06-11T00:00:00.000Z";

const adminUser = {
  id: "admin-001",
  fullName: "System Administrator",
  employeeId: "ADM001",
  email: "admin@company.com",
  phone: "9876543210",
  role: ROLES.ADMIN,
  status: STATUS.ACTIVE,
  createdDate: seedDate,
  updatedDate: seedDate,
  password: "Admin@123",
};

const initialUsers = [
  adminUser,
  {
    id: "user-001",
    fullName: "Demo User",
    employeeId: "EMP001",
    email: "user@company.com",
    phone: "9876501234",
    role: ROLES.USER,
    status: STATUS.ACTIVE,
    createdDate: seedDate,
    updatedDate: seedDate,
    password: "User@1234",
  },
];

export const seedUsers = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
};

export const getUsersFromStorage = () => {
  seedUsers();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
};

export const saveUsersToStorage = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const createToken = (user) => {
  const payload = {
    userId: user.id,
    role: user.role,
    exp: Date.now() + 60 * 60 * 1000,
  };
  return btoa(JSON.stringify(payload));
};

export const parseToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
};

export const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  void password;
  return rest;
};

export const withUpdatedDate = (user) => ({
  ...user,
  updatedDate: nowIso(),
});
