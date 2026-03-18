// src/Pages/AdminProductsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../adminApi";
import { ADMIN_ENDPOINTS } from "../adminEndpoints";

// Enhanced Badge component with gradients and animations
function Badge({ children, tone = "default" }) {
  const toneConfig = {
    danger: {
      border: "border-rose-500/30",
      bg: "bg-gradient-to-r from-rose-500/10 to-red-500/10",
      text: "text-rose-200",
      glow: "shadow-[0_0_12px_rgba(244,63,94,0.15)]",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
      text: "text-amber-200",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.15)]",
    },
    info: {
      border: "border-sky-500/30",
      bg: "bg-gradient-to-r from-sky-500/10 to-blue-500/10",
      text: "text-sky-200",
      glow: "shadow-[0_0_12px_rgba(14,165,233,0.15)]",
    },
    success: {
      border: "border-emerald-500/30",
      bg: "bg-gradient-to-r from-emerald-500/10 to-green-500/10",
      text: "text-emerald-200",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    },
    default: {
      border: "border-slate-700",
      bg: "bg-slate-900/50",
      text: "text-slate-200",
      glow: "",
    },
  };

  const config = toneConfig[tone] || toneConfig.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
        ${config.border} ${config.bg} ${config.text} ${config.glow}
        transition-all duration-300 hover:scale-105 hover:brightness-110 backdrop-blur-sm`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {children}
    </span>
  );
}

// Stats Card Component
function StatsCard({ icon, label, value, color = "slate" }) {
  const colorConfig = {
    slate: "from-slate-500/10 to-slate-600/10 border-slate-500/30",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-500/30",
    rose: "from-rose-500/10 to-red-500/10 border-rose-500/30",
    sky: "from-sky-500/10 to-blue-500/10 border-sky-500/30",
  };

  return (
    <div
      className={`group relative rounded-2xl border bg-gradient-to-br ${colorConfig[color] || colorConfig.slate}
        p-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden`}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
          <div className="text-3xl font-black text-slate-100">{value}</div>
        </div>
        <div className="text-4xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for table
function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-900/60">
          <td className="py-4 px-4">
            <div className="h-4 w-4 bg-slate-800/50 rounded" />
          </td>
          <td className="py-4 px-4">
            <div className="h-5 w-48 bg-slate-800/50 rounded mb-2" />
            <div className="h-3 w-32 bg-slate-800/30 rounded" />
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-24 bg-slate-800/50 rounded mb-2" />
            <div className="h-3 w-20 bg-slate-800/30 rounded" />
          </td>
          <td className="py-4 px-4">
            <div className="flex gap-2 mb-3">
              <div className="h-6 w-16 bg-slate-800/50 rounded-full" />
              <div className="h-6 w-20 bg-slate-800/50 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-slate-800/50 rounded-xl" />
              <div className="h-8 w-32 bg-slate-800/50 rounded-xl" />
            </div>
          </td>
          <td className="py-4 px-4 text-right">
            <div className="h-4 w-8 bg-slate-800/50 rounded ml-auto" />
          </td>
          <td className="py-4 px-4 text-right">
            <div className="h-9 w-28 bg-slate-800/50 rounded-xl ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

function stockStats(p) {
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const activeVariants = variants.filter((v) => v.is_active);

  const totalStock = activeVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
  const outCount = activeVariants.filter((v) => Number(v.stock || 0) <= 0).length;
  const lowCount = activeVariants.filter((v) => {
    const s = Number(v.stock || 0);
    return s > 0 && s <= 2;
  }).length;

  let status = "OK";
  if (variants.length === 0) status = "NO_SIZES";
  else if (totalStock <= 0) status = "OUT";
  else if (lowCount > 0) status = "LOW";

  return { variantsCount: variants.length, totalStock, outCount, lowCount, status };
}

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [filterMode, setFilterMode] = useState("ALL"); // ALL | LOW | OUT | NO_SIZES

  // Selection state
  const [selected, setSelected] = useState(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);
  const [toast, setToast] = useState("");

  const fetchProducts = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await adminApi.get(ADMIN_ENDPOINTS.adminProducts, {
        params: q.trim() ? { q: q.trim() } : {},
      });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setErr("Could not load products. Check admin permissions / endpoint.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enhanced = useMemo(() => items.map((p) => ({ ...p, _stock: stockStats(p) })), [items]);

  const counts = useMemo(() => {
    const active = enhanced.filter((p) => p.is_active);
    return {
      total: enhanced.length,
      active: active.length,
      low: active.filter((p) => p._stock.status === "LOW").length,
      out: active.filter((p) => p._stock.status === "OUT").length,
      noSizes: active.filter((p) => p._stock.status === "NO_SIZES").length,
    };
  }, [enhanced]);

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();

    return enhanced.filter((p) => {
      if (search) {
        const name = (p.name || "").toLowerCase();
        const brand = (p.brand_name || "").toLowerCase();
        const category = (p.category_name || "").toLowerCase();
        if (!name.includes(search) && !brand.includes(search) && !category.includes(search)) return false;
      }

      if (filterMode === "LOW") return p.is_active && p._stock.status === "LOW";
      if (filterMode === "OUT") return p.is_active && p._stock.status === "OUT";
      if (filterMode === "NO_SIZES") return p.is_active && p._stock.status === "NO_SIZES";

      return true;
    });
  }, [enhanced, q, filterMode]);

  // Keep selection valid when list changes
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set();
      const ids = new Set(enhanced.map((p) => p.id));
      for (const id of prev) if (ids.has(id)) next.add(id);
      return next;
    });
  }, [enhanced]);

  const selectedCount = selected.size;

  const allVisibleSelected = useMemo(() => {
    if (!filtered.length) return false;
    return filtered.every((p) => selected.has(p.id));
  }, [filtered, selected]);

  const toggleSelectAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        filtered.forEach((p) => next.delete(p.id));
      } else {
        filtered.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateProduct = async (id, patch) => {
    setSavingId(id);
    setErr("");
    try {
      const res = await adminApi.patch(ADMIN_ENDPOINTS.adminProductUpdate(id), patch);
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...res.data } : p)));
      setToast("✓ Product updated successfully!");
      setTimeout(() => setToast(""), 2000);
    } catch (e) {
      console.error(e);
      setErr("Failed to update product. Check backend validation.");
    } finally {
      setSavingId(null);
    }
  };

  // Bulk action
  const bulkUpdate = async (patch) => {
    if (!selectedCount) return;
    setBulkSaving(true);
    setErr("");
    try {
      const ids = Array.from(selected);
      await adminApi.post(ADMIN_ENDPOINTS.adminProductsBulkUpdate, { ids, patch });

      // Refresh
      await fetchProducts();
      setToast(`✓ Bulk update applied to ${selectedCount} products!`);
      setTimeout(() => setToast(""), 3000);
      setSelected(new Set());
    } catch (e) {
      console.error(e);
      setErr("Bulk update failed. Check backend permissions/endpoint.");
    } finally {
      setBulkSaving(false);
    }
  };

  const panelBg =
    "relative rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]";

  return (
    <div className="max-w-7xl animate-fadeIn">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 rounded-2xl bg-gradient-to-r from-emerald-950/95 to-green-950/95 
                      border border-emerald-500/60 px-6 py-4 text-sm font-semibold text-emerald-100 
                      shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl animate-slideInRight">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER PANEL */}
      <div className={`${panelBg} p-6 md:p-8 overflow-hidden`}>
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/15 to-green-600/10 blur-3xl animate-float" />
          <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/15 to-blue-600/10 blur-3xl animate-float-delayed" />
          <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/15 to-fuchsia-600/10 blur-3xl animate-float-slow" />
        </div>

        {/* Header */}
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 tracking-tight animate-gradient mb-3">
              Stock Management
            </h1>
            <p className="text-slate-400 text-sm md:text-base flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-slate-900/40 px-3 py-1 rounded-full border border-slate-800/60">
                <span className="text-xs">📦</span>
                <span className="text-xs font-semibold">Inventory Control</span>
              </span>
              <span className="text-slate-700">•</span>
              <span>Manage products, variants & stock levels</span>
            </p>
          </div>

          <button
            onClick={fetchProducts}
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

        {/* Stats Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon="📦" label="Total Products" value={counts.total} color="slate" />
          <StatsCard icon="⚠️" label="Low Stock" value={counts.low} color="amber" />
          <StatsCard icon="❌" label="Out of Stock" value={counts.out} color="rose" />
          <StatsCard icon="📏" label="No Sizes" value={counts.noSizes} color="sky" />
        </div>

        {/* Error Message */}
        {err && (
          <div className="relative mb-6 rounded-2xl border border-rose-900/60 bg-gradient-to-r from-rose-950/40 to-red-950/30 px-5 py-4 text-sm text-rose-200 animate-shake shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{err}</span>
            </div>
          </div>
        )}

        {/* Quick Filter Bar */}
        <div className="relative">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-base">🎯</span> Quick Filters
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterMode("ALL")}
              className={`group px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300
                flex items-center gap-2 ${
                  filterMode === "ALL"
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-sky-400/30 shadow-[0_0_20px_rgba(14,165,233,0.3)] scale-105"
                    : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 hover:scale-105"
                }`}
            >
              <span className={`text-base ${filterMode === "ALL" ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`}>
                📊
              </span>
              All Products
            </button>

            <button
              onClick={() => setFilterMode("LOW")}
              className={`group px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300
                flex items-center gap-2 ${
                  filterMode === "LOW"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-105"
                    : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 hover:scale-105"
                }`}
              title="Products with any size stock 1–2"
            >
              <span className={`text-base ${filterMode === "LOW" ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`}>
                ⚠️
              </span>
              Low Stock
              <span className="px-2 py-0.5 rounded-full bg-black/20 font-black">{counts.low}</span>
            </button>

            <button
              onClick={() => setFilterMode("OUT")}
              className={`group px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300
                flex items-center gap-2 ${
                  filterMode === "OUT"
                    ? "bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400/30 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-105"
                    : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 hover:scale-105"
                }`}
              title="Products with total stock 0"
            >
              <span className={`text-base ${filterMode === "OUT" ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`}>
                ❌
              </span>
              Out of Stock
              <span className="px-2 py-0.5 rounded-full bg-black/20 font-black">{counts.out}</span>
            </button>

            <button
              onClick={() => setFilterMode("NO_SIZES")}
              className={`group px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300
                flex items-center gap-2 ${
                  filterMode === "NO_SIZES"
                    ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white border-slate-400/30 shadow-[0_0_20px_rgba(148,163,184,0.3)] scale-105"
                    : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 hover:scale-105"
                }`}
              title="Active products with zero variants"
            >
              <span className={`text-base ${filterMode === "NO_SIZES" ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`}>
                📏
              </span>
              No Sizes
              <span className="px-2 py-0.5 rounded-full bg-black/20 font-black">{counts.noSizes}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABLE PANEL */}
      <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/45 backdrop-blur-xl overflow-hidden
                    shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]
                    animate-fadeInUp"
                    style={{ animationDelay: '100ms' }}>
        
        {/* Control Bar */}
        <div className="px-6 py-5 border-b border-slate-800/70 bg-gradient-to-r from-slate-900/20 via-slate-800/10 to-transparent">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Title & Selection Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛍️</span>
                <div>
                  <div className="text-sm font-black text-slate-100">Products Inventory</div>
                  <div className="text-xs text-slate-500">
                    {selectedCount > 0 ? (
                      <Badge tone="info">{selectedCount} selected</Badge>
                    ) : (
                      "Select rows for bulk actions"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
                🔍
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by product, brand, category..."
                className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/55 pl-12 pr-4 py-3 text-sm text-slate-100 
                         placeholder:text-slate-600 outline-none
                         focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10 focus:bg-slate-950/70
                         transition-all duration-300 hover:border-slate-700/80"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-lg"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedCount > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/50 animate-slideDown">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-base">⚡</span> Bulk Actions
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={bulkSaving}
                  onClick={() => bulkUpdate({ is_active: true })}
                  className="group px-4 py-2 rounded-xl text-xs font-black 
                           bg-gradient-to-r from-emerald-500/15 to-green-500/15 border border-emerald-500/30 
                           text-emerald-200 hover:from-emerald-500/25 hover:to-green-500/25 hover:scale-105
                           transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                           flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">✅</span>
                  Set Active
                </button>
                <button
                  disabled={bulkSaving}
                  onClick={() => bulkUpdate({ is_active: false })}
                  className="group px-4 py-2 rounded-xl text-xs font-black 
                           bg-gradient-to-r from-rose-500/15 to-red-500/15 border border-rose-500/30 
                           text-rose-200 hover:from-rose-500/25 hover:to-red-500/25 hover:scale-105
                           transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                           flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">🚫</span>
                  Set Hidden
                </button>
                <button
                  disabled={bulkSaving}
                  onClick={() => bulkUpdate({ is_best_seller: true })}
                  className="group px-4 py-2 rounded-xl text-xs font-black 
                           bg-gradient-to-r from-sky-500/15 to-blue-500/15 border border-sky-500/30 
                           text-sky-200 hover:from-sky-500/25 hover:to-blue-500/25 hover:scale-105
                           transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                           flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">⭐</span>
                  Best Seller ON
                </button>
                <button
                  disabled={bulkSaving}
                  onClick={() => bulkUpdate({ is_best_seller: false })}
                  className="group px-4 py-2 rounded-xl text-xs font-black 
                           bg-slate-900/60 border border-slate-800 
                           text-slate-200 hover:bg-slate-900 hover:scale-105
                           transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                           flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">⚪</span>
                  Best Seller OFF
                </button>
                <button
                  disabled={bulkSaving}
                  onClick={() => setSelected(new Set())}
                  className="group px-4 py-2 rounded-xl text-xs font-semibold 
                           bg-slate-900/60 border border-slate-800 
                           text-slate-200 hover:bg-slate-900 hover:scale-105
                           transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                           flex items-center gap-2"
                >
                  <span className="group-hover:scale-110 transition-transform">🗑️</span>
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-sm">
            <thead className="bg-gradient-to-b from-slate-900/40 to-slate-900/20 text-slate-300 border-b border-slate-800/70">
              <tr>
                <th className="py-4 px-5 text-left font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleSelectAllVisible}
                      className="group inline-flex items-center gap-2 text-slate-300 hover:text-slate-100 transition-colors"
                      title="Select all visible"
                    >
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        readOnly
                        className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
                      />
                      <span className="group-hover:underline underline-offset-2">Select</span>
                    </button>
                  </div>
                </th>
                <th className="py-4 px-5 text-left font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">👟</span>
                    Product
                  </div>
                </th>
                <th className="py-4 px-5 text-left font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">🏷️</span>
                    Brand / Category
                  </div>
                </th>
                <th className="py-4 px-5 text-left font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-50">🎯</span>
                    Flags & Actions
                  </div>
                </th>
                <th className="py-4 px-5 text-right font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-base opacity-50">📏</span>
                    Variants
                  </div>
                </th>
                <th className="py-4 px-5 text-right font-black text-xs uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-base opacity-50">⚙️</span>
                    Manage
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-5 py-16 text-center text-slate-400" colSpan={6}>
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-6xl opacity-20">🔍</div>
                      <div>
                        <div className="text-lg font-bold text-slate-300 mb-1">
                          {q || filterMode !== "ALL" ? "No products match your filters" : "No products found"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {q || filterMode !== "ALL" ? "Try adjusting your search or filters" : "Products will appear here once added"}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const isSaving = savingId === p.id;

                  const alertBadge =
                    p.is_active && p._stock.status === "OUT"
                      ? { text: "OUT OF STOCK", tone: "danger", icon: "❌" }
                      : p.is_active && p._stock.status === "LOW"
                      ? { text: "LOW STOCK", tone: "warning", icon: "⚠️" }
                      : p.is_active && p._stock.status === "NO_SIZES"
                      ? { text: "NO SIZES", tone: "default", icon: "📏" }
                      : null;

                  return (
                    <tr
                      key={p.id}
                      className="group hover:bg-gradient-to-r hover:from-slate-900/30 hover:to-transparent transition-all duration-300
                               border-l-4 border-l-transparent hover:border-l-sky-500/50 animate-fadeInUp"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-5">
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleOne(p.id)}
                          className="w-4 h-4 rounded accent-sky-500 cursor-pointer transition-transform hover:scale-110"
                        />
                      </td>

                      {/* Product Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <div className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                                {p.name}
                              </div>
                              {alertBadge && (
                                <Badge tone={alertBadge.tone}>
                                  <span className="mr-1">{alertBadge.icon}</span>
                                  {alertBadge.text}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                              <span className="flex items-center gap-1">
                                <span className="opacity-50">#</span>
                                {p.id}
                              </span>
                              <span className="opacity-30">•</span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-900/60 border border-slate-800">
                                {p.gender}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand / Category */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-200">{p.brand_name || "-"}</div>
                        <div className="text-xs text-slate-500 mt-1">{p.category_name || "-"}</div>
                      </td>

                      {/* Flags & Actions */}
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge tone={p.is_active ? "success" : "default"}>
                            {p.is_active ? "🟢 Active" : "⚫ Hidden"}
                          </Badge>
                          {p.is_best_seller && <Badge tone="info">⭐ Best Seller</Badge>}
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={isSaving}
                            onClick={() => updateProduct(p.id, { is_active: !p.is_active })}
                            className="group/btn px-3 py-1.5 rounded-xl text-xs font-bold 
                                     bg-slate-900/60 border border-slate-800 
                                     hover:bg-slate-800/70 hover:border-slate-700 hover:scale-105
                                     text-slate-200 transition-all duration-300 
                                     disabled:opacity-40 disabled:hover:scale-100
                                     flex items-center gap-1.5"
                          >
                            <span className="group-hover/btn:scale-110 transition-transform">
                              {p.is_active ? "🚫" : "✅"}
                            </span>
                            {isSaving ? "..." : p.is_active ? "Hide" : "Activate"}
                          </button>

                          <button
                            disabled={isSaving}
                            onClick={() => updateProduct(p.id, { is_best_seller: !p.is_best_seller })}
                            className="group/btn px-3 py-1.5 rounded-xl text-xs font-bold 
                                     bg-slate-900/60 border border-slate-800 
                                     hover:bg-slate-800/70 hover:border-slate-700 hover:scale-105
                                     text-slate-200 transition-all duration-300 
                                     disabled:opacity-40 disabled:hover:scale-100
                                     flex items-center gap-1.5"
                          >
                            <span className="group-hover/btn:scale-110 transition-transform">
                              {p.is_best_seller ? "⚪" : "⭐"}
                            </span>
                            {isSaving ? "..." : p.is_best_seller ? "Remove ⭐" : "Add ⭐"}
                          </button>
                        </div>
                      </td>

                      {/* Variants Count */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl 
                                      bg-slate-900/60 border border-slate-800 font-black text-slate-100 min-w-[3rem]">
                          {p._stock.variantsCount}
                        </div>
                      </td>

                      {/* Manage Stock */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="group/link inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl 
                                   bg-gradient-to-r from-sky-500 to-indigo-500 text-white
                                   hover:from-sky-400 hover:to-indigo-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]
                                   text-xs font-black uppercase tracking-wider
                                   transition-all duration-300"
                        >
                          <span className="group-hover/link:scale-110 transition-transform">📦</span>
                          Manage Stock
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        <span className="text-xl">💡</span>
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-300">Tip:</span> If variants are empty, add sizes in Django admin first (ProductVariant).
          Use bulk actions to quickly update multiple products at once.
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
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

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
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