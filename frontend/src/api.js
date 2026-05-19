import axios from "axios";

export const API_BASE = "";

const api = axios.create({
  baseURL: `/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `/api/auth/token/refresh/`,
            { refresh: refreshToken }
          );
          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);
          window.dispatchEvent(new Event("auth:token-updated"));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.dispatchEvent(new Event("auth:token-cleared"));
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return path;
}

export default api;