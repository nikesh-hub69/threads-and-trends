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
    // ✅ FIX: Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth:token-updated'));
  };

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // ✅ FIX: Dispatch event when tokens are cleared
    window.dispatchEvent(new Event('auth:token-cleared'));
  };

  // Normalize user object so frontend always has expected fields
  const normalizeUser = (u) => {
    if (!u) return null;
    return {
      ...u,
      // ✅ Ensure these always exist (even if backend forgets)
      is_staff: !!u.is_staff,
      is_superuser: !!u.is_superuser,
      // points_balance safe
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
    const input = (email || "").trim(); // field might contain email OR username

    // 1) Try email payload first (works if backend accepts email login)
    try {
      const res = await authApi.post("/api/auth/login/", { email: input, password });
      setTokens(res.data);
      await fetchMe();
      return res.data;
    } catch (e1) {
      const status = e1?.response?.status;

      // 2) If backend doesn't accept email field, retry with username payload
      if (status === 400 || status === 401) {
        const res = await authApi.post("/api/auth/login/", { username: input, password });
        setTokens(res.data);
        await fetchMe();
        return res.data;
      }

      // other errors (server down etc.)
      throw e1;
    }
  };

  // ✅ NEW: Google login function
  const googleLogin = async (credential) => {
    try {
      const res = await authApi.post("/api/auth/google/", { credential });
      setTokens(res.data);
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

  // ✅ FIX: Listen for auth events from other components/tabs
  useEffect(() => {
    const handleAuthEvent = async () => {
      try {
        const access = localStorage.getItem("access_token");
        if (access && !user) {
          // Token exists but no user - fetch user data
          await fetchMe();
        }
      } catch (e) {
        console.error("Failed to fetch user on auth event:", e);
        clearTokens();
        setUser(null);
      }
    };

    window.addEventListener('auth:token-updated', handleAuthEvent);
    
    return () => {
      window.removeEventListener('auth:token-updated', handleAuthEvent);
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ✅ Admin helper
  const isAdmin = !!user?.is_staff || !!user?.is_superuser;

  const value = useMemo(
    () => ({
      user,
      setUser,
      loadingAuth,
      isLoggedIn,
      isAdmin,
      login,
      googleLogin, // ✅ NEW: Export googleLogin function
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