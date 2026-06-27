import axiosClient from "../api/axiosClient";

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

const getLoginPayload = ({ identifier, email, phone, password }) => ({
  ...(email ? { email: email.trim() } : {}),
  ...(phone ? { phone: phone.trim() } : {}),
  ...(identifier ? { identifier: identifier.trim() } : {}),
  password,
});

export const authService = {
  async signup(payload) {
    const registerPayload = getRegisterPayload(payload);
    console.log("[Auth] Register started", getSafeSignupLogPayload(payload));

    try {
      const response = await axiosClient.post("auth/register", registerPayload);
      const data = response.data?.data || response.data || {};
      console.log("[Auth] Register succeeded", data.user);
      return data; // { token, user }
    } catch (error) {
      console.log("[Auth] Register failed", error);
      throw error;
    }
  },

  async login({ identifier, email, phone, password }) {
    const loginPayload = getLoginPayload({ identifier, email, phone, password });
    console.log("[Auth] Login started", { identifier, email, phone });

    try {
      const response = await axiosClient.post("auth/login", loginPayload);
      const data = response.data?.data || response.data || {};
      console.log("[Auth] Login succeeded", data.user);
      return data; // { token, user }
    } catch (error) {
      console.log("[Auth] Login failed", error);
      throw error;
    }
  },

  async logout() {
    try {
      await axiosClient.post("auth/logout");
    } catch (error) {
      console.log("[Auth] Logout request failed", error);
    }
    return { success: true };
  },

  async getSession() {
    try {
      const response = await axiosClient.get("auth/profile");
      const data = response.data?.data || response.data || {};
      return { user: data.user };
    } catch (error) {
      console.log("[Auth] getSession failed", error);
      return null;
    }
  },
};

export default authService;
