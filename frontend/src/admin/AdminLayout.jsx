// src/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../AdminAuthContext";
import { useState } from "react";

// Icon Components
function IconDashboard() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function IconProducts() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

// ✅ Add this new icon component at the top with other icons:
function IconReturns() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
    isActive 
      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30" 
      : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, adminLogout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onLogout = () => {
    adminLogout();
    navigate("/admin-login");
  };

  const navItems = [
  { to: "/admin", label: "Dashboard", icon: <IconDashboard />, end: true },
  { to: "/admin/orders", label: "Orders", icon: <IconOrders />, badge: "12" },
  { to: "/admin/returns", label: "Returns", icon: <IconReturns />, badge: "5" }, // ✅ NEW
  { to: "/admin/products", label: "Products", icon: <IconProducts /> },
  { to: "/admin/users", label: "Users", icon: <IconUsers /> },
];


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Enhanced Topbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-slate-950/50">
        <div className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-all"
            >
              {sidebarOpen ? <IconClose /> : <IconMenu />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <IconShield />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Threads & Trends
                </div>
                <div className="text-xs text-slate-400">Admin Panel</div>
              </div>
            </div>
          </div>

          {/* Right: User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-all group">
              <IconBell />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse-subtle">
                3
              </span>
            </button>

            {/* User Info */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-fuchsia-500/30">
                {adminUser?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-100">
                  {adminUser?.email?.split('@')[0] || "Admin"}
                </div>
                <div className="text-xs text-slate-400">
                  {adminUser?.is_superuser ? "Superuser" : "Staff"}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-red-500/50 text-sm font-semibold transition-all group"
            >
              <IconLogout className="group-hover:text-red-400 transition-colors" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 z-30 h-screen
          w-72 md:w-64 lg:w-72
          border-r border-slate-800/50 bg-slate-950/95 backdrop-blur-xl
          p-4 md:p-6
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Mobile Header in Sidebar */}
          <div className="md:hidden mb-6 pb-4 border-b border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">Menu</div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900/60 flex items-center justify-center hover:bg-slate-800 transition-all"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Label */}
          <div className="flex items-center gap-2 px-2 mb-4">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Navigation</div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mb-6">
            {navItems.map((item) => (
              <NavLink 
                key={item.to}
                to={item.to} 
                end={item.end}
                className={linkClass}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Quick Stats</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Today's Orders</span>
                <span className="text-sm font-bold text-sky-400">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Revenue</span>
                <span className="text-sm font-bold text-emerald-400">Rs 45K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Stock Alerts</span>
                <span className="text-sm font-bold text-amber-400">5</span>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 border border-sky-500/20 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-sky-300 mb-1">Pro Tip</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Admin pages are isolated from the customer storefront for security.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Shop Link */}
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-sm font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Shop
          </button>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-h-screen p-4 lg:p-8 bg-gradient-to-br from-slate-950 to-slate-900">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
