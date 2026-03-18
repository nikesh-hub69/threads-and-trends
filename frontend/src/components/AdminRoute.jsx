// src/components/AdminRoute.jsx  (recommended location)
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../AdminAuthContext";

export default function AdminRoute() {
  const location = useLocation();
  const { loadingAdminAuth, adminIsLoggedIn, adminIsAdmin } = useAdminAuth();

  if (loadingAdminAuth) return null;

  if (!adminIsLoggedIn) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  if (!adminIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
