// src/Pages/SignupPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../authApi";
import signupImg from "../assets/auth-signup.jpg";

const makeUsername = (email) => {
  const base = (email.split("@")[0] || "user").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${base}${rand}`.toLowerCase();
};

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "", color: "" });

  useEffect(() => {
    if (!info) return;
    const t = setTimeout(() => setInfo(""), 2500);
    return () => clearTimeout(t);
  }, [info]);

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let label = "";
    let color = "";

    if (score <= 1) {
      label = "Weak";
      color = "bg-red-500";
    } else if (score === 2) {
      label = "Fair";
      color = "bg-orange-500";
    } else if (score === 3) {
      label = "Good";
      color = "bg-yellow-500";
    } else if (score === 4) {
      label = "Strong";
      color = "bg-emerald-500";
    } else {
      label = "Very Strong";
      color = "bg-emerald-600";
    }

    setPasswordStrength({ score, label, color });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Email and password required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const username = makeUsername(cleanEmail);

      const res = await authApi.post("/api/auth/register/", {
        username,
        email: cleanEmail,
        password,
      });

      setInfo(res?.data?.detail || "✅ Signup success. Verification email sent!");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.detail ||
        data?.message ||
        (data?.email?.[0] ? `Email: ${data.email[0]}` : "") ||
        (data?.username?.[0] ? `Username: ${data.username[0]}` : "") ||
        (data?.password?.[0] ? `Password: ${data.password[0]}` : "") ||
        "Signup failed. Check backend.";
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
      const res = await authApi.post("/api/auth/resend-verification/", { email: cleanEmail });
      setInfo(res?.data?.detail || "✅ Verification email resent. Check inbox/spam.");
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

  return (
    <main className="min-h-screen bg-neutral-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen relative">
        {/* LEFT IMAGE SECTION */}
        <section className="relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0 animate-scale-in">
            <img
              src={signupImg}
              alt="Join the Sneaker Community"
              className="absolute inset-0 w-full h-full object-cover brightness-110"
            />
            {/* Gradient Overlay - MADE LIGHTER */}
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
                <div className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <span className="text-blue-300 text-sm font-bold">🚀 Join 5,000+ Sneakerheads</span>
                </div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                Start Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
                  Sneaker Journey
                </span>
              </h2>
              <p className="text-lg text-neutral-300 max-w-md leading-relaxed">
                Create your account today and get exclusive access to verified authentic sneakers, limited drops, and premium support.
              </p>

              {/* Benefits */}
              <div className="space-y-3 pt-4">
                {[
                  { icon: "✓", text: "100% Authentic Guarantee" },
                  { icon: "✓", text: "Exclusive Limited Edition Drops" },
                  { icon: "✓", text: "Fast Delivery Across Nepal" },
                  { icon: "✓", text: "24/7 Customer Support" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-300 text-sm font-bold">{item.icon}</span>
                    </div>
                    <span className="text-neutral-300 font-medium">{item.text}</span>
                  </div>
                ))}
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
                Create Account
              </h1>
              <p className="mt-2 text-neutral-600 font-medium">
                Sign up and verify your email to get started
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
                    <MailIcon className="w-5 h-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-neutral-200 bg-white pl-12 pr-4 py-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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
                    <LockIcon className="w-5 h-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-neutral-200 bg-white pl-12 pr-12 py-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3 animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-600">Password Strength</span>
                      <span className={`text-xs font-bold ${
                        passwordStrength.score <= 1 ? 'text-red-600' :
                        passwordStrength.score === 2 ? 'text-orange-600' :
                        passwordStrength.score === 3 ? 'text-yellow-600' :
                        'text-emerald-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300 ease-out`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 space-y-1">
                      {[
                        { met: password.length >= 8, text: "At least 8 characters" },
                        { met: /[a-z]/.test(password) && /[A-Z]/.test(password), text: "Upper & lowercase letters" },
                        { met: /\d/.test(password), text: "Contains a number" },
                        { met: /[^a-zA-Z0-9]/.test(password), text: "Contains special character" }
                      ].map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {req.met ? (
                            <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <XIcon className="w-3.5 h-3.5 text-neutral-300" />
                          )}
                          <span className={`text-xs font-medium ${req.met ? 'text-emerald-600' : 'text-neutral-500'}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="group">
                <label className="block text-sm font-bold mb-2 text-neutral-800">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <LockIcon className="w-5 h-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-xl border-2 border-neutral-200 bg-white pl-12 pr-12 py-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                  >
                    {showConfirm ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirm && password && (
                  <div className="mt-2 animate-fade-in">
                    {password === confirm ? (
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600">Passwords match</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XIcon className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-red-600">Passwords don't match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full rounded-xl py-4 text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
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

              {/* Login Link */}
              <div className="pt-6 text-center">
                <p className="text-sm text-neutral-600">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Tip */}
              <div className="pt-4">
                <div className="rounded-xl bg-blue-50/50 border border-blue-200/50 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-900 mb-1">Verification Required</p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Please verify your email before logging in. Check your inbox and spam folder.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <div className="flex items-center justify-center gap-6 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <LockIcon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <VerifiedIcon className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Verified</span>
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

export default SignupPage;

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

function CheckIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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