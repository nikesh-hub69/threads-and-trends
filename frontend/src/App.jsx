// src/App.jsx
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  Link,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import VerifyEmailPage from "./Pages/VerifyEmailPage";
import ProductList from "./Pages/ProductList";
import ProductDetail from "./Pages/ProductDetail";
import CartPage from "./Pages/CartPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import MenPage from "./Pages/MenPage";
import WomenPage from "./Pages/WomenPage";
import WishlistPage from "./Pages/WishlistPage";
import ProfilePage from "./Pages/ProfilePage";

import CheckoutPage from "./Pages/CheckoutPage";
import OrderSuccessPage from "./Pages/OrderSuccessPage";
import OrdersPage from "./Pages/OrdersPage";
import OrderDetailPage from "./Pages/OrderDetailPage";
import ShopNowPage from "./Pages/ShopNowPage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import TermsPage from "./Pages/TermsPage";
import RefundPolicyPage from "./Pages/RefundPolicyPage";


// ✅ Admin pages
import AdminDashboardPage from "./Pages/AdminDashboardPage";
import AdminOrdersPage from "./Pages/AdminOrdersPage";
import AdminOrderDetailPage from "./Pages/AdminOrderDetailPage";
import AdminProductsPage from "./Pages/AdminProductsPage";
import AdminProductStockPage from "./Pages/AdminProductStockPage";
import AdminReturnRequestsPage from "./Pages/AdminReturnRequestsPage";
import AdminReturnDetailPage from "./Pages/AdminReturnDetailPage";


import AdminRoute from "./components/AdminRoute";
import AdminLoginPage from "./Pages/AdminLoginPage";

import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useAuth } from "./AuthContext";

import logo from "./assets/logo.png";

const navLinkClasses = ({ isActive }) =>
  isActive 
    ? "text-sky-400 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-400 after:rounded-full" 
    : "text-slate-300 hover:text-sky-300 transition-colors duration-200";

// Icons
function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconHeart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M12 21s-7-4.6-9.5-8.7C.9 9.4 2.4 6.7 5.2 5.8c1.7-.5 3.5.1 4.8 1.4 1.3-1.3 3.1-1.9 4.8-1.4 2.8.9 4.3 3.6 2.7 6.5C19 16.4 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconCart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M6 6h15l-1.5 8.5H7.2L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor" />
    </svg>
  );
}
function IconBox(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M21 8v8l-9 5-9-5V8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 13v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconTag(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M20 13 11 22 2 13V2h11l7 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 7h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M10 17 15 12 10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M12 3l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ✅ Refresh/Return icon for Returns menu
function IconRefresh(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M21 10H3M21 10l-4-4m4 4-4 4M3 14h18M3 14l4 4m-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ✅ ADMIN LAYOUT (NO USER HEADER) */
function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleExitAdmin = () => navigate("/");
  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
              <IconShield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-lg font-extrabold">Admin Panel</div>
              <div className="text-xs text-slate-400">Threads &amp; Trends</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExitAdmin}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900 transition"
            >
              Back to Shop
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-slate-800 p-4">
          <div className="text-xs uppercase text-slate-500 font-semibold px-2 mb-2">Menu</div>

          <nav className="flex flex-col gap-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-sky-500/15 text-sky-200 border border-sky-500/30"
                    : "text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-sky-500/15 text-sky-200 border border-sky-500/30"
                    : "text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`
              }
            >
              Orders
            </NavLink>

            {/* ✅ Returns Menu Item */}
            <NavLink
              to="/admin/returns"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-sky-500/15 text-sky-200 border border-sky-500/30"
                    : "text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`
              }
            >
              Returns
            </NavLink>

            <NavLink
               to="/admin/products"
               className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-sky-500/15 text-sky-200 border border-sky-500/30"
                    : "text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`
             }
          >
            Stock
          </NavLink>
          </nav>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ✅ SHOP LAYOUT (ENHANCED USER HEADER) */
function ShopLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loadingAuth, logout } = useAuth();
  const isLoggedIn = !!user;

  const { totalQuantity } = useCart();
  const { wishlistCount = 0 } = useWishlist() || {};

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const ddItem = "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-all duration-200 text-slate-900";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Enhanced Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-slate-950/50">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-24 py-4 flex items-center justify-between gap-6 max-w-[2000px] mx-auto">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-sky-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-sky-500/20">
              <img src={logo} alt="Threads & Trends logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              <span className="text-sky-400">Threads</span>
              <span className="text-slate-100">&</span>
              <span className="text-fuchsia-400">Trends</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/shop-now" className={navLinkClasses}>
              Shop
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              Contact
            </NavLink>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart - Only show if logged in */}
            {isLoggedIn && (
              <NavLink 
                to="/cart" 
                className="relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all"
              >
                <IconCart className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors" />
                <span className="hidden md:inline text-sm font-medium text-slate-200 group-hover:text-sky-400 transition-colors">
                  Cart
                </span>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1.5 shadow-lg shadow-sky-500/50 animate-pulse-subtle">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>
            )}

            {/* Wishlist - only if logged in */}
            {isLoggedIn && (
              <NavLink 
                to="/wishlist" 
                className="relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all"
              >
                <IconHeart className="w-5 h-5 text-slate-300 group-hover:text-fuchsia-400 transition-colors" />
                <span className="hidden xl:inline text-sm font-medium text-slate-200 group-hover:text-fuchsia-400 transition-colors">
                  Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1.5 shadow-lg shadow-fuchsia-500/50 animate-pulse-subtle">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* Auth buttons / User menu */}
            {loadingAuth ? (
              <div className="w-10 h-10 rounded-lg bg-slate-800/50 animate-pulse"></div>
            ) : !isLoggedIn ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-700 hover:border-sky-500 hover:text-sky-300 hover:bg-slate-800/50 transition-all duration-200"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 shadow-lg shadow-sky-500/30 hover:shadow-sky-400/40 transition-all duration-200"
                >
                  Sign up
                </NavLink>
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-700 bg-slate-900/60 hover:border-sky-500 hover:bg-slate-800 transition-all duration-200"
                  title="My Account"
                >
                  <IconUser className="w-5 h-5 text-slate-200" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-[9999] animate-fadeIn">
                    <div className="px-6 py-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                      <div className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        My Account
                      </div>
                      <div className="text-sm text-slate-600 mt-1 truncate">{user?.email}</div>
                    </div>

                    <div className="p-3">
                      <Link to="/profile" onClick={() => setOpen(false)} className={ddItem}>
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <IconUser className="w-5 h-5 text-slate-700" />
                        </div>
                        <span className="text-[15px] font-semibold">Profile</span>
                      </Link>

                      <Link to="/wishlist" onClick={() => setOpen(false)} className={ddItem}>
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <IconHeart className="w-5 h-5 text-slate-700" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[15px] font-semibold">Favourites</div>
                          {wishlistCount > 0 && (
                            <div className="text-xs text-slate-500">{wishlistCount} items</div>
                          )}
                        </div>
                      </Link>

                      <Link to="/cart" onClick={() => setOpen(false)} className={ddItem}>
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <IconCart className="w-5 h-5 text-slate-700" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[15px] font-semibold">Cart</div>
                          {totalQuantity > 0 && (
                            <div className="text-xs text-slate-500">{totalQuantity} items</div>
                          )}
                        </div>
                      </Link>

                      <Link to="/orders" onClick={() => setOpen(false)} className={ddItem}>
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <IconBox className="w-5 h-5 text-slate-700" />
                        </div>
                        <span className="text-[15px] font-semibold">Orders</span>
                      </Link>

                      <div className="my-2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                      <button onClick={handleLogout} className={`${ddItem} w-full text-red-600 hover:bg-red-50`}>
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                          <IconLogout className="w-5 h-5" />
                        </div>
                        <span className="text-[15px] font-semibold">Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition-all"
            >
              {mobileMenuOpen ? (
                <IconClose className="w-5 h-5 text-slate-200" />
              ) : (
                <IconMenu className="w-5 h-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-xl animate-fadeIn">
            <nav className="px-4 py-4 flex flex-col gap-2">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/shop-now" 
                className={({ isActive }) => 
                  `px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`
                }
              >
                Shop
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                      : "text-slate-300 hover:bg-slate-800/50"
                  }`
                }
              >
                Contact
              </NavLink>
              
              {isLoggedIn ? (
                <>
                  <div className="h-px bg-slate-800 my-2" />
                  
                  {/* Cart for mobile when logged in */}
                  <NavLink 
                    to="/cart" 
                    className={({ isActive }) => 
                      `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                          : "text-slate-300 hover:bg-slate-800/50"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <IconCart className="w-5 h-5" />
                      Cart
                    </span>
                    {totalQuantity > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-xs font-bold">
                        {totalQuantity}
                      </span>
                    )}
                  </NavLink>

                  {/* Wishlist for mobile when logged in */}
                  <NavLink 
                    to="/wishlist" 
                    className={({ isActive }) => 
                      `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30" 
                          : "text-slate-300 hover:bg-slate-800/50"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <IconHeart className="w-5 h-5" />
                      Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-fuchsia-500 text-white text-xs font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </NavLink>

                  <NavLink 
                    to="/orders" 
                    className={({ isActive }) => 
                      `flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                          : "text-slate-300 hover:bg-slate-800/50"
                      }`
                    }
                  >
                    <IconBox className="w-5 h-5" />
                    Orders
                  </NavLink>

                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                          : "text-slate-300 hover:bg-slate-800/50"
                      }`
                    }
                  >
                    <IconUser className="w-5 h-5" />
                    Profile
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left w-full"
                  >
                    <IconLogout className="w-5 h-5" />
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-slate-800 my-2" />
                  <NavLink 
                    to="/login" 
                    className="px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/50 transition-all"
                  >
                    Log in
                  </NavLink>
                  <NavLink 
                    to="/signup" 
                    className="px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 transition-all"
                  >
                    Sign up
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  );
}

function RequireLogin({ children }) {
  const { user, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) return null;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

/* ✅ APP ROUTES */
export default function App() {
  return (
    <Routes>
      {/* Admin login only */}
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* ✅ Admin protected area */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:orderId" element={<AdminOrderDetailPage />} />
          
          {/* ✅ Return Request Routes */}
          <Route path="/admin/returns" element={<AdminReturnRequestsPage />} />
          <Route path="/admin/returns/:returnId" element={<AdminReturnDetailPage />} />
          
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/:productId" element={<AdminProductStockPage />} /> 
        </Route>
      </Route>

      {/* Shop routes */}
      <Route element={<ShopLayout />}>
        <Route path="/" element={<ProductList showFilters={false} />} />
        <Route path="/shop" element={<ProductList showHero={false} title="Shop Now" />} />
        <Route path="/shop-now" element={<ShopNowPage />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/women" element={<WomenPage />} />
        
        <Route path="/products/:slug" element={<ProductDetail />} />

        <Route path="/cart" element={
          <RequireLogin>
            <CartPage />
          </RequireLogin>
        } />
        
        <Route path="/wishlist" element={<WishlistPage />} />

        <Route path="/checkout" element={
          <RequireLogin>
            <CheckoutPage />
          </RequireLogin>
        } />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}