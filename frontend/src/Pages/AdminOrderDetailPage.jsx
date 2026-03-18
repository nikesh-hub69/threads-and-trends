// src/Pages/AdminOrderDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import adminApi from "../adminApi";
import { ADMIN_ENDPOINTS } from "../adminEndpoints";

const STATUS_OPTIONS = [
  { value: "placed", label: "Placed", icon: "📦" },
  { value: "packed", label: "Packed", icon: "📋" },
  { value: "out_for_delivery", label: "Out for delivery", icon: "🚚" },
  { value: "delivered", label: "Delivered", icon: "✅" },
  { value: "cancelled", label: "Cancelled", icon: "❌" },
];

function fmtMoney(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "Rs 0";
  return `Rs ${num.toLocaleString()}`;
}

// Enhanced StatusPill with gradient borders and animations
function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const statusConfig = {
    placed: {
      bg: "bg-gradient-to-r from-slate-500/10 to-slate-600/10",
      text: "text-slate-200",
      border: "border-slate-500/30",
      glow: "shadow-[0_0_12px_rgba(148,163,184,0.15)]",
    },
    packed: {
      bg: "bg-gradient-to-r from-indigo-500/10 to-purple-500/10",
      text: "text-indigo-200",
      border: "border-indigo-500/30",
      glow: "shadow-[0_0_12px_rgba(99,102,241,0.2)]",
    },
    out_for_delivery: {
      bg: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
      text: "text-amber-200",
      border: "border-amber-500/30",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.2)]",
    },
    delivered: {
      bg: "bg-gradient-to-r from-emerald-500/10 to-green-500/10",
      text: "text-emerald-200",
      border: "border-emerald-500/30",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
    },
    cancelled: {
      bg: "bg-gradient-to-r from-rose-500/10 to-red-500/10",
      text: "text-rose-200",
      border: "border-rose-500/30",
      glow: "shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    },
    cod: {
      bg: "bg-gradient-to-r from-slate-500/10 to-gray-500/10",
      text: "text-slate-200",
      border: "border-slate-500/30",
      glow: "shadow-[0_0_8px_rgba(148,163,184,0.15)]",
    },
    esewa: {
      bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
      text: "text-green-200",
      border: "border-green-500/30",
      glow: "shadow-[0_0_12px_rgba(34,197,94,0.2)]",
    },
    khalti: {
      bg: "bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10",
      text: "text-fuchsia-200",
      border: "border-fuchsia-500/30",
      glow: "shadow-[0_0_12px_rgba(217,70,239,0.2)]",
    },
    paid: {
      bg: "bg-gradient-to-r from-sky-500/10 to-blue-500/10",
      text: "text-sky-200",
      border: "border-sky-500/30",
      glow: "shadow-[0_0_12px_rgba(14,165,233,0.2)]",
    },
    pending: {
      bg: "bg-gradient-to-r from-amber-500/10 to-yellow-500/10",
      text: "text-amber-200",
      border: "border-amber-500/30",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.2)]",
    },
  };

  const config = statusConfig[s] || statusConfig.placed;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider
        ${config.bg} ${config.text} ${config.border} ${config.glow}
        transition-all duration-300 hover:scale-105 hover:brightness-110
        backdrop-blur-sm
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {String(status || "").replaceAll("_", " ")}
    </span>
  );
}

// Enhanced Section with hover effects and animations
function Section({ title, right, children, icon }) {
  return (
    <div
      className="
        group rounded-3xl border border-slate-800/80 bg-slate-950/45 backdrop-blur-xl overflow-hidden
        hover:border-slate-700/80 hover:bg-slate-950/60
        transition-all duration-500 ease-out
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        animate-fadeIn
      "
    >
      {/* Header with gradient on hover */}
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

// Enhanced FieldRow with smooth transitions
function FieldRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm py-2 px-3 rounded-xl hover:bg-slate-900/30 transition-colors duration-300 group">
      <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
      <span className={`font-semibold text-right ${highlight ? 'text-sky-300' : 'text-slate-100'} group-hover:translate-x-1 transition-transform duration-300`}>
        {value || "-"}
      </span>
    </div>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
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

export default function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchOrder = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await adminApi.get(ADMIN_ENDPOINTS.orderDetail(orderId));
      setOrder(res.data);
      setNewStatus(res.data?.status || "");
    } catch (e) {
      console.error(e);
      setOrder(null);
      setErr("Could not load this order. Check endpoint + admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const items = order?.items || [];
  const timeline = order?.timeline || [];

  const totals = useMemo(() => {
    const subtotal = Number(order?.subtotal || 0);
    const points_discount = Number(order?.points_discount || 0);
    const total = Number(order?.total || 0);
    return { subtotal, points_discount, total };
  }, [order]);

  const canUpdate = order && !["cancelled", "delivered"].includes(order.status);

  const handleSaveStatus = async () => {
    if (!canUpdate) return;
    if (!newStatus) return;

    setSaving(true);
    setErr("");
    setSuccessMsg("");
    try {
      const res = await adminApi.patch(ADMIN_ENDPOINTS.orderStatus(orderId), {
        status: newStatus,
        note: note || "",
      });
      setOrder(res.data);
      setNote("");
      setSuccessMsg("✓ Status updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.error(e);
      setErr("Could not update status. Check backend validation/permissions.");
    } finally {
      setSaving(false);
    }
  };

  const panelBg =
    "relative rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]";

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!order) {
    return (
      <div className="max-w-3xl animate-fadeIn">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <div className="text-3xl font-extrabold text-slate-100 mb-2">Order not found</div>
            <div className="text-slate-400 mb-6">We couldn't locate this order in our system.</div>

            {err && (
              <div className="mt-6 rounded-2xl border border-rose-900/60 bg-rose-950/30 px-5 py-4 text-sm text-rose-200 animate-shake">
                <strong className="font-bold">Error:</strong> {err}
              </div>
            )}

            <button
              onClick={() => navigate("/admin/orders")}
              className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 
                       hover:from-slate-700 hover:to-slate-800 text-sm font-bold text-slate-100
                       transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              ← Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-fadeIn">
      <div className={`${panelBg} p-6 md:p-8 overflow-hidden`}>
        {/* Enhanced animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/15 to-blue-600/10 blur-3xl animate-float" />
          <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-500/15 to-purple-600/10 blur-3xl animate-float-delayed" />
          <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-600/10 blur-3xl animate-float-slow" />
        </div>

        {/* Top Section with enhanced styling */}
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 tracking-tight animate-gradient">
                Order #{order.id}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-slate-900/40 rounded-full px-3 py-1.5 border border-slate-800/60">
                <span className="text-slate-500 text-xs font-semibold">Status</span>
                <StatusPill status={order.status} />
              </div>

              <div className="flex items-center gap-2 bg-slate-900/40 rounded-full px-3 py-1.5 border border-slate-800/60">
                <span className="text-slate-500 text-xs font-semibold">Payment</span>
                <StatusPill status={(order.payment_method || "").toLowerCase()} />
              </div>

              <div className="flex items-center gap-2 bg-slate-900/40 rounded-full px-3 py-1.5 border border-slate-800/60">
                <span className="text-slate-500 text-xs font-semibold">🕐</span>
                <span className="text-slate-300 text-xs">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/orders"
              className="group px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-900 hover:border-slate-700 text-sm font-bold text-slate-200
                       transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back
            </Link>
            <button
              onClick={fetchOrder}
              className="group px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-900 hover:border-slate-700 text-sm font-bold text-slate-200
                       transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
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
            {/* Customer Section */}
            <Section title="Customer Information" icon="👤">
              <div className="space-y-1">
                <FieldRow label="Full Name" value={order.full_name} highlight />
                <FieldRow label="Phone Number" value={order.phone} />

                <div className="pt-4">
                  <div className="text-slate-400 text-xs font-semibold mb-2 flex items-center gap-2">
                    <span>📍</span> Delivery Address
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 to-slate-900/60 p-4 text-slate-200 hover:border-slate-700/80 transition-colors duration-300">
                    {order.address || "-"}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-slate-400 text-xs font-semibold mb-2 flex items-center gap-2">
                    <span>👨‍💼</span> User Account
                  </div>
                  <div className="text-slate-200 font-medium">
                    {order.user?.email || order.user?.username || "-"}
                  </div>
                </div>
              </div>
            </Section>

            {/* Totals Section */}
            <Section title="Order Summary" icon="💰">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 rounded-xl hover:bg-slate-900/30 transition-colors">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-bold text-slate-100">{fmtMoney(totals.subtotal)}</span>
                </div>

                {totals.points_discount > 0 && (
                  <div className="flex justify-between items-center py-2 px-3 rounded-xl hover:bg-slate-900/30 transition-colors">
                    <span className="text-emerald-400 flex items-center gap-2">
                      <span className="text-sm">🎁</span> Points Discount
                    </span>
                    <span className="font-bold text-emerald-300">- {fmtMoney(totals.points_discount)}</span>
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-4" />

                <div className="flex justify-between items-center py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-950/30 to-indigo-950/30 border border-sky-900/30">
                  <span className="text-slate-200 font-bold text-lg">Total Amount</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
                    {fmtMoney(totals.total)}
                  </span>
                </div>
              </div>
            </Section>

            {/* Update Status Section */}
            <Section
              title="Update Order Status"
              icon="⚡"
              right={
                !canUpdate ? (
                  <span className="text-xs text-rose-400 font-semibold bg-rose-950/30 px-3 py-1 rounded-full border border-rose-900/40">
                    🔒 Locked
                  </span>
                ) : null
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-2 block">Select Status</label>
                  <div className="relative">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={!canUpdate || saving}
                      className="w-full rounded-2xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 outline-none
                               focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10 focus:bg-slate-950/80
                               transition-all duration-300 appearance-none cursor-pointer
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:border-slate-700/80"
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
                  <label className="text-xs font-semibold text-slate-400 mb-2 block">Status Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={!canUpdate || saving}
                    rows={3}
                    placeholder="Add a note about this status change (e.g., Package is ready for pickup)"
                    className="w-full rounded-2xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 outline-none
                             focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10 focus:bg-slate-950/80
                             transition-all duration-300 resize-none
                             disabled:opacity-50 disabled:cursor-not-allowed
                             hover:border-slate-700/80 placeholder:text-slate-600"
                  />
                </div>

                <button
                  onClick={handleSaveStatus}
                  disabled={!canUpdate || saving}
                  className="w-full rounded-2xl px-6 py-3.5 text-sm font-black uppercase tracking-wider
                           bg-gradient-to-r from-sky-500 to-indigo-500 text-white
                           hover:from-sky-400 hover:to-indigo-400
                           transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]
                           disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed
                           active:scale-[0.98] relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>💾</span> Save Status
                      </>
                    )}
                  </span>
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </button>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <span className="text-sm">💡</span>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Your note will be saved in the timeline along with the status update.
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Items Section */}
            <Section title="Order Items" icon="🛍️">
              <div className="overflow-x-auto -mx-2">
                <div className="inline-block min-w-full align-middle px-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800/80">
                        <th className="py-4 px-3 text-left font-bold text-xs uppercase tracking-wider">Product</th>
                        <th className="py-4 px-3 text-left font-bold text-xs uppercase tracking-wider">Size</th>
                        <th className="py-4 px-3 text-right font-bold text-xs uppercase tracking-wider">Price</th>
                        <th className="py-4 px-3 text-right font-bold text-xs uppercase tracking-wider">Qty</th>
                        <th className="py-4 px-3 text-right font-bold text-xs uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {items.map((it, idx) => (
                        <tr
                          key={it.id}
                          className="text-slate-200 hover:bg-gradient-to-r hover:from-slate-900/20 hover:to-transparent transition-all duration-300 group"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <td className="py-4 px-3">
                            <div className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                              {it.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <span className="opacity-50">#</span>
                              {it.product_id}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span className="inline-block bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold">
                              {it.size || "-"}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right font-semibold">{fmtMoney(it.price)}</td>
                          <td className="py-4 px-3 text-right">
                            <span className="inline-block bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold min-w-[2.5rem] text-center">
                              {Number(it.qty || 0)}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right font-black text-slate-100 group-hover:text-sky-300 transition-colors">
                            {fmtMoney(Number(it.price || 0) * Number(it.qty || 0))}
                          </td>
                        </tr>
                      ))}

                      {!items.length && (
                        <tr>
                          <td className="py-12 text-center text-slate-500" colSpan={5}>
                            <div className="text-4xl mb-3 opacity-30">📦</div>
                            <div className="font-semibold">No items found in this order</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Timeline Section */}
            <Section title="Order Timeline" icon="📅">
              {timeline.length ? (
                <div className="space-y-5">
                  {timeline.map((t, idx) => (
                    <div
                      key={t.id}
                      className="relative pl-10 animate-slideInRight"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Vertical line */}
                      <div
                        className={`absolute left-[13px] top-3 w-0.5 ${
                          idx === timeline.length - 1 ? "h-8" : "h-full"
                        } bg-gradient-to-b from-slate-700 to-slate-800/50`}
                      />

                      {/* Animated dot */}
                      <div className="absolute left-[6px] top-3 h-5 w-5 rounded-full border-2 border-sky-500/40 bg-slate-950 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                      </div>

                      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/60 to-slate-900/40 p-5 hover:border-slate-700/80 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <StatusPill status={t.status} />
                          <span className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span>🕐</span>
                            {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}
                          </span>
                        </div>
                        {t.note && (
                          <div className="mt-3 text-sm text-slate-300 leading-relaxed pl-4 border-l-2 border-slate-800 group-hover:border-sky-900/50 transition-colors">
                            {t.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4 opacity-20">📅</div>
                  <div className="text-sm text-slate-500 font-semibold">No timeline events yet</div>
                  <div className="text-xs text-slate-600 mt-1">Updates will appear here as the order progresses</div>
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>

      {/* Add custom animations to your global CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 10s ease-in-out infinite;
          animation-delay: -2s;
        }

        .animate-float-slow {
          animation: float 12s ease-in-out infinite;
          animation-delay: -4s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}