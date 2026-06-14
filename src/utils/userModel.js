const now = () => new Date().toISOString();

const resolveName = (user = {}) => user.name || user.fullName || "";

export const normalizeUserRecord = (user = {}) => {
  const name = resolveName(user);
  const createdAt = user.createdAt || user.createdDate || now();
  const updatedAt = user.updatedAt || user.updatedDate || createdAt;

  return {
    ...user,
    name,
    fullName: user.fullName || name,
    email: (user.email || "").trim().toLowerCase(),
    phone: (user.phone || "").trim(),
    employeeId: (user.employeeId || "").trim(),
    role: user.role || "User",
    status: user.status || "Active",
    profileImage: user.profileImage || "",
    updatedBy: user.updatedBy || null,
    createdAt,
    createdDate: user.createdDate || createdAt,
    updatedAt,
    updatedDate: user.updatedDate || updatedAt,
  };
};

export const sanitizeUserRecord = (user = {}) => {
  const { password, ...rest } = normalizeUserRecord(user);
  void password;
  return rest;
};

export const buildProfileFormValues = (user = {}) => ({
  id: user.id || "",
  name: user.name || user.fullName || "",
  fullName: user.fullName || user.name || "",
  email: user.email || "",
  phone: user.phone || "",
  employeeId: user.employeeId || "",
  role: user.role || "User",
  status: user.status || "Active",
  profileImage: user.profileImage || "",
  createdAt: user.createdAt || user.createdDate || "",
  updatedAt: user.updatedAt || user.updatedDate || "",
  updatedBy: user.updatedBy || null,
});

export const displayName = (user = {}) => user.name || user.fullName || "Unknown User";

