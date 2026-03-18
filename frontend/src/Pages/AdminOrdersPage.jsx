// src/Pages/AdminOrdersPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../adminApi";
import { ADMIN_ENDPOINTS } from "../adminEndpoints";

const STATUS_OPTIONS = [
  { value: "placed", label: "Placed", icon: "📦", color: "slate" },
  { value: "packed", label: "Packed", icon: "📋", color: "indigo" },
  { value: "out_for_delivery", label: "Out for delivery", icon: "🚚", color: "amber" },
  { value: "delivered", label: "Delivered", icon: "✅", color: "emerald" },
  { value: "cancelled", label: "Cancelled", icon: "❌", color: "rose" },
];

const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s.label]));

function money(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "Rs 0";
  return `Rs ${num.toLocaleString()}`;
}

// Enhanced StatusPill with gradients and animations
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
  };

  const config = statusConfig[s] || statusConfig.placed;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider
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

// Enhanced Card component with hover effects and animations
function Card({ title, value, sub, icon, gradient }) {
  return (
    <div
      className="group relative rounded-3xl border border-slate-800/70 bg-slate-950/45 backdrop-blur-xl p-6
                  shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]
                  hover:border-slate-700/80 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_80px_rgba(0,0,0,0.45)]
                  transition-all duration-500 hover:scale-[1.02] overflow-hidden
                  animate-fadeInUp"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient || 'bg-gradient-to-br from-sky-500/5 to-indigo-500/5'}`} />
      
      {/* Icon */}
      {icon && (
        <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
          {icon}
        </div>
      )}

      <div className="relative">
        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
          {icon && <span className="text-base opacity-70">{icon}</span>}
          {title}
        </div>
        <div className="mt-3 text-4xl font-black text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-100 group-hover:to-slate-300 transition-all duration-500">
          {value}
        </div>
        {sub && (
          <div className="mt-2 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
            {sub}
          </div>
        )}
      </div>

      {/* Animated corner accent */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-sky-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

// Loading skeleton for table
function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-4 py-4">
            <div className="h-4 w-16 bg-slate-800/50 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-32 bg-slate-800/50 rounded mb-2" />
            <div className="h-3 w-48 bg-slate-800/30 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-24 bg-slate-800/50 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-20 bg-slate-800/50 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-6 w-16 bg-slate-800/50 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="h-6 w-20 bg-slate-800/50 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="h-3 w-28 bg-slate-800/50 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-slate-800/50 rounded-xl" />
              <div className="h-8 w-24 bg-slate-800/50 rounded-xl" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  const headers = ["id", "full_name", "phone", "address", "total", "payment_method", "status", "created_at"];
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => esc(r?.[h]))
        .join(",")
    ),
  ];

  return lines.join("\n");
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await adminApi.get(ADMIN_ENDPOINTS.ordersList);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr("Could not load orders. Check endpoint + admin token.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [q, statusFilter]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" ? true : o.status === statusFilter;

      const hay = [
        o.id,
        o.full_name,
        o.phone,
        o.address,
        o.payment_method,
        o.status,
        o.total,
        o.created_at,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query ? true : hay.includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [orders, q, statusFilter]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const pendingCount = orders.filter((o) => o.status === "placed" || o.status === "packed").length;
    const ofdCount = orders.filter((o) => o.status === "out_for_delivery").length;
    const deliveredCount = orders.filter((o) => o.status === "delivered").length;

    const revenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    return { totalOrders, pendingCount, ofdCount, deliveredCount, revenue };
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const updateStatus = async (orderId, newStatus) => {
    const prev = orders;
    setOrders((cur) => cur.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    try {
      await adminApi.patch(ADMIN_ENDPOINTS.orderStatus(orderId), {
        status: newStatus,
        note: "",
      });
      setSuccessMsg(`✓ Order #${orderId} updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      setErr("Failed to update status. Backend rejected it.");
      setOrders(prev);
    }
  };

  const exportCsv = () => {
    const csv = toCsv(filtered);
    const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
    downloadText(`orders-${stamp}.csv`, csv);
    setSuccessMsg(`✓ Exported ${filtered.length} orders to CSV`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const panelBg =
    "relative rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]";

  return (
    <div className="max-w-7xl animate-fadeIn">
      {/* HEADER PANEL */}
      <div className={`${panelBg} p-6 md:p-8 overflow-hidden`}>
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/15 to-blue-600/10 blur-3xl animate-float" />
          <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-500/15 to-purple-600/10 blur-3xl animate-float-delayed" />
          <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-600/10 blur-3xl animate-float-slow" />
        </div>

        {/* Header content */}
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 tracking-tight animate-gradient mb-3">
              Orders Management
            </h1>
            <p className="text-slate-400 text-sm md:text-base flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-slate-900/40 px-3 py-1 rounded-full border border-slate-800/60">
                <span className="text-xs">📊</span>
                <span className="text-xs font-semibold">Advanced Dashboard</span>
              </span>
              <span className="text-slate-700">•</span>
              <span>Search, filter, update & export orders</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportCsv}
              className="group px-5 py-2.5 rounded-2xl text-sm font-bold 
                       bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-700/40
                       hover:from-emerald-800/50 hover:to-green-800/50 hover:border-emerald-600/50
                       text-emerald-100 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                       flex items-center gap-2"
              title="Export currently filtered orders to CSV"
            >
              <span className="group-hover:rotate-12 transition-transform text-lg">📥</span>
              Export CSV
            </button>
            <button
              onClick={fetchOrders}
              className="group px-5 py-2.5 rounded-2xl text-sm font-bold 
                       bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-900 hover:border-slate-700
                       text-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-lg
                       flex items-center gap-2"
            >
              <span className="group-hover:rotate-180 transition-transform duration-500 text-lg">🔄</span>
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
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{err}</span>
            </div>
            <div className="text-xs text-rose-300/80 pl-11">
              List endpoint should be: <span className="font-mono bg-rose-950/40 px-2 py-0.5 rounded">/api/orders/admin/orders/</span>
            </div>
          </div>
        )}

        {/* STATS CARDS */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon="📦"
            gradient="bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
          />
          <Card 
            title="Pending" 
            value={stats.pendingCount} 
            sub="Placed + Packed" 
            icon="⏳"
            gradient="bg-gradient-to-br from-amber-500/5 to-orange-500/5"
          />
          <Card 
            title="Out for Delivery" 
            value={stats.ofdCount} 
            icon="🚚"
            gradient="bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5"
          />
          <Card 
            title="Revenue" 
            value={money(stats.revenue)} 
            sub="Delivered orders only" 
            icon="💰"
            gradient="bg-gradient-to-br from-emerald-500/5 to-green-500/5"
          />
        </div>

        {/* CONTROLS */}
        <div className="relative mt-8 space-y-4">
          {/* Search and Status Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
                🔍
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, phone, id, address, status..."
                className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/55 pl-12 pr-4 py-3 text-sm text-slate-100 
                         placeholder:text-slate-600 outline-none
                         focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10 focus:bg-slate-950/70
                         transition-all duration-300 hover:border-slate-700/80"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full lg:w-64 rounded-2xl border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm text-slate-100 
                         outline-none appearance-none cursor-pointer pr-10
                         focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10 focus:bg-slate-950/70
                         transition-all duration-300 hover:border-slate-700/80"
              >
                <option value="all">All statuses</option>
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

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Filters:</span>
            {["all", "placed", "packed", "out_for_delivery", "delivered", "cancelled"].map((s) => {
              const active = statusFilter === s;
              const label = s === "all" ? "All" : (STATUS_LABEL[s] || s);
              const option = STATUS_OPTIONS.find(opt => opt.value === s);
              const icon = option?.icon || "📋";
              
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`group px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300
                    flex items-center gap-2
                    ${
                      active
                        ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-sky-400/30 shadow-[0_0_20px_rgba(14,165,233,0.3)] scale-105"
                        : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 hover:scale-105"
                    }`}
                >
                  <span className={`text-sm ${active ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`}>
                    {s === "all" ? "📊" : icon}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Results counter */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-sky-300">{filtered.length}</span> of{" "}
              <span className="font-bold text-slate-200">{orders.length}</span> orders
            </div>
            {q && (
              <button
                onClick={() => setQ("")}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE PANEL */}
      <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/45 backdrop-blur-xl overflow-hidden
                      shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]
                      animate-fadeInUp"
                      style={{ animationDelay: '100ms' }}>
        
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-slate-800/70 flex items-center justify-between bg-gradient-to-r from-slate-900/20 via-slate-800/10 to-transparent">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <div className="text-sm font-black text-slate-100">All Orders</div>
              <div className="text-xs text-slate-500">Page {pageSafe} of {totalPages}</div>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-gradient-to-b from-slate-900/40 to-slate-900/20 text-slate-300 border-b border-slate-800/70">
              <tr>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">#</span>
                    Order
                  </div>
                </th>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">👤</span>
                    Customer
                  </div>
                </th>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">📞</span>
                    Phone
                  </div>
                </th>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">💰</span>
                    Total
                  </div>
                </th>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">💳</span>
                    Payment
                  </div>
                </th>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">📦</span>
                    Status
                  </div>
                </th>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">🕐</span>
                    Date
                  </div>
                </th>
                <th className="text-left px-5 py-4 font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">⚙️</span>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <TableSkeleton />
              ) : pageRows.length === 0 ? (
                <tr>
                  <td className="px-5 py-16 text-center text-slate-400" colSpan={8}>
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-6xl opacity-20">🔍</div>
                      <div>
                        <div className="text-lg font-bold text-slate-300 mb-1">
                          {q || statusFilter !== "all" ? "No orders match your filters" : "No orders found"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {q || statusFilter !== "all" ? "Try adjusting your search or filters" : "Orders will appear here once customers start placing them"}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((o, idx) => (
                  <tr
                    key={o.id}
                    className="group hover:bg-gradient-to-r hover:from-slate-900/30 hover:to-transparent transition-all duration-300
                             border-l-4 border-l-transparent hover:border-l-sky-500/50 animate-fadeInUp"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* Order ID */}
                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-2 font-black text-sky-300 hover:text-sky-200 
                                 transition-all duration-300 group/link"
                      >
                        <span className="group-hover/link:scale-110 transition-transform">🔗</span>
                        <span className="group-hover/link:underline underline-offset-4">
                          #{o.id}
                        </span>
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="max-w-[280px]">
                        <div className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                          {o.full_name || "-"}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-1">
                          <span className="opacity-50">📍</span>
                          {o.address || "No address"}
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-200 font-medium">
                        {o.phone || "-"}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <div className="font-black text-lg text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-300 group-hover:to-indigo-300 transition-all">
                        {money(o.total)}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="px-5 py-4">
                      <StatusPill status={(o.payment_method || "").toLowerCase()} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusPill status={o.status} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-slate-500">
                      <div className="flex flex-col gap-1">
                        <span>{o.created_at ? new Date(o.created_at).toLocaleDateString() : "-"}</span>
                        <span className="opacity-60">
                          {o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/orders/${o.id}`}
                          className="group/btn px-4 py-2 rounded-xl text-xs font-bold
                                   bg-gradient-to-r from-slate-900/60 to-slate-800/60 border border-slate-700/60
                                   hover:from-slate-800/70 hover:to-slate-700/70 hover:border-slate-600
                                   text-slate-200 transition-all duration-300 hover:scale-105
                                   flex items-center gap-1.5"
                        >
                          <span className="group-hover/btn:scale-110 transition-transform">👁️</span>
                          View
                        </Link>

                        <div className="relative">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 
                                     font-semibold outline-none appearance-none cursor-pointer pr-8
                                     focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10
                                     transition-all duration-300 hover:border-slate-700/80
                                     disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={o.status === "cancelled" || o.status === "delivered"}
                            title={
                              o.status === "cancelled" || o.status === "delivered"
                                ? "Cannot change status for cancelled/delivered"
                                : "Update order status"
                            }
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.icon} {s.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-5 border-t border-slate-800/70 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-gradient-to-r from-transparent via-slate-900/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400">
              Page{" "}
              <span className="font-bold text-sky-300">{pageSafe}</span> of{" "}
              <span className="font-bold text-slate-200">{totalPages}</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-emerald-300">{pageRows.length}</span> of{" "}
              <span className="font-bold text-slate-200">{filtered.length}</span> results
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={pageSafe === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-800/80 hover:border-slate-700 hover:scale-105
                       text-slate-200 transition-all duration-300 
                       disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed
                       flex items-center gap-1.5"
            >
              <span>⏮️</span>
              First
            </button>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-800/80 hover:border-slate-700 hover:scale-105
                       text-slate-200 transition-all duration-300 
                       disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed
                       flex items-center gap-1.5"
            >
              <span>◀️</span>
              Prev
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe === totalPages}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-800/80 hover:border-slate-700 hover:scale-105
                       text-slate-200 transition-all duration-300 
                       disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed
                       flex items-center gap-1.5"
            >
              Next
              <span>▶️</span>
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={pageSafe === totalPages}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-800/80 hover:border-slate-700 hover:scale-105
                       text-slate-200 transition-all duration-300 
                       disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed
                       flex items-center gap-1.5"
            >
              Last
              <span>⏭️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        <span className="text-xl">💡</span>
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-300">Note:</span> Backend blocks status updates for{" "}
          <span className="font-bold text-rose-400">cancelled</span> and{" "}
          <span className="font-bold text-emerald-400">delivered</span> orders — UI matches that behavior.
        </div>
      </div>

      {/* Add animations CSS */}
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
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