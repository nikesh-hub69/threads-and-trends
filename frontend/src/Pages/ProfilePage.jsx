// src/Pages/ProfilePage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import authApi from "../authApi";
import { useAuth } from "../AuthContext";

// ---------- Enhanced Icon Components ----------
function IconUpload(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M7 9l5-5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 11v7M14 11v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 7l1 14h10l1-14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M12 2l1.2 4.1L17 7l-3.8 1-1.2 4-1.2-4L7 7l3.8-.9L12 2Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19 13l.8 2.6L22 16l-2.2.6L19 19l-.8-2.4L16 16l2.2-.4L19 13Z" stroke="currentColor" strokeWidth="2" />
      <path d="M5 13l.8 2.6L8 16l-2.2.6L5 19l-.8-2.4L2 16l2.2-.4L5 13Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 21v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ---------- helpers ----------
const trimOrEmpty = (v) => (typeof v === "string" ? v.trim() : "");

export default function ProfilePage() {
  const { user } = useAuth();
  const emailFromAuth = user?.email || "";

  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // loyalty points
  const [pointsBalance, setPointsBalance] = useState(0);

  // image
  const [photoUrl, setPhotoUrl] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [verified, setVerified] = useState(false);

  const effectivePhoto = useMemo(() => localPreview || photoUrl || "", [localPreview, photoUrl]);

  // auto-hide info
  useEffect(() => {
    if (!info) return;
    const t = setTimeout(() => setInfo(""), 3000);
    return () => clearTimeout(t);
  }, [info]);

  // load profile from backend
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const me = await authApi.get("/api/auth/me/");
        if (!mounted) return;

        const u = me?.data || {};
        setVerified(!!u?.is_email_verified);

        setFullName(u?.full_name || u?.fullName || u?.name || "");
        setPhone(u?.phone || "");
        setAddress(u?.address || "");
        setPhotoUrl(u?.photo || u?.avatar || u?.photo_url || "");
        setPointsBalance(Number(u?.points_balance || 0));
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const onPickPhoto = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 800 * 1024) {
      setError("Image too large. Max size is 800KB.");
      e.target.value = "";
      return;
    }

    setError("");
    setPhotoFile(f);

    const url = URL.createObjectURL(f);
    setLocalPreview(url);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setLocalPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetForm = () => window.location.reload();

  const saveProfile = async () => {
    setError("");
    setInfo("");

    if (!trimOrEmpty(fullName)) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);

      const form = new FormData();
      form.append("full_name", trimOrEmpty(fullName));
      form.append("phone", trimOrEmpty(phone));
      form.append("address", trimOrEmpty(address));
      if (photoFile) form.append("photo", photoFile);

      let res;
      try {
        res = await authApi.patch("/api/auth/me/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        res = await authApi.post("/api/auth/profile/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const updated = res?.data || {};
      setInfo("✅ Profile updated successfully!");
      setPhotoUrl(updated?.photo || updated?.avatar || updated?.photo_url || photoUrl);
      setPhotoFile(null);
      if (localPreview) setLocalPreview("");

      if (updated?.points_balance !== undefined) {
        setPointsBalance(Number(updated.points_balance || 0));
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.response?.data?.message || "Could not save changes.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-300">
              Manage Profile
            </h1>
            <p className="mt-3 text-base text-slate-400 font-medium">
              Update your personal information and delivery preferences
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold border-2 border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {saving ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6 animate-fade-in-left">
            {/* Profile Card */}
            <div className="group relative rounded-3xl border-2 border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-8 shadow-2xl hover:border-slate-700/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
              
              <div className="relative">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700/50 shadow-xl group-hover:scale-105 transition-transform duration-300">
                      {effectivePhoto ? (
                        <img src={effectivePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <IconUser className="w-16 h-16 text-slate-600" />
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black border-2 shadow-lg ${
                        verified
                          ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-200 border-amber-500/30"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {verified ? "Verified" : "Unverified"}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="mt-6 text-center">
                    <div className="text-2xl font-black text-slate-100 truncate">
                      {trimOrEmpty(fullName) || "Your Name"}
                    </div>
                    <div className="mt-1 text-sm text-slate-400 truncate">
                      {emailFromAuth || "your@email.com"}
                    </div>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="mt-8">
                  <div className="text-sm font-bold text-slate-100 mb-4">
                    Profile Picture
                    <span className="ml-2 text-slate-500 font-normal">(max 800KB)</span>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={onFileChange}
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onPickPhoto}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <IconUpload className="w-4 h-4" />
                      Upload
                    </button>

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold border-2 border-slate-700 bg-slate-950/40 hover:bg-slate-900/70 hover:border-slate-600 transition-all duration-200"
                    >
                      <IconTrash className="w-4 h-4" />
                      Remove
                    </button>
                  </div>

                  {!!photoFile && (
                    <div className="mt-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                      <div className="text-xs text-sky-300 font-semibold">
                        Selected: {photoFile.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips Card */}
                <div className="mt-6 rounded-2xl border border-slate-800/50 bg-slate-950/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm font-bold text-slate-100">Quick Tips</div>
                  </div>
                  
                  <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">•</span>
                      <span>Use a clear photo for better recognition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">•</span>
                      <span>Add phone & address for faster delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">•</span>
                      <span>Keep details updated for smooth checkout</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            

            {/* Loyalty Points Card */}
            <div className="group relative rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-xl p-8 shadow-2xl hover:border-emerald-500/40 transition-all duration-300 animate-fade-in-left animation-delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconSpark className="w-7 h-7 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-100">Loyalty Points</div>
                    <div className="text-xs text-emerald-300/80 font-medium mt-1">Earn rewards on every purchase</div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-emerald-300/70 font-bold uppercase tracking-wider mb-2">
                        Current Balance
                      </div>
                      <div className="text-4xl font-black text-emerald-200">
                        {Number(pointsBalance || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-300">pts</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-emerald-300">1 point = ₨1 discount</span> — Redeem points during checkout for instant savings!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN FORM */}
          <section className="lg:col-span-8 space-y-6 animate-fade-in-right">
            {/* Personal Info Card */}
            <div className="relative rounded-3xl border-2 border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center">
                    <IconUser className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-100">Personal Information</div>
                    <div className="mt-1 text-sm text-slate-400">
                      Details used for your account and deliveries
                    </div>
                  </div>
                </div>

                <div className="shrink-0 inline-flex items-center gap-2 rounded-full bg-slate-800/60 border border-slate-700 px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300">Threads & Trends</span>
                </div>
              </div>

              {/* Alerts */}
              {loading && (
                <div className="mb-6 rounded-xl border-2 border-sky-500/20 bg-sky-500/10 px-5 py-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner />
                    <span className="text-sm text-sky-200 font-medium">Loading your profile...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border-2 border-red-500/30 bg-red-500/10 px-5 py-4 backdrop-blur-sm animate-shake">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-red-200 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {info && (
                <div className="mb-6 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 px-5 py-4 backdrop-blur-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <IconCheck className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-sm text-emerald-200 font-bold">{info}</span>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold mb-3 text-slate-200">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border-2 border-slate-700/50 bg-slate-900/40 px-4 py-3.5 text-sm font-medium text-slate-100 placeholder:text-slate-500 
                                 focus:outline-none focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/20 transition-all duration-200"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold mb-3 text-slate-200">
                      Email Address
                    </label>
                    <input
                      value={emailFromAuth}
                      disabled
                      className="w-full rounded-xl border-2 border-slate-800/50 bg-slate-900/60 px-4 py-3.5 text-sm font-medium text-slate-400 cursor-not-allowed"
                    />
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Managed by your login method
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold mb-3 text-slate-200">
                      Phone Number
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full rounded-xl border-2 border-slate-700/50 bg-slate-900/40 px-4 py-3.5 text-sm font-medium text-slate-100 placeholder:text-slate-500 
                                 focus:outline-none focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/20 transition-all duration-200"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-3 text-slate-200">
                      Delivery Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, Area, City"
                      rows={4}
                      className="w-full rounded-xl border-2 border-slate-700/50 bg-slate-900/40 px-4 py-3.5 text-sm font-medium text-slate-100 placeholder:text-slate-500 resize-none
                                 focus:outline-none focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t-2 border-slate-800/50">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold border-2 border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {saving ? (
                      <>
                        <LoadingSpinner />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="relative rounded-3xl border-2 border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl p-8 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${
                  verified 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  <IconShield className={`w-7 h-7 ${verified ? 'text-emerald-400' : 'text-amber-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="text-xl font-black text-slate-100 mb-2">Account Status</div>
                  {verified ? (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-300 font-bold">Email Verified</span>
                      <span className="text-slate-400">— Full access enabled</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-amber-300 font-bold">Email Not Verified</span>
                        <span className="text-slate-400">— Limited access</span>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-200/80">
                          Please check your inbox and verify your email to unlock all features.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
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