// src/Pages/AdminReturnDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import adminApi from "../adminApi";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending Review", icon: "⏳" },
  { value: "approved", label: "Approved", icon: "✅" },
  { value: "label_sent", label: "Return Label Sent", icon: "📧" },
  { value: "received", label: "Items Received", icon: "📦" },
  { value: "refunded", label: "Refunded", icon: "💰" },
  { value: "rejected", label: "Rejected", icon: "❌" },
];

const REASON_MAP = {
  wrong_size: "Wrong Size",
  defective: "Defective Product",
  damaged: "Product Damaged in Transit",
  wrong_item: "Wrong Item Received",
  changed_mind: "Changed Mind",
  quality_issues: "Product Quality Issues",
  other: "Other",
};

function money(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "Rs 0";
  return `Rs ${num.toLocaleString()}`;
}

// StatusPill component
function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const statusConfig = {
    pending: {
      bg: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
      text: "text-amber-200",
      border: "border-amber-500/30",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.2)]",
    },
    approved: {
      bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
      text: "text-green-200",
      border: "border-green-500/30",
      glow: "shadow-[0_0_12px_rgba(34,197,94,0.2)]",
    },
    label_sent: {
      bg: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10",
      text: "text-blue-200",
      border: "border-blue-500/30",
      glow: "shadow-[0_0_12px_rgba(59,130,246,0.2)]",
    },
    received: {
      bg: "bg-gradient-to-r from-indigo-500/10 to-purple-500/10",
      text: "text-indigo-200",
      border: "border-indigo-500/30",
      glow: "shadow-[0_0_12px_rgba(99,102,241,0.2)]",
    },
    refunded: {
      bg: "bg-gradient-to-r from-emerald-500/10 to-green-500/10",
      text: "text-emerald-200",
      border: "border-emerald-500/30",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
    },
    rejected: {
      bg: "bg-gradient-to-r from-rose-500/10 to-red-500/10",
      text: "text-rose-200",
      border: "border-rose-500/30",
      glow: "shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    },
  };

  const config = statusConfig[s] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.border} ${config.glow} transition-all duration-300 hover:scale-105 hover:brightness-110 backdrop-blur-sm`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {String(status || "").replaceAll("_", " ")}
    </span>
  );
}

// Section component
function Section({ title, right, children, icon }) {
  return (
    <div className="group rounded-3xl border border-slate-800/80 bg-slate-950/45 backdrop-blur-xl overflow-hidden hover:border-slate-700/80 hover:bg-slate-950/60 transition-all duration-500 ease-out hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-fadeIn">
      <div className="px-6 py-4 border-b border-slate-800/70 flex items-center justify-between bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-slate-900/20 group-hover:via-slate-800/10 group-hover:to-transparent transition-all duration-500">
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
          <div className="text-sm font-bold text-slate-100 tracking-wide">{title}</div>
        </div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// FieldRow component
function FieldRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm py-2 px-3 rounded-xl hover:bg-slate-900/30 transition-colors duration-300 group">
      <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
      <span className={`font-semibold text-right ${highlight ? 'text-green-300' : 'text-slate-100'} group-hover:translate-x-1 transition-transform duration-300`}>
        {value || "-"}
      </span>
    </div>
  );
}

export default function AdminReturnDetailPage() {
  const { returnId } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form fields
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const fetchReturn = async () => {
    setErr("");
    setLoading(true);
    try {
      // FIXED: Changed from /status/ to just the return request endpoint
      const res = await adminApi.get(`/api/orders/admin/return-requests/${returnId}/`);
      const data = res.data;
      setReturnRequest(data);
      setNewStatus(data?.status || "");
      setAdminNotes(data?.admin_notes || "");
      setTrackingNumber(data?.return_tracking_number || "");
    } catch (e) {
      console.error(e);
      setReturnRequest(null);
      setErr("Could not load return request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturn();
    // eslint-disable-next-line
  }, [returnId]);

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    setSuccessMsg("");
    try {
      const res = await adminApi.patch(`/api/orders/admin/return-requests/${returnId}/status/`, {
        status: newStatus,
        admin_notes: adminNotes,
        tracking_number: trackingNumber,
      });
      setReturnRequest(res.data);
      setSuccessMsg("✓ Return request updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.error(e);
      setErr("Could not update return request.");
    } finally {
      setSaving(false);
    }
  };

  const panelBg = "relative rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]";

  if (loading) {
    return (
      <div className="max-w-6xl animate-pulse">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 p-7">
          <div className="h-8 w-48 bg-slate-800/50 rounded-xl mb-4" />
          <div className="h-4 w-96 bg-slate-800/50 rounded-lg mb-8" />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-5 space-y-4">
              <div className="h-64 bg-slate-800/30 rounded-2xl" />
              <div className="h-48 bg-slate-800/30 rounded-2xl" />
            </div>
            <div className="col-span-7 space-y-4">
              <div className="h-96 bg-slate-800/30 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!returnRequest) {
    return (
      <div className="max-w-3xl animate-fadeIn">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-50">🔄</div>
            <div className="text-3xl font-extrabold text-slate-100 mb-2">Return not found</div>
            <div className="text-slate-400 mb-6">We couldn't locate this return request.</div>
            {err && (
              <div className="mt-6 rounded-2xl border border-rose-900/60 bg-rose-950/30 px-5 py-4 text-sm text-rose-200">
                <strong>Error:</strong> {err}
              </div>
            )}
            <button
              onClick={() => navigate("/admin/returns")}
              className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:from-slate-700 hover:to-slate-800 text-sm font-bold text-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              ← Back to Returns
            </button>
          </div>
        </div>
      </div>
    );
  }

  const order = returnRequest.order_details || returnRequest.order || {};
  const returnedItems = (order.items || []).filter(item => 
    (returnRequest.item_ids || []).includes(item.id)
  );

  return (
    <div className="max-w-6xl animate-fadeIn">
      <div className={`${panelBg} p-6 md:p-8 overflow-hidden`}>
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-green-500/15 to-emerald-600/10 blur-3xl animate-float" />
          <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-amber-500/15 to-orange-600/10 blur-3xl animate-float-delayed" />
          <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-600/10 blur-3xl animate-float-slow" />
        </div>

        {/* Header */}
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 tracking-tight">
                Return Request #{returnRequest.id}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-slate-900/40 rounded-full px-3 py-1.5 border border-slate-800/60">
                <span className="text-slate-500 text-xs font-semibold">Status</span>
                <StatusPill status={returnRequest.status} />
              </div>

              <Link
                to={`/admin/orders/${order.id}`}
                className="flex items-center gap-2 bg-slate-900/40 rounded-full px-3 py-1.5 border border-slate-800/60 hover:border-sky-500/50 transition-colors"
              >
                <span className="text-slate-500 text-xs font-semibold">Order</span>
                <span className="text-sky-300 text-xs font-bold">#{order.id}</span>
              </Link>
             

              <div className="flex items-center gap-2 bg-slate-900/40 rounded-full px-3 py-1.5 border border-slate-800/60">
                <span className="text-slate-500 text-xs font-semibold">🕐</span>
                <span className="text-slate-300 text-xs">
                  {returnRequest.created_at ? new Date(returnRequest.created_at).toLocaleString() : "-"}
                </span>
              </div>
            </div>
          </div>
          

          <div className="flex gap-3">
            <Link
              to="/admin/returns"
              className="group px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-sm font-bold text-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back
            </Link>
            <button
              onClick={fetchReturn}
              className="group px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-sm font-bold text-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="relative mb-6 rounded-2xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/40 to-green-950/30 px-5 py-4 text-sm text-emerald-200 animate-slideDown shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">{successMsg}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {err && (
          <div className="relative mb-6 rounded-2xl border border-rose-900/60 bg-gradient-to-r from-rose-950/40 to-red-950/30 px-5 py-4 text-sm text-rose-200 animate-shake shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{err}</span>
            </div>
          </div>
        )}

        {/* Grid Layout */}
        <div className="relative grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Return Information */}
            <Section title="Return Information" icon="📝">
              <div className="space-y-1">
                <FieldRow label="Return Reason" value={REASON_MAP[returnRequest.reason] || returnRequest.reason} highlight />
                <FieldRow label="Refund Amount" value={money(returnRequest.refund_amount)} />
                <FieldRow label="Shipping Fee" value={money(returnRequest.shipping_fee_deducted)} />
                <FieldRow 
                  label="Net Refund" 
                  value={money(Number(returnRequest.refund_amount) - Number(returnRequest.shipping_fee_deducted))} 
                  highlight 
                />

                {returnRequest.details && (
                  <div className="pt-4">
                    <div className="text-slate-400 text-xs font-semibold mb-2">Customer Notes</div>
                    <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 to-slate-900/60 p-4 text-slate-200 text-sm leading-relaxed">
                      {returnRequest.details}
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Customer Information */}
            <Section title="Customer Information" icon="👤">
              <div className="space-y-1">
                <FieldRow label="Name" value={order.full_name} />
                <FieldRow label="Email" value={order.user?.email} />
                <FieldRow label="Phone" value={order.phone} />
                
                <div className="pt-4">
                  <div className="text-slate-400 text-xs font-semibold mb-2 flex items-center gap-2">
                    <span>📍</span> Address
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 to-slate-900/60 p-4 text-slate-200 text-sm">
                    {order.address || "-"}
                  </div>
                </div>
              </div>
            </Section>

            {/* Update Status Section */}
            <Section title="Manage Return" icon="⚡">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-2 block">Update Status</label>
                  <div className="relative">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={saving}
                      className="w-full rounded-2xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-green-500/60 focus:ring-4 focus:ring-green-500/10 focus:bg-slate-950/80 transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:border-slate-700/80"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-2 block">Return Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    disabled={saving}
                    placeholder="Enter tracking number for return shipment"
                    className="w-full rounded-2xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-green-500/60 focus:ring-4 focus:ring-green-500/10 focus:bg-slate-950/80 transition-all duration-300 disabled:opacity-50 hover:border-slate-700/80 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-2 block">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    disabled={saving}
                    rows={4}
                    placeholder="Add internal notes about this return request..."
                    className="w-full rounded-2xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-green-500/60 focus:ring-4 focus:ring-green-500/10 focus:bg-slate-950/80 transition-all duration-300 resize-none disabled:opacity-50 hover:border-slate-700/80 placeholder:text-slate-600"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full rounded-2xl px-6 py-3.5 text-sm font-black uppercase tracking-wider bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>💾</span> Save Changes
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </button>
              </div>
            </Section>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Returned Items */}
            <Section title="Returned Items" icon="📦">
              {returnedItems.length > 0 ? (
                <div className="space-y-3">
                  {returnedItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-100 mb-1">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 rounded">
                              Qty: {item.qty}
                            </span>
                            {item.size && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 rounded">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-bold text-green-400">
                            {money(item.price * item.qty)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {money(item.price)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="text-4xl mb-2">📦</div>
                  <div className="text-sm">No items found</div>
                </div>
              )}
            </Section>

          

            {/* Order Summary */}
            <Section title="Original Order Summary" icon="💰">
              <div className="space-y-3">
                <FieldRow label="Order Subtotal" value={money(order.subtotal)} />
                {Number(order.points_discount) > 0 && (
                  <FieldRow label="Points Discount" value={`- ${money(order.points_discount)}`} />
                )}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2" />
                <FieldRow label="Order Total" value={money(order.total)} highlight />
                <FieldRow label="Payment Method" value={(order.payment_method || "").toUpperCase()} />
              </div>
            </Section>

            {/* Timeline */}
            {returnRequest.created_at && (
              <Section title="Return Timeline" icon="📅">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">📝</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-100">Request Created</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(returnRequest.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {returnRequest.approved_at && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">✅</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-100">Approved</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(returnRequest.approved_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {returnRequest.refunded_at && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">💰</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-100">Refunded</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(returnRequest.refunded_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Add animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float 10s ease-in-out infinite; animation-delay: -2s; }
        .animate-float-slow { animation: float 12s ease-in-out infinite; animation-delay: -4s; }
      `}</style>
    </div>
  );
}