import axiosClient from "../api/axiosClient";
import { ROLES, STATUS } from "../constants/roles";
import { STORAGE_KEYS } from "../constants/storageKeys";
import {
  getUsersFromStorage,
  sanitizeUser,
  saveUsersToStorage,
  withUpdatedDate,
} from "../utils/mockDb";
import { validateProfileFields } from "../utils/validators";
import { normalizeUserRecord, sanitizeUserRecord } from "../utils/userModel";

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 250));
const PROFILE_ENDPOINT = "api/auth/profile";
const USERS_ENDPOINT = "api/users";
const UPDATE_PROFILE_ENDPOINT = "api/users/update-profile";

const getResponseUser = (response) => {
  const data = response.data?.data || response.data || {};
  return data.user || data.profile || data;
};

const getApiError = (error, fallback = "Something went wrong.") => {
  const data = error?.response?.data || {};
  return {
    message: data.message || error?.message || fallback,
    errors: data.errors || {},
  };
};

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

const parseUsersResponse = (response, page, limit) => {
  const data = response.data?.data || response.data || {};
  const rawUsers = data.users || data.items || data.results || (Array.isArray(data) ? data : []);
  const users = rawUsers.map(sanitizeUserRecord);
  const total = data.total ?? data.totalCount ?? data.count ?? users.length;
  const currentPage = data.page ?? page;
  const totalPages = data.totalPages ?? Math.max(1, Math.ceil(total / limit));

  return { users, total, page: currentPage, totalPages };
};

const getProfilePayload = (profile) => {
  const payload = {
    name: profile.name?.trim() || "",
    email: profile.email?.trim().toLowerCase() || "",
    phone: profile.phone?.trim() || "",
  };

  if (profile.profileImage instanceof File) {
    console.log("📸 Profile image is a file, preparing FormData",profile);
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
    formData.append("profileImage", profile.profileImage);
    return formData;
  }

  if (profile.profileImage && typeof profile.profileImage === "string") {
    payload.profileImage = profile.profileImage;
  }

  return payload;
};

const getUpdateUserPayload = (updates = {}) => ({
  name: updates.fullName?.trim() || updates.name?.trim() || "",
  fullName: updates.fullName?.trim() || updates.name?.trim() || "",
  employeeId: updates.employeeId?.trim() || "",
  email: updates.email?.trim().toLowerCase() || "",
  phone: updates.phone?.trim() || "",
  status: updates.status,
});

export const userService = {
  async getProfile() {
    console.log("[Users] getProfile started", { endpoint: PROFILE_ENDPOINT });

    try {
      const response = await axiosClient.get(PROFILE_ENDPOINT);
      const profile = getResponseUser(response);
      if (profile?.id || profile?.email || profile?.employeeId) {
        const sanitized = sanitizeUserRecord(profile);
        console.log("[Users] getProfile succeeded", sanitized);
        return sanitized;
      }
    } catch (error) {
      console.log("[Users] getProfile failed", error);
      if (import.meta.env.VITE_USE_MOCK_API === "false") {
        throw getApiError(error, "Unable to load profile.");
      }
    }

    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const user = getUsersFromStorage().find((item) => item.id === userId);
    if (!user) throw { message: "Profile not found." };
    const mockProfile = sanitizeUserRecord(user);
    console.log("[Users] getProfile succeeded (mock)", mockProfile);
    return delay(mockProfile);
  },

  async updateProfile(profile) {
    console.log("🔄 Starting updateProfile with:", profile);
    const allowedProfile = getProfilePayload(profile);
    console.log("📦 Profile payload prepared:", allowedProfile);

    try {
      const response = await axiosClient.put(UPDATE_PROFILE_ENDPOINT, allowedProfile);
      console.log("url:", UPDATE_PROFILE_ENDPOINT, "payload:", allowedProfile);
      console.log("✅ API profile update response received:", response);
      const updatedProfile = getResponseUser(response);
      console.log("👤 Updated profile data:", updatedProfile);
      if (updatedProfile?.id || updatedProfile?.email || updatedProfile?.employeeId) {
        const sanitized = sanitizeUserRecord(updatedProfile);
        console.log("✨ Profile updated successfully (sanitized):", sanitized);
        return sanitized;
      }
    } catch (error) {
      console.error("❌ Error updating profile from API:", error);
      if (import.meta.env.VITE_USE_MOCK_API === "false") {
        throw getApiError(error, "Unable to update profile.");
      }
    }

    console.log("📚 Using mock data for profile update");
    const users = getUsersFromStorage();
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const errors = validateProfileFields({ ...profile, employeeId: profile.employeeId || "self" }, users, userId);
    if (Object.keys(errors).length) {
      console.error("⚠️ Validation errors:", errors);
      throw { message: "Please fix the highlighted fields.", errors };
    }

    const updated = users.map((user) =>
      user.id === userId
        ? withUpdatedDate({
            ...user,
            fullName: profile.fullName.trim(),
            email: profile.email?.trim().toLowerCase() || "",
            phone: profile.phone?.trim() || "",
            profileImage: typeof profile.profileImage === "string" ? profile.profileImage : user.profileImage || "",
          })
        : user,
    );
    saveUsersToStorage(updated);
    const finalProfile = sanitizeUserRecord(updated.find((user) => user.id === userId));
    console.log("💾 Mock profile updated and saved:", finalProfile);
    return delay(finalProfile);
  },

  async getUsers({ page = 1, limit = 6, search = "", role = "All", status = "All" } = {}) {
    const params = { page, limit, search, role, status };
    console.log("[Users] getUsers started", { endpoint: USERS_ENDPOINT, params });

    if (!useMockApi) {
      try {
        const response = await axiosClient.get(USERS_ENDPOINT, { params });
        const result = parseUsersResponse(response, page, limit);
        console.log("[Users] getUsers succeeded", {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          count: result.users.length,
        });
        return result;
      } catch (error) {
        console.log("[Users] getUsers failed", error);
        throw getApiError(error, "Unable to load users.");
      }
    }

    await axiosClient.get(USERS_ENDPOINT);
    const term = search.trim().toLowerCase();
    const filteredUsers = getUsersFromStorage()
      .map(sanitizeUser)
      .filter((user) => {
        const matchesSearch =
          !term ||
          [user.fullName, user.employeeId, user.email, user.phone].some((value) =>
            value.toLowerCase().includes(term),
          );
        const matchesRole = role === "All" || user.role === role;
        const matchesStatus = status === "All" || user.status === status;
        return matchesSearch && matchesRole && matchesStatus;
      });
    const total = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const users = filteredUsers.slice((page - 1) * limit, page * limit);
    const result = { users, total, page, totalPages };
    console.log("[Users] getUsers succeeded (mock)", {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      count: result.users.length,
    });
    return delay(result);
  },

  async getUserById(id) {
    const endpoint = `${USERS_ENDPOINT}/${id}`;
    console.log("[Users] getUserById started", { endpoint, id });

    if (!useMockApi) {
      try {
        const response = await axiosClient.get(endpoint);
        const data = response.data?.data || response.data || {};
        const user = data.user || data;
        if (!user?.id && !user?._id) throw { message: "User not found." };
        const sanitized = sanitizeUserRecord(user);
        console.log("[Users] getUserById succeeded", sanitized);
        return sanitized;
      } catch (error) {
        console.log("[Users] getUserById failed", error);
        throw getApiError(error, "Unable to load user.");
      }
    }

    await axiosClient.get(endpoint);
    const user = getUsersFromStorage().find((item) => item.id === id);
    if (!user) throw { message: "User not found." };
    const mockUser = sanitizeUser(user);
    console.log("[Users] getUserById succeeded (mock)", mockUser);
    return delay(mockUser);
  },

  async updateUser(id, updates) {
    if (!useMockApi) {
      try {
        const response = await axiosClient.put(`${USERS_ENDPOINT}/${id}`, getUpdateUserPayload(updates));
        const data = response.data?.data || response.data || {};
        const user = data.user || data;
        if (!user?.id && !user?._id) throw { message: "User not found." };
        return sanitizeUserRecord(user);
      } catch (error) {
        throw getApiError(error, "Unable to update user.");
      }
    }

    await axiosClient.put(`${USERS_ENDPOINT}/${id}`, updates);
    const users = getUsersFromStorage();
    const target = users.find((user) => user.id === id);
    if (!target) throw { message: "User not found." };

    const errors = validateProfileFields(updates, users, id);
    if (Object.keys(errors).length) throw { message: "Please fix the highlighted fields.", errors };

    const updatedUsers = users.map((user) => {
      if (user.id !== id) return user;
      const role = user.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;
      return withUpdatedDate({
        ...user,
        fullName: updates.fullName.trim(),
        employeeId: updates.employeeId.trim(),
        email: updates.email?.trim().toLowerCase() || "",
        phone: updates.phone?.trim() || "",
        role,
        status: updates.status || user.status,
      });
    });
    saveUsersToStorage(updatedUsers);
    return delay(sanitizeUser(updatedUsers.find((user) => user.id === id)));
  },

  async deleteUser(id) {
    await axiosClient.delete(`${USERS_ENDPOINT}/${id}`);
    const users = getUsersFromStorage();
    const user = users.find((item) => item.id === id);
    if (!user) throw { message: "User not found." };
    if (user.role === ROLES.ADMIN) throw { message: "Admin account cannot be deleted." };
    saveUsersToStorage(users.filter((item) => item.id !== id));
    return delay({ success: true });
  },

  async setUserStatus(id, status) {
    if (![STATUS.ACTIVE, STATUS.INACTIVE].includes(status)) {
      throw { message: "Invalid status." };
    }
    const user = await this.getUserById(id);
    return this.updateUser(id, { ...user, status });
  },
};

export default userService;
