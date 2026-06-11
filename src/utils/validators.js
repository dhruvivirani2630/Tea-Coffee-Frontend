export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
};

export const validateEmail = (email) => patterns.email.test(String(email).trim());
export const validatePhone = (phone) => patterns.phone.test(String(phone).trim());
export const validatePassword = (password) => patterns.password.test(password);

export const isEmailOrPhone = (value) => validateEmail(value) || validatePhone(value);

export const validateProfileFields = (values, users = [], currentUserId = null) => {
  const errors = {};
  const fullName = values.fullName?.trim();
  const employeeId = values.employeeId?.trim();
  const email = values.email?.trim();
  const phone = values.phone?.trim();

  if (!fullName) errors.fullName = "Full name is required.";
  if (!employeeId) {
    errors.employeeId = "Employee ID is required.";
  } else if (
    users.some(
      (user) =>
        user.employeeId.toLowerCase() === employeeId.toLowerCase() &&
        user.id !== currentUserId,
    )
  ) {
    errors.employeeId = "Employee ID must be unique.";
  }

  if (!email || !validateEmail(email)) errors.email = "Enter a valid email address.";
  if (!phone || !validatePhone(phone)) errors.phone = "Enter a valid 10-digit phone number.";

  return errors;
};

export const validateAuth = (values, users = []) => {
  const errors = validateProfileFields(values, users);
  if (!validatePassword(values.password || "")) {
    errors.password =
      "Password needs 8+ chars with uppercase, lowercase, number, and special character.";
  }
  return errors;
};
