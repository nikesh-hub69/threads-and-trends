// src/adminApi.js
import axios from "axios";
import { API_BASE } from "./authApi";

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ✅ ADMIN token helpers (separate from user tokens)
export const getAdminAccess = () => localStorage.getItem("admin_access_token");
export const getAdminRefresh = () => localStorage.getItem("admin_refresh_token");

export const setAdminTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem("admin_access_token", access);
  if (refresh) localStorage.setItem("admin_refresh_token", refresh);
};

export const clearAdminTokens = () => {
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
};

// Attach admin access token
adminApi.interceptors.request.use(
  (config) => {
    const access = getAdminAccess();
    if (access) config.headers.Authorization = `Bearer ${access}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh flow
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, newAccessToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newAccessToken);
  });
  pendingQueue = [];
};

adminApi.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) return Promise.reject(error);
    if (originalRequest._retry) return Promise.reject(error);

    const refresh = getAdminRefresh();
    if (!refresh) {
      clearAdminTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(adminApi(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/token/refresh/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccess = res.data?.access;
      if (!newAccess) throw new Error("No access token returned from refresh");

      setAdminTokens({ access: newAccess });
      processQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return adminApi(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clearAdminTokens();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default adminApi;