// src/Pages/AdminProductStockPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import adminApi from "../adminApi";
import { ADMIN_ENDPOINTS } from "../adminEndpoints";

function fmtMoney(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "Rs 0";
  return `Rs ${num.toLocaleString()}`;
}

// Enhanced Pill component with gradients and animations
function Pill({ children, tone = "slate" }) {
  const toneConfig = {
    slate: {
      border: "border-slate-700",
      bg: "bg-gradient-to-r from-slate-900/50 to-slate-800/50",
      text: "text-slate-200",
      glow: "",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
      text: "text-amber-200",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.15)]",
    },
    rose: {
      border: "border-rose-500/30",
      bg: "bg-gradient-to-r from-rose-500/10 to-red-500/10",
      text: "text-rose-200",
      glow: "shadow-[0_0_12px_rgba(244,63,94,0.15)]",
    },
    sky: {
      border: "border-sky-500/30",
      bg: "bg-gradient-to-r from-sky-500/10 to-blue-500/10",
      text: "text-sky-200",
      glow: "shadow-[0_0_12px_rgba(14,165,233,0.15)]",
    },
    emerald: {
      border: "border-emerald-500/30",
      bg: "bg-gradient-to-r from-emerald-500/10 to-green-500/10",
      text: "text-emerald-200",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    },
  };

  const config = toneConfig[tone] || toneConfig.slate;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider
        ${config.border} ${config.bg} ${config.text} ${config.glow}
        transition-all duration-300 hover:scale-105 hover:brightness-110 backdrop-blur-sm`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {children}
    </span>
  );
}

// Enhanced StatCard with hover effects
function StatCard({ label, value, sub, tone = "slate", icon }) {
  const toneConfig = {
    slate: {
      border: "border-slate-800",
      bg: "bg-slate-950/40",
      gradient: "from-slate-500/10 to-slate-600/10",
    },
    amber: {
      border: "border-amber-500/20",
      bg: "bg-amber-950/10",
      gradient: "from-amber-500/10 to-orange-500/10",
    },
    rose: {
      border: "border-rose-500/20",
      bg: "bg-rose-950/10",
      gradient: "from-rose-500/10 to-red-500/10",
    },
    sky: {
      border: "border-sky-500/20",
      bg: "bg-sky-950/10",
      gradient: "from-sky-500/10 to-blue-500/10",
    },
    emerald: {
      border: "border-emerald-500/20",
      bg: "bg-emerald-950/10",
      gradient: "from-emerald-500/10 to-green-500/10",
    },
  };

  const config = toneConfig[tone] || toneConfig.slate;

  return (
    <div
      className={`group relative rounded-2xl border ${config.border} ${config.bg} p-6 
                  transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden`}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Icon */}
      {icon && (
        <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
      )}

      <div className="relative">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-500 font-bold flex items-center gap-2">
          {icon && <span className="text-base opacity-70">{icon}</span>}
          {label}
        </div>
        <div className="mt-3 text-4xl font-black text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-100 group-hover:to-slate-300 transition-all">
          {value}
        </div>
        {sub && <div className="mt-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{sub}</div>}
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

// Enhanced Section component
function Section({ title, right, children }) {
  return (
    <div className="group rounded-3xl border border-slate-800/80 bg-slate-950/45 backdrop-blur-xl overflow-hidden
                    hover:border-slate-700/80 hover:bg-slate-950/60
                    transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="px-6 py-4 border-b border-slate-800/70 flex items-center justify-between bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-slate-900/20 group-hover:via-slate-800/10 group-hover:to-transparent transition-all duration-500">
        <div className="text-sm font-black text-slate-100 tracking-wide">{title}</div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Loading skeleton
function VariantSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-900/60">
          <td className="py-3 pr-2">
            <div className="h-5 w-16 bg-slate-800/50 rounded mb-2" />
            <div className="h-3 w-12 bg-slate-800/30 rounded" />
          </td>
          <td className="py-3 pr-2">
            <div className="h-9 w-full bg-slate-800/50 rounded-xl" />
          </td>
          <td className="py-3 pr-2 text-right">
            <div className="h-9 w-28 bg-slate-800/50 rounded-xl ml-auto" />
          </td>
          <td className="py-3 pr-2 text-right">
            <div className="h-9 w-24 bg-slate-800/50 rounded-xl ml-auto" />
          </td>
          <td className="py-3 pr-2 text-right">
            <div className="h-9 w-16 bg-slate-800/50 rounded-xl ml-auto" />
          </td>
          <td className="py-3 text-right">
            <div className="h-9 w-16 bg-slate-800/50 rounded-xl ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function AdminProductStockPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [savingVariantId, setSavingVariantId] = useState(null);
  const [toast, setToast] = useState("");

  // Premium controls
  const [variantFilter, setVariantFilter] = useState("all"); // all | low | out
  const [sortMode, setSortMode] = useState("size"); // size | stock_asc | stock_desc

  const fetchProduct = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await adminApi.get(ADMIN_ENDPOINTS.adminProductDetail(productId));
      setProduct(res.data);
    } catch (e) {
      console.error(e);
      setErr("Could not load this product. Check endpoint/admin permissions.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const variants = useMemo(() => {
    const v = product?.variants || [];
    return Array.isArray(v) ? v : [];
  }, [product]);

  // Numbers
  const totals = useMemo(() => {
    const totalVariants = variants.length;
    const totalStock = variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    const outCount = variants.filter((v) => Number(v.stock || 0) <= 0 || !v.is_active).length;
    const lowCount = variants.filter((v) => Number(v.stock || 0) > 0 && Number(v.stock || 0) <= 2 && v.is_active).length;

    return { totalVariants, totalStock, outCount, lowCount };
  }, [variants]);

  const updateVariant = async (variantId, patch) => {
    setSavingVariantId(variantId);
    setErr("");
    try {
      await adminApi.patch(ADMIN_ENDPOINTS.adminVariantUpdate(variantId), patch);
      setToast("✓ Variant updated successfully!");
      setTimeout(() => setToast(""), 2500);
      await fetchProduct();
    } catch (e) {
      console.error(e);
      setErr("Failed to update variant. Check backend validation.");
    } finally {
      setSavingVariantId(null);
    }
  };

  // Filtered + sorted list
  const visibleVariants = useMemo(() => {
    let v = [...variants];

    if (variantFilter === "out") {
      v = v.filter((x) => Number(x.stock || 0) <= 0 || !x.is_active);
    } else if (variantFilter === "low") {
      v = v.filter((x) => x.is_active && Number(x.stock || 0) > 0 && Number(x.stock || 0) <= 2);
    }

    if (sortMode === "stock_asc") {
      v.sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
    } else if (sortMode === "stock_desc") {
      v.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    } else {
      // Size sort (tries numeric)
      v.sort((a, b) => {
        const an = Number(String(a.size).replace(/[^\d.]/g, ""));
        const bn = Number(String(b.size).replace(/[^\d.]/g, ""));
        if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
        return String(a.size).localeCompare(String(b.size));
      });
    }

    return v;
  }, [variants, variantFilter, sortMode]);

  const panelBg =
    "relative rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]";

  if (loading) {
    return (
      <div className="max-w-6xl animate-pulse">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 p-8">
          <div className="h-10 w-64 bg-slate-800/50 rounded-xl mb-4" />
          <div className="h-6 w-96 bg-slate-800/30 rounded-lg mb-8" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-800/30 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl animate-fadeIn">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <div className="text-3xl font-extrabold text-slate-100 mb-2">Product not found</div>
            <div className="text-slate-400 mb-6">We couldn't locate this product in our system.</div>

            {err && (
              <div className="mt-6 rounded-2xl border border-rose-900/60 bg-rose-950/30 px-5 py-4 text-sm text-rose-200 animate-shake">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-semibold">{err}</span>
                </div>
              </div>
            )}

            <Link
              to="/admin/products"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 
                       border border-slate-700 hover:from-slate-700 hover:to-slate-800 
                       text-sm font-bold text-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span>←</span> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/15 to-blue-600/10 blur-3xl animate-float" />
          <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/15 to-fuchsia-600/10 blur-3xl animate-float-delayed" />
          <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/15 to-green-600/10 blur-3xl animate-float-slow" />
        </div>

        {/* Header */}
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">👟</span>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 tracking-tight animate-gradient">
                {product.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Pill tone={product.is_active ? "emerald" : "rose"}>
                {product.is_active ? "🟢 Active" : "🔴 Inactive"}
              </Pill>
              <Pill tone={product.is_best_seller ? "sky" : "slate"}>
                {product.is_best_seller ? "⭐ Best Seller" : "⚪ Regular"}
              </Pill>
              <Pill tone="slate">💰 Base: {fmtMoney(product.base_price)}</Pill>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 font-semibold">🏷️ Brand:</span>
                <span className="text-slate-200 font-bold">{product.brand_name || "-"}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 font-semibold">📂 Category:</span>
                <span className="text-slate-200 font-bold">{product.category_name || "-"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="group px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-900 hover:border-slate-700 text-sm font-bold text-slate-200
                       transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back
            </Link>
            <button
              onClick={fetchProduct}
              className="group px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 
                       hover:bg-slate-900 hover:border-slate-700 text-sm font-bold text-slate-200
                       transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
              Refresh
            </button>
          </div>
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

        {/* Stats Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Stock"
            value={totals.totalStock}
            sub="All sizes combined"
            tone="sky"
            icon="📦"
          />
          <StatCard
            label="Variants"
            value={totals.totalVariants}
            sub="Total sizes available"
            tone="slate"
            icon="📏"
          />
          <StatCard
            label="Low Stock"
            value={totals.lowCount}
            sub="Stock 1–2 (active only)"
            tone="amber"
            icon="⚠️"
          />
          <StatCard
            label="Out / Off"
            value={totals.outCount}
            sub="Stock 0 OR inactive"
            tone="rose"
            icon="❌"
          />
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* LEFT: Variants Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Section
            title={
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span>Variants / Sizes Management</span>
              </div>
            }
            right={
              <div className="flex flex-wrap items-center gap-2">
                {/* Filter chips */}
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Filter:</div>
                <button
                  onClick={() => setVariantFilter("all")}
                  className={`group px-3 py-2 rounded-full text-xs font-bold border transition-all duration-300 ${
                    variantFilter === "all"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-sky-400/30 shadow-[0_0_15px_rgba(14,165,233,0.3)] scale-105"
                      : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:scale-105"
                  }`}
                >
                  <span className={variantFilter === "all" ? "animate-bounce" : ""}>📊</span> All
                </button>
                <button
                  onClick={() => setVariantFilter("low")}
                  className={`group px-3 py-2 rounded-full text-xs font-bold border transition-all duration-300 ${
                    variantFilter === "low"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105"
                      : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:scale-105"
                  }`}
                >
                  <span className={variantFilter === "low" ? "animate-bounce" : ""}>⚠️</span> Low
                </button>
                <button
                  onClick={() => setVariantFilter("out")}
                  className={`group px-3 py-2 rounded-full text-xs font-bold border transition-all duration-300 ${
                    variantFilter === "out"
                      ? "bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-105"
                      : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/60 hover:scale-105"
                  }`}
                >
                  <span className={variantFilter === "out" ? "animate-bounce" : ""}>❌</span> Out/Off
                </button>

                {/* Sort dropdown */}
                <div className="relative ml-2">
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                    className="appearance-none rounded-xl border border-slate-800 bg-slate-950/60 pl-3 pr-8 py-2 text-xs text-slate-100 font-semibold outline-none focus:border-sky-500 cursor-pointer hover:bg-slate-950/80 transition-colors"
                    title="Sort variants"
                  >
                    <option value="size">📏 Sort: Size</option>
                    <option value="stock_asc">📈 Stock (Low→High)</option>
                    <option value="stock_desc">📉 Stock (High→Low)</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          >
            {!variants.length ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-20">📏</div>
                <div className="text-lg font-bold text-slate-300 mb-2">No variants found</div>
                <div className="text-sm text-slate-500">
                  Add ProductVariant sizes in Django admin first to manage stock levels.
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-2">
                  <div className="inline-block min-w-full align-middle px-2">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-b from-slate-900/40 to-slate-900/20 text-slate-300 border-b border-slate-800/70">
                        <tr>
                          <th className="py-4 px-3 text-left font-black text-xs uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span className="text-base opacity-50">📏</span>
                              Size
                            </div>
                          </th>
                          <th className="py-4 px-3 text-left font-black text-xs uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span className="text-base opacity-50">🏷️</span>
                              SKU
                            </div>
                          </th>
                          <th className="py-4 px-3 text-right font-black text-xs uppercase tracking-wider">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-base opacity-50">💰</span>
                              Price
                            </div>
                          </th>
                          <th className="py-4 px-3 text-right font-black text-xs uppercase tracking-wider">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-base opacity-50">📦</span>
                              Stock
                            </div>
                          </th>
                          <th className="py-4 px-3 text-right font-black text-xs uppercase tracking-wider">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-base opacity-50">🔘</span>
                              Active
                            </div>
                          </th>
                          <th className="py-4 px-3 text-right font-black text-xs uppercase tracking-wider">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-base opacity-50">💾</span>
                              Save
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                          <VariantSkeleton />
                        ) : (
                          visibleVariants.map((v, idx) => (
                            <VariantRow
                              key={v.id}
                              v={v}
                              basePrice={product.base_price}
                              saving={savingVariantId === v.id}
                              onSave={(patch) => updateVariant(v.id, patch)}
                              index={idx}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                  <span className="text-xl">💡</span>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-300">Tip:</span>{" "}
                    <span className="text-amber-200 font-semibold">Low stock</span> = 1–2 units,{" "}
                    <span className="text-rose-200 font-semibold">Out/Off</span> = 0 stock or disabled.
                    Changes are saved individually per variant.
                  </div>
                </div>
              </>
            )}
          </Section>
        </div>

        {/* RIGHT: Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Section title={
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span>Quick Status</span>
            </div>
          }>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-900/30 transition-colors group">
                <span className="text-slate-400 text-sm font-semibold group-hover:text-slate-300 transition-colors">
                  Product Status
                </span>
                <Pill tone={product.is_active ? "emerald" : "rose"}>
                  {product.is_active ? "🟢 Active" : "🔴 Hidden"}
                </Pill>
              </div>

              <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-900/30 transition-colors group">
                <span className="text-slate-400 text-sm font-semibold group-hover:text-slate-300 transition-colors">
                  Best Seller
                </span>
                <Pill tone={product.is_best_seller ? "sky" : "slate"}>
                  {product.is_best_seller ? "⭐ Yes" : "⚪ No"}
                </Pill>
              </div>

              <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-900/30 transition-colors group">
                <span className="text-slate-400 text-sm font-semibold group-hover:text-slate-300 transition-colors">
                  Gender
                </span>
                <span className="text-slate-100 font-bold px-3 py-1 bg-slate-900/60 border border-slate-800 rounded-lg">
                  {product.gender || "-"}
                </span>
              </div>
            </div>
          </Section>

          <Section title={
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span>Important Notes</span>
            </div>
          }>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/20 to-indigo-950/20 border border-sky-900/30">
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>💰</span> Pricing
                </div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  Checkout uses the <span className="text-sky-200 font-bold">variant price</span>.
                  Set it equal to base price if you want consistent pricing.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/20 to-green-950/20 border border-emerald-900/30">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>📦</span> Stock Management
                </div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  Update stock levels in real-time. Low stock alerts trigger at 1-2 units.
                  Disable variants to hide from customers.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/20 to-fuchsia-950/20 border border-purple-900/30">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>🏷️</span> SKU Codes
                </div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  Optional SKU helps with inventory tracking and order fulfillment.
                </div>
              </div>
            </div>
          </Section>
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

// Enhanced VariantRow component
function VariantRow({ v, basePrice, saving, onSave, index }) {
  const [price, setPrice] = useState(v.price ?? basePrice);
  const [stock, setStock] = useState(v.stock ?? 0);
  const [isActive, setIsActive] = useState(!!v.is_active);
  const [sku, setSku] = useState(v.sku ?? "");

  useEffect(() => {
    setPrice(v.price ?? basePrice);
    setStock(v.stock ?? 0);
    setIsActive(!!v.is_active);
    setSku(v.sku ?? "");
  }, [v, basePrice]);

  const s = Number(stock || 0);

  const isOut = s <= 0 || !isActive;
  const isLow = !isOut && s <= 2;

  const rowBg = isOut
    ? "bg-gradient-to-r from-rose-950/10 to-red-950/5"
    : isLow
    ? "bg-gradient-to-r from-amber-950/10 to-orange-950/5"
    : "bg-transparent";

  const rowBorder = isOut
    ? "border-rose-500/20"
    : isLow
    ? "border-amber-500/20"
    : "border-slate-800/50";

  return (
    <tr
      className={`group border-b ${rowBorder} ${rowBg} text-slate-200 hover:bg-gradient-to-r hover:from-slate-900/30 hover:to-transparent transition-all duration-300 border-l-4 border-l-transparent hover:border-l-sky-500/50 animate-fadeInUp`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Size */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-black text-lg text-slate-100 group-hover:text-sky-300 transition-colors">
            {v.size}
          </div>
          {isOut && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-200 font-bold uppercase">
              <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
              Out/Off
            </span>
          )}
          {isLow && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-200 font-bold uppercase">
              <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
              Low
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span className="opacity-50">#</span>
          {v.id}
        </div>
      </td>

      {/* SKU */}
      <td className="py-4 px-3">
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2.5 text-xs text-slate-100 font-medium
                   outline-none focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10 focus:bg-slate-950/80
                   transition-all duration-300 hover:border-slate-700"
          placeholder="Enter SKU..."
        />
      </td>

      {/* Price */}
      <td className="py-4 px-3 text-right">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">Rs</span>
          <input
            type="number"
            value={Number(price)}
            onChange={(e) => setPrice(e.target.value)}
            className="w-32 text-right rounded-xl bg-slate-950/60 border border-slate-800 pl-10 pr-3 py-2.5 text-xs text-slate-100 font-bold
                     outline-none focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10 focus:bg-slate-950/80
                     transition-all duration-300 hover:border-slate-700"
          />
        </div>
      </td>

      {/* Stock */}
      <td className="py-4 px-3 text-right">
        <input
          type="number"
          value={Number(stock)}
          onChange={(e) => setStock(e.target.value)}
          className={`w-28 text-right rounded-xl bg-slate-950/60 border px-3 py-2.5 text-xs font-black text-slate-100
                   outline-none focus:ring-4 transition-all duration-300 hover:border-slate-700
                   ${
                     isOut
                       ? "border-rose-500/40 focus:border-rose-500/60 focus:ring-rose-500/10"
                       : isLow
                       ? "border-amber-500/40 focus:border-amber-500/60 focus:ring-amber-500/10"
                       : "border-slate-800 focus:border-sky-500/60 focus:ring-sky-500/10"
                   }`}
        />
      </td>

      {/* Active Toggle */}
      <td className="py-4 px-3 text-right">
        <button
          onClick={() => setIsActive((x) => !x)}
          className={`group/btn px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300 hover:scale-105 ${
            isActive
              ? "border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-200 hover:from-emerald-500/25 hover:to-green-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              : "border-rose-500/40 bg-gradient-to-r from-rose-500/15 to-red-500/15 text-rose-200 hover:from-rose-500/25 hover:to-red-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
          }`}
        >
          <span className="group-hover/btn:scale-110 transition-transform inline-block mr-1">
            {isActive ? "🟢" : "🔴"}
          </span>
          {isActive ? "Active" : "Off"}
        </button>
      </td>

      {/* Save Button */}
      <td className="py-4 px-3 text-right">
        <button
          disabled={saving}
          onClick={() =>
            onSave({
              sku: sku || "",
              price: Number(price),
              stock: Math.max(0, Number(stock)),
              is_active: !!isActive,
            })
          }
          className="group/save px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white
                   hover:from-sky-400 hover:to-indigo-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]
                   text-xs font-black uppercase tracking-wider
                   transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed
                   relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {saving ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <span className="group-hover/save:scale-110 transition-transform">💾</span>
                Save
              </>
            )}
          </span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover/save:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>
      </td>
    </tr>
  );
}