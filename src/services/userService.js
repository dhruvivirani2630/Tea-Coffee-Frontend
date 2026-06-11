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

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 250));

export const userService = {
  async getProfile() {
    await axiosClient.get("/profile");
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const user = getUsersFromStorage().find((item) => item.id === userId);
    if (!user) throw { message: "Profile not found." };
    return delay(sanitizeUser(user));
  },

  async updateProfile(profile) {
    await axiosClient.put("/profile", profile);
    const users = getUsersFromStorage();
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const errors = validateProfileFields(profile, users, userId);
    if (Object.keys(errors).length) throw { message: "Please fix the highlighted fields.", errors };

    const updated = users.map((user) =>
      user.id === userId
        ? withUpdatedDate({
            ...user,
            fullName: profile.fullName.trim(),
            employeeId: profile.employeeId.trim(),
            email: profile.email.trim().toLowerCase(),
            phone: profile.phone.trim(),
          })
        : user,
    );
    saveUsersToStorage(updated);
    return delay(sanitizeUser(updated.find((user) => user.id === userId)));
  },

  async getUsers({ search = "", role = "All", status = "All" } = {}) {
    await axiosClient.get("/users");
    const term = search.trim().toLowerCase();
    const users = getUsersFromStorage()
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
    return delay(users);
  },

  async getUserById(id) {
    await axiosClient.get(`/users/${id}`);
    const user = getUsersFromStorage().find((item) => item.id === id);
    if (!user) throw { message: "User not found." };
    return delay(sanitizeUser(user));
  },

  async updateUser(id, updates) {
    await axiosClient.put(`/users/${id}`, updates);
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
        email: updates.email.trim().toLowerCase(),
        phone: updates.phone.trim(),
        role,
        status: updates.status || user.status,
      });
    });
    saveUsersToStorage(updatedUsers);
    return delay(sanitizeUser(updatedUsers.find((user) => user.id === id)));
  },

  async deleteUser(id) {
    await axiosClient.delete(`/users/${id}`);
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
