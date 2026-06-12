import axiosClient from "../api/axiosClient";
import { STATUS } from "../constants/roles";
import { STORAGE_KEYS } from "../constants/storageKeys";
import {
  createToken,
  getUsersFromStorage,
  parseToken,
  sanitizeUser,
} from "../utils/mockDb";
import { clearSession } from "../utils/session";
import { validateLogin } from "../utils/validators";

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 250));

const getSafeSignupLogPayload = (payload) => ({
  fullName: payload.fullName,
  employeeId: payload.employeeId,
  email: payload.email,
  phone: payload.phone,
});

const getRegisterPayload = (payload) => ({
  name: payload.fullName?.trim(),
  employeeId: payload.employeeId?.trim(),
  email: payload.email?.trim(),
  phone: payload.phone?.trim(),
  password: payload.password,
});

const normalizeRegisteredUser = (user, fallback) => ({
  ...user,
  fullName: user?.fullName || user?.name || fallback.name,
  employeeId: user?.employeeId || fallback.employeeId,
  email: user?.email || fallback.email,
  phone: user?.phone || fallback.phone,
});

export const authService = {
  async signup(payload) {
    const registerPayload = getRegisterPayload(payload);
    console.log("[Auth] Register started", getSafeSignupLogPayload(payload));
    console.log("[Auth] Register API payload", {
      name: registerPayload.name,
      employeeId: registerPayload.employeeId,
      email: registerPayload.email,
      phone: registerPayload.phone,
    });

    try {
      const response = await axiosClient.post("api/auth/register", registerPayload);
      const responseData = response.data?.data || response.data || {};
      const token = responseData.token;
      const user = normalizeRegisteredUser(responseData.user || responseData, registerPayload);

      if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (user.id) localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);

      console.log("[Auth] Register succeeded", user);
      return delay({ token, user });
    } catch (error) {
      console.log("[Auth] Register failed", error);
      throw error;
    }
  },

  async login({ identifier, password }) {
    console.log("[Auth] Login started", { identifier });

    try {
      await axiosClient.request({ url: "/auth/login", method: "POST", data: { identifier } });
      const errors = validateLogin({ identifier, password });
      if (Object.keys(errors).length) {
        throw { message: "Please fix the highlighted fields.", errors };
      }

      const users = getUsersFromStorage();
      const normalized = identifier.trim().toLowerCase();
      const trimmedPhone = identifier.trim();
      const user = users.find(
        (item) =>
          (item.email.toLowerCase() === normalized || item.phone === trimmedPhone) &&
          item.password === password,
      );

      if (!user) throw { message: "Invalid credentials." };
      if (user.status !== STATUS.ACTIVE) throw { message: "Your account is inactive." };

      const token = createToken(user);
      const sanitizedUser = sanitizeUser(user);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
      console.log("[Auth] Login succeeded", sanitizedUser);
      return delay({ token, user: sanitizedUser });
    } catch (error) {
      console.log("[Auth] Login failed", error);
      throw error;
    }
  },

  async logout() {
    await axiosClient.post("/auth/logout").catch(() => undefined);
    clearSession();
    return delay({ success: true });
  },

  async getSession() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const payload = token ? parseToken(token) : null;
    if (!payload) {
      clearSession();
      return null;
    }

    const user = getUsersFromStorage().find((item) => item.id === payload.userId);
    if (!user) {
      clearSession();
      return null;
    }

    return delay({ token, user: sanitizeUser(user) });
  },
};

export default authService;
