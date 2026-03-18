import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../authApi";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import {
  Lock,
  ShieldCheck,
  Truck,
  CreditCard,
  Wallet,
  Gift,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  User,
  Mail,
  RotateCcw,
} from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, totalPrice } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form validation states
  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
    address: false,
  });

  // Loyalty points
  const [pointsBalance, setPointsBalance] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const subtotal = useMemo(() => Number(totalPrice || 0), [totalPrice]);

  const maxRedeemable = useMemo(() => {
    const maxBySubtotal = Math.max(0, Math.floor(subtotal));
    return Math.max(0, Math.min(pointsBalance, maxBySubtotal));
  }, [pointsBalance, subtotal]);

  const pointsDiscount = useMemo(() => {
    const pts = Math.max(0, Math.min(pointsToRedeem, maxRedeemable));
    return pts;
  }, [pointsToRedeem, maxRedeemable]);

  const deliveryFee = 0; // Free delivery
  const finalTotal = useMemo(() => {
    const t = subtotal - pointsDiscount + deliveryFee;
    return t < 0 ? 0 : t;
  }, [subtotal, pointsDiscount, deliveryFee]);

  // Estimated points to earn (1 point per Rs. 100)
  const pointsToEarn = useMemo(() => {
    return Math.floor(finalTotal / 100);
  }, [finalTotal]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingProfile(true);
        const me = await authApi.get("/api/auth/me/");
        const u = me?.data || {};
        setFullName(u.full_name || u.username || "");
        setPhone(u.phone || "");
        setAddress(u.address || "");
        setPointsBalance(Number(u.points_balance || 0));
      } catch {
        // ignore
      } finally {
        setIsLoadingProfile(false);
      }
    })();
  }, []);

  useEffect(() => {
    setPointsToRedeem((prev) => Math.max(0, Math.min(prev, maxRedeemable)));
  }, [maxRedeemable]);

  // Form validation
  const errors = useMemo(() => {
    return {
      fullName: touched.fullName && !fullName.trim() ? "Name is required" : "",
      phone: touched.phone && !phone.trim() ? "Phone is required" : "",
      address: touched.address && !address.trim() ? "Address is required" : "",
    };
  }, [fullName, phone, address, touched]);

  const isFormValid = fullName.trim() && phone.trim() && address.trim();

  const submitEsewaForm = (formUrl, fields) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = formUrl;

    Object.entries(fields || {}).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = String(v ?? "");
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const placeOrder = async () => {
    setError("");

    // Mark all fields as touched for validation
    setTouched({ fullName: true, phone: true, address: true });

    if (!user) {
      setError("Please login first.");
      navigate("/login");
      return;
    }
    if (!items.length) {
      setError("Your cart is empty.");
      navigate("/cart");
      return;
    }
    if (!isFormValid) {
      setError("Please fill in all required fields.");
      return;
    }

    const safeRedeem = Math.max(0, Math.min(pointsToRedeem, maxRedeemable));

    const payload = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      payment_method: paymentMethod,
      points_to_redeem: safeRedeem,
      items: items.map((it) => ({
        product_id: it.productId || it.id || it.product_id,
        name: it.name,
        price: it.price,
        qty: it.quantity || it.qty || 1,
        size: it.size || "",
      })),
    };

    try {
      setLoading(true);

      if (paymentMethod === "esewa") {
        const res = await authApi.post("/api/payments/esewa/init/", payload);
        const { form_url, fields } = res?.data || {};
        if (!form_url || !fields) {
          setError("eSewa initialization failed. Please try again.");
          return;
        }
        submitEsewaForm(form_url, fields);
        return;
      }

      const res = await authApi.post("/api/orders/create/", payload);
      const orderId = res?.data?.id;
      if (!orderId) {
        setError("Order created but missing order ID.");
        return;
      }

      clearCart?.();
      navigate(`/order-success/${orderId}?pm=cod`);
    } catch (e) {
      const msg = e?.response?.data?.detail || "Failed to create order. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <Lock className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Login Required</h2>
          <p className="text-slate-400 mb-6">Please login to continue with checkout</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-colors"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Your Cart is Empty</h2>
          <p className="text-slate-400 mb-6">Add some sneakers before checking out</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-colors"
          >
            Browse Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-950/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/cart")}
              className="group flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Cart</span>
            </button>
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-3 tracking-tight">
            Complete Your Order
          </h1>
          <p className="text-slate-400 text-lg">
            Just a few more steps to get your authentic sneakers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-400 hidden md:inline">Cart</span>
            </div>
            <div className="h-px w-12 md:w-20 bg-sky-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <span className="text-sm font-medium text-sky-400 hidden md:inline">Checkout</span>
            </div>
            <div className="h-px w-12 md:w-20 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                <span className="text-slate-500 font-bold text-sm">3</span>
              </div>
              <span className="text-sm font-medium text-slate-500 hidden md:inline">Complete</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 animate-shake">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-red-200 mb-1">Error</div>
                <div className="text-sm text-red-300">{error}</div>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SECTION - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Delivery Details</h2>
                  <p className="text-sm text-slate-400">Where should we send your order?</p>
                </div>
              </div>

              {isLoadingProfile ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-slate-800/50 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <User className="w-4 h-4 text-slate-500" />
                      Full Name *
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => setTouched({ ...touched, fullName: true })}
                      className={`w-full rounded-xl border ${
                        errors.fullName ? "border-red-500/50 bg-red-500/5" : "border-slate-700/50 bg-slate-800/50"
                      } px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Phone Number *
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setTouched({ ...touched, phone: true })}
                      className={`w-full rounded-xl border ${
                        errors.phone ? "border-red-500/50 bg-red-500/5" : "border-slate-700/50 bg-slate-800/50"
                      } px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all`}
                      placeholder="98XXXXXXXX"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Email Address
                    </label>
                    <input
                      value={user?.email || ""}
                      disabled
                      className="w-full rounded-xl border border-slate-700/30 bg-slate-800/30 px-4 py-3.5 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      Delivery Address *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={() => setTouched({ ...touched, address: true })}
                      rows={4}
                      className={`w-full rounded-xl border ${
                        errors.address ? "border-red-500/50 bg-red-500/5" : "border-slate-700/50 bg-slate-800/50"
                      } px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all resize-none`}
                      placeholder="Street address, Area, City, Landmark..."
                    />
                    {errors.address && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Loyalty Points Redemption */}
            <div className="group bg-gradient-to-br from-emerald-900/20 to-slate-900/50 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-600/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gift className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-100">Rewards & Points</h2>
                  <p className="text-sm text-emerald-300/70">
                    You have <span className="font-bold text-emerald-300">{pointsBalance}</span> points available
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Max usable</div>
                  <div className="text-lg font-bold text-emerald-300">{maxRedeemable} pts</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Redeem Input */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Redeem Points
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={maxRedeemable}
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(Number(e.target.value || 0))}
                      className="w-full rounded-lg border border-emerald-500/30 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="0"
                    />
                    <button
                      onClick={() => setPointsToRedeem(maxRedeemable)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-2 py-1 bg-emerald-500/10 rounded"
                    >
                      Max
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Discount:</span>
                    <span className="font-bold text-emerald-300">- Rs. {pointsDiscount}</span>
                  </div>
                </div>

                {/* Points Info */}
                <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                  <div className="text-sm font-semibold text-slate-300 mb-2">💡 Quick Info</div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>1 point = Rs. 1 discount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Earn {pointsToEarn} pts from this order</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Points awarded after delivery</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Payment Method</h2>
                  <p className="text-sm text-slate-400">Choose how you want to pay</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`group/card relative rounded-xl p-5 text-left transition-all duration-300 ${
                    paymentMethod === "cod"
                      ? "bg-sky-500/10 border-2 border-sky-400/60 scale-[1.02]"
                      : "bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-sky-400" />
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-base font-bold text-slate-100 mb-1">Cash on Delivery</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Pay with cash when your order arrives at your doorstep
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-400">
                    <ShieldCheck className="w-3 h-3" />
                    Safe & Secure
                  </div>
                </button>

                {/* eSewa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("esewa")}
                  className={`group/card relative rounded-xl p-5 text-left transition-all duration-300 ${
                    paymentMethod === "esewa"
                      ? "bg-emerald-500/10 border-2 border-emerald-400/60 scale-[1.02]"
                      : "bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-400" />
                    </div>
                    {paymentMethod === "esewa" && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-base font-bold text-slate-100 mb-1">eSewa</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Pay instantly using your eSewa wallet (You'll be redirected)
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <Lock className="w-3 h-3" />
                    Instant Payment
                  </div>
                </button>
              </div>

              {paymentMethod === "esewa" && (
                <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-200">
                    You will be redirected to eSewa to complete your payment securely. Don't close the browser until payment is complete.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Order Summary Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Package className="w-5 h-5 text-sky-400" />
                    Order Summary
                  </h3>
                  <span className="text-sm text-slate-400">{items.length} item(s)</span>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                  {items.map((it) => (
                    <div
                      key={`${it.productId || it.id}-${it.variantId || it.size || ""}`}
                      className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        {it.image && (
                          <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-100 truncate">{it.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Qty: {it.quantity || it.qty || 1} {it.size ? `• Size: ${it.size}` : ""}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-sky-400">
                        Rs. {Number(it.price * (it.quantity || it.qty || 1)).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-slate-700/50 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-semibold text-slate-200">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {pointsDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Gift className="w-4 h-4 text-emerald-400" />
                        Points Discount
                      </span>
                      <span className="font-semibold text-emerald-400">- Rs. {pointsDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Truck className="w-4 h-4 text-green-400" />
                      Delivery
                    </span>
                    <span className="font-semibold text-green-400">FREE</span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                  <div className="flex items-center justify-between text-lg pt-2">
                    <span className="font-bold text-slate-100">Total</span>
                    <span className="font-bold text-sky-400 text-2xl">Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Refund Policy Link - ADDED */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <Link 
                    to="/refund-policy"
                    className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span>View our refund policy</span>
                  </Link>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={placeOrder}
                  disabled={loading || !isFormValid}
                  className={`group relative w-full mt-6 py-4 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 ${
                    loading || !isFormValid
                      ? "bg-slate-700 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        {paymentMethod === "cod" ? "Place Order (COD)" : "Pay with eSewa"}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {!loading && isFormValid && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>

                {/* Earn Points Info */}
                {pointsToEarn > 0 && (
                  <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-emerald-300">
                      Earn <span className="font-bold">{pointsToEarn} points</span> with this order
                    </span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <span>100% Authentic Products</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-sky-400" />
                    </div>
                    <span>Free & Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-purple-400" />
                    </div>
                    <span>Secure Payment Gateway</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-4 h-4 text-green-400" />
                    </div>
                    <span>30-Day Returns Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
      `}</style>
    </main>
  );
}