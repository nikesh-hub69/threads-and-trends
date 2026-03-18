// src/Pages/VerifyEmailPage.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import authApi from "../authApi";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const ranOnce = useRef(false);

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (ranOnce.current) return;      // ✅ prevents double-call in StrictMode
    ranOnce.current = true;

    if (!token) {
      setStatus("error");
      setMessage("Missing token");
      return;
    }

    (async () => {
      try {
        // your backend URL: /api/auth/verify-email/
        const res = await authApi.get(`/api/auth/verify-email/?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(res?.data?.detail || "✅ Email verified successfully. You can login now.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.detail ||
          "Invalid or expired token"
        );
      }
    })();
  }, [token]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-900">Email Verification</h1>

        <div className={`mt-4 rounded-xl px-4 py-3 text-sm border ${
          status === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : status === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-slate-200 bg-slate-50 text-slate-700"
        }`}>
          {status === "loading" ? "Verifying..." : message}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Link
            to="/signup"
            className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold text-center hover:bg-slate-800"
          >
            Go to Sign Up
          </Link>
          <Link
            to="/login"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-900 text-center hover:bg-slate-50"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </main>
  );
}