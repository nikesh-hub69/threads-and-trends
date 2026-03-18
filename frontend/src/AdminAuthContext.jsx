// src/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import adminApi, { clearAdminTokens, setAdminTokens } from "./adminApi";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loadingAdminAuth, setLoadingAdminAuth] = useState(true);

  const normalizeUser = (u) => {
    if (!u) return null;
    return {
      ...u,
      is_staff: !!u.is_staff,
      is_superuser: !!u.is_superuser,
    };
  };

  const fetchAdminMe = async () => {
    const res = await adminApi.get("/api/auth/me/");
    const normalized = normalizeUser(res.data);
    setAdminUser(normalized);
    return normalized;
  };

  const adminLogin = async ({ email, password }) => {
  // ✅ send BOTH fields so backend accepts either email-login or username-login
  const payload = {
    email: email,
    username: email, // fallback if backend expects username
    password,
  };

  const res = await adminApi.post("/api/auth/login/", payload);

  // store tokens in admin_* keys (NOT user keys)
  setAdminTokens(res.data);

  // fetch user and enforce staff/superuser
  const me = await fetchAdminMe();
  const ok = !!me?.is_staff || !!me?.is_superuser;

  if (!ok) {
    clearAdminTokens();
    setAdminUser(null);
    throw new Error("NOT_ADMIN");
  }

  return res.data;
};
  const adminLogout = () => {
    clearAdminTokens();
    setAdminUser(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const access = localStorage.getItem("admin_access_token");
        if (access) await fetchAdminMe();
      } catch (e) {
        clearAdminTokens();
        setAdminUser(null);
      } finally {
        setLoadingAdminAuth(false);
      }
    })();
  }, []);

  const adminIsLoggedIn = !!adminUser;
  const adminIsAdmin = !!adminUser?.is_staff || !!adminUser?.is_superuser;

  const value = useMemo(
    () => ({
      adminUser,
      setAdminUser,
      loadingAdminAuth,
      adminIsLoggedIn,
      adminIsAdmin,
      adminLogin,
      adminLogout,
      fetchAdminMe,
    }),
    [adminUser, loadingAdminAuth, adminIsLoggedIn, adminIsAdmin]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
}