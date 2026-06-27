export const ROLES = {
  ADMIN: "Admin",
  USER: "User",
};

export const STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const normalizeRole = (role) => {
  const value = String(role || "").trim().toLowerCase();
  if (value === "admin") return ROLES.ADMIN;
  if (value === "user") return ROLES.USER;
  return Object.values(ROLES).includes(role) ? role : ROLES.USER;
};

export const isAdminRole = (role) => normalizeRole(role) === ROLES.ADMIN;
