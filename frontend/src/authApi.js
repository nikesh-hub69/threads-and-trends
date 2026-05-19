import axios from "axios";

export const API_BASE = "";

const authApi = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

const getAccess = () => localStorage.getItem("access_token");
const getRefresh = () => localStorage.getItem("refresh_token");
const setAccess = (token) => {
  localStorage.setItem("access_token", token);
  window.dispatchEvent(new Event('auth:token-updated'));
};
const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.dispatchEvent(new Event('auth:token-cleared'));
};

authApi.interceptors.request.use(
  (config) => {
    const access = getAccess();
    if (access) config.headers.Authorization = `Bearer ${access}`;
    return config;
  },
  (error) => Promise.reject(error)
);

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
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    const refresh = getRefresh();
    if (!refresh) {
      clearTokens();
      return Promise.reject(error);
    }
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
    originalRequest._retry = true;
    isRefreshing = true;
    try {
      const refreshRes = await axios.post(
        `/api/auth/token/refresh/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } }
      );
      const newAccess = refreshRes.data?.access;
      if (!newAccess) throw new Error("No access token returned from refresh.");
      setAccess(newAccess);
      processQueue(null, newAccess);
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return authApi(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearTokens();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default authApi;