import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../adminApi";
import { ADMIN_ENDPOINTS } from "../adminEndpoints";

// ✅ Helpers
function computeStockStats(p) {
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

  return { totalStock, outCount, lowCount, variantsCount: variants.length, status };
}

function StatCard({ title, value, sub, icon, trend, color = "blue" }) {
  const colorStyles = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30 group-hover:border-blue-400/40",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 group-hover:border-emerald-400/40",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/30 group-hover:border-orange-400/40",
    red: "from-red-500/20 to-red-600/5 border-red-500/30 group-hover:border-red-400/40",
  };

  const iconColorStyles = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    orange: "bg-orange-500/10 text-orange-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className={`group relative rounded-2xl border bg-gradient-to-br backdrop-blur-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden ${colorStyles[color]}`}>
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
              {title}
            </div>
            <div className="text-4xl font-black text-slate-50">{value}</div>
          </div>
          
          {icon && (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorStyles[color]} group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
          )}
        </div>

        {(sub || trend) && (
          <div className="flex items-center justify-between">
            {sub && <div className="text-xs text-slate-400">{sub}</div>}
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-bold ${
                trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {trend.direction === 'up' ? <TrendUpIcon className="w-3 h-3" /> : <TrendDownIcon className="w-3 h-3" />}
                {trend.value}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, tone = "default", size = "sm" }) {
  const toneCls =
    tone === "danger"
      ? "border-red-500/40 bg-red-500/15 text-red-200 shadow-red-500/10"
      : tone === "warning"
      ? "border-amber-500/40 bg-amber-500/15 text-amber-200 shadow-amber-500/10"
      : tone === "info"
      ? "border-sky-500/40 bg-sky-500/15 text-sky-200 shadow-sky-500/10"
      : tone === "success"
      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200 shadow-emerald-500/10"
      : "border-slate-700/50 bg-slate-800/30 text-slate-200";

  const sizeCls = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded-full border font-bold shadow-sm ${toneCls} ${sizeCls}`}>
      {children}
    </span>
  );
}

function LowStockCard({ lowItems, outItems }) {
  const [activeTab, setActiveTab] = useState("out"); // "out" or "low"

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/90 to-slate-900/50 backdrop-blur-sm overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/60 to-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <AlertIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-base font-black text-slate-50">Stock Alerts</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Products requiring immediate attention
              </div>
            </div>
          </div>

          <Link
            to="/admin/products"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-xs font-bold text-slate-200 transition-all duration-200"
          >
            Manage Stock
            <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-5 pb-3 bg-slate-950/40 border-b border-slate-800/50">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("out")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === "out"
                ? "bg-red-500/15 border-2 border-red-500/40 text-red-200 shadow-lg shadow-red-500/10"
                : "bg-slate-900/40 border-2 border-slate-800/50 text-slate-400 hover:text-slate-300 hover:border-slate-700"
            }`}
          >
            Out of Stock
            <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-200 text-xs font-black">
              {outItems.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("low")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === "low"
                ? "bg-amber-500/15 border-2 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-500/10"
                : "bg-slate-900/40 border-2 border-slate-800/50 text-slate-400 hover:text-slate-300 hover:border-slate-700"
            }`}
          >
            Low Stock
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-black">
              {lowItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {lowItems.length === 0 && outItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-slate-200 mb-2">All Good!</div>
            <div className="text-sm text-slate-400">
              No low or out-of-stock products at the moment.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === "out" && outItems.length > 0 && (
              <>
                {outItems.slice(0, 8).map((p, idx) => (
                  <Link
                    key={p.id}
                    to={`/admin/products/${p.id}`}
                    className="group block rounded-xl border border-slate-800/50 bg-slate-950/40 hover:bg-slate-900/60 hover:border-red-500/30 transition-all duration-200 p-4 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800/50 flex items-center justify-center flex-shrink-0 group-hover:border-red-500/30 transition-colors duration-200">
                        <PackageIcon className="w-6 h-6 text-slate-600 group-hover:text-red-400 transition-colors duration-200" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-100 truncate group-hover:text-red-200 transition-colors duration-200">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{p.brand_name || "No Brand"}</span>
                          <span className="text-slate-700">•</span>
                          <span className="text-xs text-slate-500">{p.category_name || "No Category"}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="text-right flex-shrink-0">
                        <Badge tone="danger" size="sm">
                          OUT OF STOCK
                        </Badge>
                        <div className="text-xs text-slate-500 mt-2">
                          {p._stock.variantsCount} {p._stock.variantsCount === 1 ? "size" : "sizes"}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRightIcon className="w-5 h-5 text-slate-600 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </Link>
                ))}
                {outItems.length > 8 && (
                  <div className="text-center pt-2">
                    <Link
                      to="/admin/products"
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors duration-200"
                    >
                      View {outItems.length - 8} more out-of-stock products
                      <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </>
            )}

            {activeTab === "out" && outItems.length === 0 && (
              <div className="text-center py-8">
                <div className="text-sm text-slate-400">No out-of-stock products</div>
              </div>
            )}

            {activeTab === "low" && lowItems.length > 0 && (
              <>
                {lowItems.slice(0, 8).map((p, idx) => (
                  <Link
                    key={p.id}
                    to={`/admin/products/${p.id}`}
                    className="group block rounded-xl border border-slate-800/50 bg-slate-950/40 hover:bg-slate-900/60 hover:border-amber-500/30 transition-all duration-200 p-4 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800/50 flex items-center justify-center flex-shrink-0 group-hover:border-amber-500/30 transition-colors duration-200">
                        <PackageIcon className="w-6 h-6 text-slate-600 group-hover:text-amber-400 transition-colors duration-200" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-100 truncate group-hover:text-amber-200 transition-colors duration-200">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{p.brand_name || "No Brand"}</span>
                          <span className="text-slate-700">•</span>
                          <span className="text-xs text-slate-500">{p.category_name || "No Category"}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="text-right flex-shrink-0">
                        <Badge tone="warning" size="sm">
                          LOW STOCK
                        </Badge>
                        <div className="text-xs text-slate-500 mt-2">
                          Total: {p._stock.totalStock} • Low: {p._stock.lowCount}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRightIcon className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </Link>
                ))}
                {lowItems.length > 8 && (
                  <div className="text-center pt-2">
                    <Link
                      to="/admin/products"
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors duration-200"
                    >
                      View {lowItems.length - 8} more low-stock products
                      <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </>
            )}

            {activeTab === "low" && lowItems.length === 0 && (
              <div className="text-center py-8">
                <div className="text-sm text-slate-400">No low-stock products</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [err, setErr] = useState("");

  const fetchProducts = async () => {
    setErr("");
    setLoadingProducts(true);
    try {
      const res = await adminApi.get(ADMIN_ENDPOINTS.adminProducts);
      const list = Array.isArray(res.data) ? res.data : [];
      setProducts(list);
    } catch (e) {
      console.error(e);
      setErr("Could not load stock alerts (check /api/catalog/admin/products/).");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const enhanced = useMemo(
    () => products.map((p) => ({ ...p, _stock: computeStockStats(p) })),
    [products]
  );

  const outItems = useMemo(
    () => enhanced.filter((p) => p.is_active && p._stock.status === "OUT"),
    [enhanced]
  );

  const lowItems = useMemo(
    () => enhanced.filter((p) => p.is_active && p._stock.status === "LOW"),
    [enhanced]
  );

  const totals = useMemo(() => {
    const activeCount = enhanced.filter((p) => p.is_active).length;
    const hiddenCount = enhanced.filter((p) => !p.is_active).length;
    const bestCount = enhanced.filter((p) => p.is_best_seller).length;
    const alertCount = outItems.length + lowItems.length;
    return { activeCount, hiddenCount, bestCount, alertCount };
  }, [enhanced, outItems, lowItems]);

  return (
    <div className="max-w-7xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-50 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Monitor your store performance and inventory status
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loadingProducts}
          className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/40 hover:from-blue-500/30 hover:to-blue-600/20 hover:border-blue-400/60 text-blue-200 text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingProducts ? (
            <>
              <LoadingSpinner />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {err && (
        <div className="rounded-2xl border border-red-900/60 bg-gradient-to-br from-red-950/40 to-red-900/20 px-5 py-4 backdrop-blur-sm animate-shake">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertIcon className="w-3 h-3 text-red-400" />
            </div>
            <div className="text-sm text-red-200 font-medium">{err}</div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Products" 
          value={totals.activeCount}
          sub="Available in store"
          color="blue"
          icon={<PackageIcon className="w-6 h-6" />}
        />
        <StatCard 
          title="Best Sellers" 
          value={totals.bestCount}
          sub="Featured products"
          color="emerald"
          icon={<StarIcon className="w-6 h-6" />}
        />
        <StatCard 
          title="Stock Alerts" 
          value={totals.alertCount}
          sub={`${outItems.length} out, ${lowItems.length} low`}
          color="orange"
          icon={<AlertIcon className="w-6 h-6" />}
        />
        <StatCard 
          title="Hidden Products" 
          value={totals.hiddenCount}
          sub="Not visible to customers"
          color="red"
          icon={<EyeOffIcon className="w-6 h-6" />}
        />
      </div>

      {/* Low Stock Alert Card */}
      {loadingProducts ? (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <LoadingSpinner />
            <span className="text-slate-300 font-medium">Loading stock alerts...</span>
          </div>
        </div>
      ) : (
        <LowStockCard lowItems={lowItems} outItems={outItems} />
      )}

      {/* Quick Actions - ONLY 2 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/products"
          className="group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/90 to-slate-900/50 p-6 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <PackageIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-black text-slate-100 mb-2">Manage Products</h3>
            <p className="text-sm text-slate-400 mb-4">Add, edit, or remove products from your inventory</p>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
              Go to Products
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/90 to-slate-900/50 p-6 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBagIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-black text-slate-100 mb-2">View Orders</h3>
            <p className="text-sm text-slate-400 mb-4">Track and manage customer orders and fulfillment</p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              Go to Orders
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </Link>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

/* ---------- Icon Components ---------- */

function PackageIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function StarIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function AlertIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function EyeOffIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function CheckCircleIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function RefreshIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function ShoppingBagIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function TrendUpIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function TrendDownIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
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