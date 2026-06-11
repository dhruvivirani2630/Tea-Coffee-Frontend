import axiosClient from "../api/axiosClient";
import { ROLES, STATUS } from "../constants/roles";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { nowIso } from "../utils/date";
import {
  createToken,
  getUsersFromStorage,
  parseToken,
  sanitizeUser,
  saveUsersToStorage,
} from "../utils/mockDb";
import { isEmailOrPhone, validateAuth } from "../utils/validators";

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 250));

export const authService = {
  async signup(payload) {
    await axiosClient.request({ url: "/auth/signup", method: "POST", data: payload });
    const users = getUsersFromStorage();
    const errors = validateAuth(payload, users);

    if (Object.keys(errors).length) {
      throw { message: "Please fix the highlighted fields.", errors };
    }

    const existingIdentity = users.find(
      (user) =>
        user.email.toLowerCase() === payload.email.trim().toLowerCase() ||
        user.phone === payload.phone.trim(),
    );
    if (existingIdentity) {
      throw { message: "Email or phone number is already registered." };
    }

    const timestamp = nowIso();
    const user = {
      id: crypto.randomUUID(),
      fullName: payload.fullName.trim(),
      employeeId: payload.employeeId.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      role: ROLES.USER,
      status: STATUS.ACTIVE,
      createdDate: timestamp,
      updatedDate: timestamp,
      password: payload.password,
    };

    saveUsersToStorage([...users, user]);
    const token = createToken(user);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    return delay({ token, user: sanitizeUser(user) });
  },

  async login({ identifier, password }) {
    await axiosClient.request({ url: "/auth/login", method: "POST", data: { identifier } });
    if (!isEmailOrPhone(identifier || "")) {
      throw { message: "Enter a valid email address or phone number." };
    }

    const users = getUsersFromStorage();
    const normalized = identifier.trim().toLowerCase();
    const user = users.find(
      (item) =>
        (item.email.toLowerCase() === normalized || item.phone === identifier.trim()) &&
        item.password === password,
    );

    if (!user) throw { message: "Invalid credentials." };
    if (user.status !== STATUS.ACTIVE) throw { message: "Your account is inactive." };

    const token = createToken(user);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    return delay({ token, user: sanitizeUser(user) });
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    return delay({ success: true });
  },

  async getSession() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const payload = token ? parseToken(token) : null;
    if (!payload) return null;

    const user = getUsersFromStorage().find((item) => item.id === payload.userId);
    return user ? delay({ token, user: sanitizeUser(user) }) : null;
  },
};

export default authService;
