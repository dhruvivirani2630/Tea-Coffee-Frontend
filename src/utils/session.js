import { STORAGE_KEYS } from "../constants/storageKeys";

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
};

export const redirectToLogin = () => {
  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign("/login");
  }
};
