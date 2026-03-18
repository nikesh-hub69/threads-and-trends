// src/Pages/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authApi from "../authApi";
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Gift,
  AlertCircle,
  Clock,
  Box,
  PackageCheck,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";

// ✅ FIXED Return Request Modal with Beautiful Success UI
function ReturnRequestModal({ open, onClose, order, onSuccess }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Backend values - matches REASON_CHOICES exactly
  const reasons = [
    { value: "wrong_size", label: "Wrong Size" },
    { value: "defective", label: "Defective Product" },
    { value: "damaged", label: "Product Damaged in Transit" },
    { value: "wrong_item", label: "Wrong Item Received" },
    { value: "changed_mind", label: "Changed Mind" },
    { value: "quality_issues", label: "Product Quality Issues" },
    { value: "other", label: "Other" },
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }
    setPhotos([...photos, ...files]);
    setError("");
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const toggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (selectedItems.length === 0) {
      setError("Please select at least one item to return");
      return;
    }

    if (!reason) {
      setError("Please select a return reason");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("order_id", order.id);
      formData.append("item_ids", JSON.stringify(selectedItems));
      formData.append("reason", reason);
      formData.append("details", details);
      
      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });

      const res = await authApi.post("/api/orders/return-request/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // ✅ Beautiful Success Modal
      const reasonLabel = reasons.find(r => r.value === reason)?.label || reason;
      
      const successOverlay = document.createElement('div');
      successOverlay.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn';
      successOverlay.innerHTML = `
        <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-2 border-green-500/50 rounded-3xl p-8 max-w-md mx-4 animate-scaleIn shadow-2xl shadow-green-500/30">
          <div class="flex flex-col items-center text-center">
            <!-- Success Icon -->
            <div class="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mb-6 animate-pulse">
              <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <!-- Title -->
            <h3 class="text-2xl font-bold text-green-100 mb-3">Return Request Submitted!</h3>
            
            <!-- Details -->
            <div class="space-y-2 mb-6 text-left w-full bg-black/20 rounded-xl p-4 border border-green-500/20">
              <div class="flex justify-between text-sm">
                <span class="text-green-300/70">Order:</span>
                <span class="text-green-200 font-semibold">#${order.id}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-green-300/70">Items:</span>
                <span class="text-green-200 font-semibold">${selectedItems.length}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-green-300/70">Reason:</span>
                <span class="text-green-200 font-semibold">${reasonLabel}</span>
              </div>
            </div>
            
            <!-- Message -->
            <p class="text-green-200/90 text-sm mb-6 leading-relaxed">
              We'll email you a prepaid return label within <strong>24 hours</strong>. 
              Track your return status in the <strong>Returns</strong> tab.
            </p>
            
            <!-- OK Button -->
            <button 
              onclick="this.closest('.fixed').remove()" 
              class="w-full px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
        
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-scaleIn {
            animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        </style>
      `;
      
      document.body.appendChild(successOverlay);
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (successOverlay.parentNode) {
          successOverlay.remove();
        }
      }, 10000);
      
      onSuccess?.();
      onClose();
    } catch (e) {
      console.error("Return request error:", e);
      const errorMsg = e?.response?.data?.detail 
        || e?.response?.data?.message 
        || e?.message 
        || "Failed to submit return request";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-slate-700/50 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-50">Request Return</h2>
              <p className="text-sm text-slate-400">Order #{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-700/50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">{error}</div>
            </div>
          )}

          {/* Step 1: Select Items */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3">
              Step 1: Select Items to Return *
            </label>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedItems.includes(item.id)
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-100 mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Qty: {item.qty} • Size: {item.size || "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-sky-400">
                        Rs. {Number(item.price * item.qty).toLocaleString()}
                      </div>
                      {selectedItems.includes(item.id) && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Return Reason */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3">
              Step 2: Select Return Reason *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reasons.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    reason === r.value
                      ? "bg-sky-500 text-white"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Additional Details */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3">
              Step 3: Additional Details (Optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all resize-none"
              placeholder="Please provide any additional information about the return..."
            />
          </div>

          {/* Step 4: Upload Photos */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3">
              Step 4: Upload Photos (Optional, max 5)
            </label>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 5 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700/50 rounded-xl hover:border-sky-500/50 hover:bg-slate-800/30 cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-sm text-slate-400">Click to upload photos</span>
                <span className="text-xs text-slate-500 mt-1">{photos.length}/5 uploaded</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200 space-y-1">
                <p className="font-semibold">What happens next?</p>
                <ul className="text-xs text-blue-300/80 space-y-1 mt-2">
                  <li>• We'll review your request within 24 hours</li>
                  <li>• You'll receive a prepaid return label via email</li>
                  <li>• Free returns for defective/incorrect items</li>
                  <li>• Rs. 500 fee for other returns (deducted from refund)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700/50">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Return Request"
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// ✅ Enhanced Timeline Component
function OrderTimeline({ order }) {
  const steps = [
    { key: "placed", label: "Order Placed", icon: <Package className="w-5 h-5" />, color: "sky" },
    { key: "packed", label: "Packed", icon: <Box className="w-5 h-5" />, color: "blue" },
    { key: "out_for_delivery", label: "Out for Delivery", icon: <Truck className="w-5 h-5" />, color: "purple" },
    { key: "delivered", label: "Delivered", icon: <CheckCircle2 className="w-5 h-5" />, color: "green" },
  ];

  const status = String(order?.status || "placed").toLowerCase();
  const currentIndex = steps.findIndex((s) => s.key === status);
  const idx = currentIndex >= 0 ? currentIndex : 0;

  const getTime = (key) => {
    const ev = (order?.timeline || []).find((t) => String(t.status).toLowerCase() === key);
    return ev?.created_at ? new Date(ev.created_at).toLocaleString() : "";
  };

  if (status === "cancelled") {
    return (
      <div className="group relative bg-gradient-to-br from-red-900/20 to-red-900/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-red-200 mb-1">Order Cancelled</div>
            <div className="text-sm text-slate-300">
              {getTime("cancelled") || "This order has been cancelled."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-sky-400" />
            <h3 className="text-xl font-bold text-slate-100">Order Tracking</h3>
          </div>
          <p className="text-sm text-slate-400">
            Follow your order journey from placement to delivery
          </p>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg">
          {order?.created_at ? new Date(order.created_at).toLocaleString() : ""}
        </span>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-slate-800 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${(idx / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-4 gap-4">
            {steps.map((step, i) => {
              const isCompleted = i <= idx;
              const isCurrent = i === idx;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted
                        ? `bg-${step.color}-500 border-${step.color}-400 shadow-lg shadow-${step.color}-500/50`
                        : "bg-slate-800 border-slate-700"
                    } ${isCurrent ? "scale-110 animate-pulse" : ""}`}
                  >
                    <div className={isCompleted ? "text-white" : "text-slate-500"}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-4 text-center">
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isCompleted ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      {getTime(step.key) || "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-4">
        {steps.map((step, i) => {
          const isCompleted = i <= idx;
          const isCurrent = i === idx;

          return (
            <div
              key={step.key}
              className={`relative rounded-xl p-4 border transition-all duration-300 ${
                isCompleted
                  ? `border-${step.color}-500/30 bg-${step.color}-500/10`
                  : "border-slate-700/50 bg-slate-800/30"
              } ${isCurrent ? "ring-2 ring-sky-500/30" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isCompleted
                      ? `bg-${step.color}-500/20 border border-${step.color}-500/30`
                      : "bg-slate-700/50"
                  }`}
                >
                  <div className={isCompleted ? `text-${step.color}-400` : "text-slate-500"}>
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-semibold ${
                      isCompleted ? "text-slate-200" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {getTime(step.key) || "Pending"}
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle2 className={`w-5 h-5 text-${step.color}-400`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Log */}
      {!!order?.timeline?.length && (
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Detailed Timeline
          </div>
          <div className="space-y-2">
            {order.timeline.map((t, idx) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-4 text-xs bg-slate-800/30 rounded-lg px-3 py-2"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <span className="capitalize text-slate-300 font-medium">
                  {String(t.status).replaceAll("_", " ")}
                </span>
                <span className="text-slate-500">
                  {new Date(t.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);

  const loadOrder = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await authApi.get(`/api/orders/${orderId}/`);
      setOrder(res?.data || null);
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        (e?.response?.status === 401 ? "Please login again." : "Could not load order.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const cancelOrder = async () => {
    if (!order) return;

    const st = String(order.status || "").toLowerCase();
    if (st !== "placed" && st !== "pending") {
      alert("Only newly placed orders can be cancelled.");
      return;
    }

    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    try {
      setBusy(true);
      await authApi.post(`/api/orders/${orderId}/cancel/`);
      await loadOrder();
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        (e?.response?.status === 401 ? "Please login again." : "Could not cancel order.");
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  const statusPill = (st) => {
    const s = (st || "").toLowerCase();

    const styles = {
      delivered: "bg-green-500/10 border-green-500/30 text-green-300",
      cancelled: "bg-red-500/10 border-red-500/30 text-red-300",
      out_for_delivery: "bg-purple-500/10 border-purple-500/30 text-purple-300",
      packed: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      paid: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      placed: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    };

    const style = styles[s] || styles.placed;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${style}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {st}
      </span>
    );
  };

  const pointsRedeemed = Number(order?.points_redeemed ?? order?.points_used ?? 0);
  const pointsEarned = Number(order?.points_earned ?? 0);

  const canCancel = (() => {
    const st = String(order?.status || "").toLowerCase();
    return st === "placed" || st === "pending";
  })();

  // Check if order is eligible for return (delivered within 30 days)
  const canReturn = (() => {
    if (!order) return false;
    const st = String(order.status || "").toLowerCase();
    
    // Only delivered orders can be returned
    if (st !== "delivered") return false;

    // Check if delivered within 30 days
    const deliveredEvent = (order?.timeline || []).find(
      (t) => String(t.status).toLowerCase() === "delivered"
    );
    
    if (!deliveredEvent?.created_at) return false;

    const deliveredDate = new Date(deliveredEvent.created_at);
    const daysSinceDelivery = Math.floor((Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceDelivery <= 30;
  })();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-950/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/orders"
              className="group flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Orders</span>
            </Link>
            
            {/* Refund Policy Link in Header */}
            <Link
              to="/refund-policy"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Return Policy</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-2 tracking-tight">
            Order Details
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <Package className="w-4 h-4" />
            <span className="text-sm">Order #{orderId}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-200 mb-1">Error</div>
              <div className="text-sm text-red-300">
                {error}{" "}
                {error.toLowerCase().includes("login") && (
                  <Link className="underline font-semibold" to="/login">
                    Go to Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading order details...</p>
          </div>
        ) : !order ? (
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">Order Not Found</h3>
            <p className="text-slate-500">This order doesn't exist or you don't have access to it.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timeline */}
            <OrderTimeline order={order} />

            <div className="grid lg:grid-cols-3 gap-6">
              {/* LEFT: Items */}
              <section className="lg:col-span-2 space-y-4">
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="w-5 h-5 text-sky-400" />
                      <h3 className="text-xl font-bold text-slate-100">Order Items</h3>
                    </div>
                    {statusPill(order.status)}
                  </div>

                  <div className="space-y-3">
                    {order.items?.map((it, idx) => (
                      <div
                        key={it.id}
                        className="group bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-100 mb-1">
                              {it.name}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 rounded">
                                Qty: {it.qty}
                              </span>
                              {it.size && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 rounded">
                                  Size: {it.size}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-bold text-sky-400">
                              Rs. {Number(it.price * it.qty).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              Rs. {Number(it.price).toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* RIGHT: Summary & Info */}
              <aside className="lg:col-span-1 space-y-4">
                {/* Order Summary */}
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-5">Order Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="font-semibold text-slate-200">
                        Rs. {Number(order.subtotal).toLocaleString()}
                      </span>
                    </div>

                    {pointsRedeemed > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          Points Discount
                        </span>
                        <span className="font-semibold text-emerald-400">
                          - Rs. {pointsRedeemed.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                    <div className="flex items-center justify-between text-base pt-2">
                      <span className="font-bold text-slate-100">Total</span>
                      <span className="font-bold text-sky-400 text-xl">
                        Rs. {Number(order.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                {(pointsRedeemed > 0 || pointsEarned > 0) && (
                  <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h3 className="text-sm font-bold text-emerald-200">Rewards</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Points Used</span>
                        <span className="font-bold text-emerald-300">{pointsRedeemed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Points Earned</span>
                        <span className="font-bold text-emerald-300">{pointsEarned}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Info */}
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-slate-200">Delivery Information</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Name</div>
                        <div className="text-slate-300 font-medium">{order.full_name}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Phone</div>
                        <div className="text-slate-300 font-medium">{order.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Address</div>
                        <div className="text-slate-300 font-medium leading-relaxed">
                          {order.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Return Button */}
                {canReturn && (
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="w-full py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-300 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Request Return
                  </button>
                )}

                {/* Cancel Button */}
                {canCancel && (
                  <button
                    onClick={cancelOrder}
                    disabled={busy}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {busy ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin"></div>
                        Cancelling...
                      </span>
                    ) : (
                      "Cancel Order"
                    )}
                  </button>
                )}

                {String(order.status || "").toLowerCase() === "cancelled" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300 flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    This order has been cancelled.
                  </div>
                )}

                {/* Return Policy Info */}
                {!canReturn && String(order.status || "").toLowerCase() === "delivered" && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-amber-300">
                        <p className="font-semibold mb-1">Return window closed</p>
                        <p className="text-xs text-amber-200/80">
                          Returns are available within 30 days of delivery.{" "}
                          <Link to="/refund-policy" className="underline hover:text-amber-100">
                            View policy
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </div>

      {/* Return Request Modal */}
      {order && (
        <ReturnRequestModal
          open={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          order={order}
          onSuccess={loadOrder}
        />
      )}
    </main>
  );
}