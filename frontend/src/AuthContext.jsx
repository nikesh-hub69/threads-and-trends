// src/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import authApi from "./authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const setTokens = ({ access, refresh }) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  };

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // Normalize user object so frontend always has expected fields
  const normalizeUser = (u) => {
    if (!u) return null;
    return {
      ...u,
      is_staff: !!u.is_staff,
      is_superuser: !!u.is_superuser,
      points_balance: Number(u.points_balance ?? 0),
    };
  };

  const fetchMe = async () => {
    const res = await authApi.get("/api/auth/me/");
    const normalized = normalizeUser(res.data);
    setUser(normalized);
    return normalized;
  };

  // ✅ FIXED: login tries {email,password} first, then falls back to {username,password}
  const login = async ({ email, password }) => {
    const input = (email || "").trim();

    try {
      const res = await authApi.post("/api/auth/login/", { email: input, password });
      setTokens(res.data);
      await fetchMe();
      return res.data;
    } catch (e1) {
      const s = e1?.response?.status;
      if (s === 400 || s === 401) {
        const res = await authApi.post("/api/auth/login/", { username: input, password });
        setTokens(res.data);
        await fetchMe();
        return res.data;
      }
      throw e1;
    }
  };

  // ✅ FIXED: Google login — sets tokens manually then fetches user immediately
  const googleLogin = async (idToken) => {
    try {
      const res = await authApi.post("/api/auth/google/", { credential: idToken });
      const { access, refresh } = res.data;
      // Set tokens directly in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      // Fetch user IMMEDIATELY — this calls setUser() which re-renders navbar
      const userData = await fetchMe();
      return userData;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  // On refresh: if token exists, load user
  useEffect(() => {
    (async () => {
      try {
        const access = localStorage.getItem("access_token");
        if (access) {
          await fetchMe();
        } else {
          setUser(null);
        }
      } catch (e) {
        clearTokens();
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = !!user?.is_staff || !!user?.is_superuser;

  const value = useMemo(
    () => ({
      user,
      setUser,
      loadingAuth,
      isLoggedIn,
      isAdmin,
      login,
      googleLogin,
      logout,
      fetchMe,
    }),
    [user, loadingAuth, isLoggedIn, isAdmin] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}