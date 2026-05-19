// src/Pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authApi from "../authApi";
import { useAuth } from "../AuthContext";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

import loginImg from "../assets/auth-login.jpg";

function LoginPage() {
  const navigate = useNavigate();
  // ✅ FIXED: Use login and googleLogin from AuthContext (not setAuthTokens)
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!info) return;
    const t = setTimeout(() => setInfo(""), 2500);
    return () => clearTimeout(t);
  }, [info]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Enter email and password.");
      return;
    }

    try {
      setLoading(true);
      // ✅ FIXED: Use AuthContext's login — this sets tokens AND fetches user
      await login({ email: cleanEmail, password });
      // ✅ Navigate AFTER user state is set (login awaits fetchMe)
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed. Check credentials or verify your email.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setError("");
    setInfo("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setError("Enter your email first.");

    try {
      setLoading(true);
      await authApi.post("/api/auth/resend-verification/", { email: cleanEmail });
      setInfo("✅ Verification email sent. Check inbox/spam.");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Could not resend verification email.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setInfo("");

    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      // ✅ FIXED: Use AuthContext's googleLogin — this sets tokens AND fetches user
      await googleLogin(idToken);

      // ✅ Navigate AFTER user state is set (googleLogin awaits fetchMe)
      setInfo("✅ Logged in with Google!");
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Google login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen relative">
        {/* LEFT IMAGE SECTION */}
        <section className="relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0 animate-scale-in">
            <img
              src={loginImg}
              alt="Premium Sneakers Collection"
              className="absolute inset-0 w-full h-full object-cover brightness-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 via-neutral-900/50 to-neutral-900/40" />
          </div>

          {/* Content Over Image */}
          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            {/* Brand */}
            <div className="animate-fade-in-left">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Threads<span className="text-orange-400">&</span>Trends
                </span>
              </Link>
            </div>

            {/* Message */}
            <div className="space-y-6 animate-fade-in-left animation-delay-200">
              <div className="inline-block">
                <div className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-sm">
                  <span className="text-orange-300 text-sm font-bold">🔥 Authentic Sneakers Only</span>
                </div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                Step Into<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300">
                  Authentic Style
                </span>
              </h2>
              <p className="text-lg text-neutral-300 max-w-md leading-relaxed">
                Join thousands of sneaker enthusiasts getting verified, authentic kicks delivered across Nepal.
              </p>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-black text-white">5K+</div>
                  <div className="text-sm text-neutral-400 font-medium">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">100%</div>
                  <div className="text-sm text-neutral-400 font-medium">Authentic</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">24/7</div>
                  <div className="text-sm text-neutral-400 font-medium">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT FORM SECTION */}
        <section className="flex items-center justify-center px-6 sm:px-12 py-10 relative">
          <div className="w-full max-w-md animate-fade-in-up">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-black text-neutral-900 tracking-tight">
                  Threads<span className="text-orange-500">&</span>Trends
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-neutral-600 font-medium">
                Sign in to access your sneaker collection
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50 to-red-50/50 px-5 py-4 backdrop-blur-sm animate-shake">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {info && (
              <div className="mb-6 rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-emerald-50/50 px-5 py-4 backdrop-blur-sm animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-emerald-700 font-medium">{info}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-bold mb-2 text-neutral-800">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <MailIcon className="w-5 h-5 text-neutral-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-neutral-200 bg-white pl-12 pr-4 py-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-bold mb-2 text-neutral-800">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <LockIcon className="w-5 h-5 text-neutral-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-neutral-200 bg-white pl-12 pr-12 py-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full rounded-xl py-4 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>

              {/* Resend Verification */}
              <button
                type="button"
                onClick={resendVerification}
                disabled={loading}
                className="w-full rounded-xl border-2 border-neutral-200 bg-white py-3.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 disabled:opacity-60"
              >
                Resend Verification Email
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Or continue with</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="group w-full rounded-xl border-2 border-neutral-200 bg-white py-3.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-md transition-all duration-200 disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-3">
                  <GoogleIcon className="w-5 h-5" />
                  <span>Continue with Google</span>
                </span>
              </button>

              {/* Sign Up Link */}
              <div className="pt-6 text-center">
                <p className="text-sm text-neutral-600">
                  New to Threads & Trends?{" "}
                  <Link 
                    to="/signup" 
                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <div className="flex items-center justify-center gap-6 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <LockIcon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <VerifiedIcon className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(1.1);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 1s ease-out forwards;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 20s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </main>
  );
}

export default LoginPage;

/* ---------- Icon Components ---------- */

function MailIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m22 8-10 7L2 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}