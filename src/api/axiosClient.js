import axios from "axios";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { parseToken } from "../utils/mockDb";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const mockAdapter = async (config) => ({
  data: { ok: true },
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

const axiosClient = axios.create({
  baseURL,
  timeout: 8000,
  ...(useMockApi ? { adapter: mockAdapter } : {}),
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    const payload = parseToken(token);
    if (!payload) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      return Promise.reject(new Error("Session expired. Please login again."));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default axiosClient;
