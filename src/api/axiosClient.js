import axios from "axios";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { parseToken } from "../utils/mockDb";
import { clearSession, redirectToLogin } from "../utils/session";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
console.log(`Using API base URL: ${baseURL}`);
const mockAdapter = async (config) => ({
  data: { ok: true },
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

const axiosClient = axios.create({
  baseURL,
  ...(useMockApi ? { adapter: mockAdapter } : {}),
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return config;

  const payload = parseToken(token);
  if (!payload) {
    clearSession();
    redirectToLogin();
    return Promise.reject(new Error("Session expired. Please login again."));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      clearSession();
      redirectToLogin();
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
