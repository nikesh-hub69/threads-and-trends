// src/authApi.js
import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000";

const authApi = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// --------------------
// Helpers
// --------------------
const getAccess = () => localStorage.getItem("access_token");
const getRefresh = () => localStorage.getItem("refresh_token");

const setAccess = (token) => {
  localStorage.setItem("access_token", token);
  // ✅ FIX: Dispatch event when token is updated
  window.dispatchEvent(new Event('auth:token-updated'));
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // ✅ FIX: Dispatch event when tokens are cleared
  window.dispatchEvent(new Event('auth:token-cleared'));
};

// --------------------
// Request interceptor: attach access token
// --------------------
authApi.interceptors.request.use(
  (config) => {
    const access = getAccess();
    if (access) config.headers.Authorization = `Bearer ${access}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------
// Response interceptor: refresh on 401 and retry once
// --------------------
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, newAccessToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newAccessToken);
  });
  pendingQueue = [];
};

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401 -> just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefresh();
    if (!refresh) {
      clearTokens();
      return Promise.reject(error);
    }

    // If refresh already happening, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(authApi(originalRequest));
          },
          reject,
        });
      });
    }

    // Start refresh flow
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // IMPORTANT: use plain axios here to avoid recursion
      const refreshRes = await axios.post(
        `${API_BASE}/api/auth/token/refresh/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccess = refreshRes.data?.access;
      if (!newAccess) throw new Error("No access token returned from refresh.");

      setAccess(newAccess); // ✅ This now dispatches the event
      processQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return authApi(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearTokens(); // ✅ This now dispatches the event
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default authApi;