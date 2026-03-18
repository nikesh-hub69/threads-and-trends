// src/Pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../authApi";
import {
  Package,
  ShoppingBag,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
  Filter,
  Search,
  RotateCcw,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      setLoading(true);

      try {
        // Load orders
        const ordersRes = await authApi.get("/api/orders/mine/");
        const ordersData = ordersRes?.data || [];
        
        // Load return requests
        const returnsRes = await authApi.get("/api/orders/return-requests/");
        const returnsData = returnsRes?.data || [];
        
        setOrders(ordersData);
        setReturnRequests(returnsData);
      } catch (e) {
        const msg =
          e?.response?.data?.detail ||
          (e?.response?.status === 401 ? "Please login again." : "Could not load orders.");
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Get order IDs that have return requests
  const returnedOrderIds = new Set(returnRequests.map(r => r.order));

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Exclude orders with return requests from regular order list
    if (filterStatus !== "returns" && returnedOrderIds.has(order.id)) {
      return false;
    }

    // Show only return requests in "returns" tab
    if (filterStatus === "returns") {
      return returnedOrderIds.has(order.id);
    }

    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus;
    const matchesSearch = 
      searchQuery === "" ||
      order.id.toString().includes(searchQuery) ||
      order.items?.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const s = (status || "").toLowerCase();

    const styles = {
      delivered: {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        text: "text-green-300",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      },
      cancelled: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-300",
        icon: <XCircle className="w-3.5 h-3.5" />,
      },
      out_for_delivery: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        text: "text-purple-300",
        icon: <Truck className="w-3.5 h-3.5" />,
      },
      packed: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-300",
        icon: <Package className="w-3.5 h-3.5" />,
      },
      placed: {
        bg: "bg-sky-500/10",
        border: "border-sky-500/30",
        text: "text-sky-300",
        icon: <Clock className="w-3.5 h-3.5" />,
      },
      pending: {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-300",
        icon: <Clock className="w-3.5 h-3.5" />,
      },
      approved: {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        text: "text-green-300",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      },
      refunded: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-300",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      },
      rejected: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-300",
        icon: <XCircle className="w-3.5 h-3.5" />,
      },
    };

    const style = styles[s] || styles.placed;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${style.bg} ${style.border} ${style.text}`}
      >
        {style.icon}
        <span className="capitalize">{status.replace(/_/g, ' ')}</span>
      </span>
    );
  };

  // Get return status for an order
  const getReturnStatus = (orderId) => {
    const returnReq = returnRequests.find(r => r.order === orderId);
    return returnReq?.status || null;
  };

  // Filter buttons
  const activeOrdersCount = orders.filter(o => !returnedOrderIds.has(o.id)).length;
  
  const filters = [
    { value: "all", label: "All Orders", count: activeOrdersCount },
    { value: "placed", label: "Placed", count: orders.filter(o => !returnedOrderIds.has(o.id) && o.status.toLowerCase() === "placed").length },
    { value: "packed", label: "Packed", count: orders.filter(o => !returnedOrderIds.has(o.id) && o.status.toLowerCase() === "packed").length },
    { value: "out_for_delivery", label: "Shipping", count: orders.filter(o => !returnedOrderIds.has(o.id) && o.status.toLowerCase() === "out_for_delivery").length },
    { value: "delivered", label: "Delivered", count: orders.filter(o => !returnedOrderIds.has(o.id) && o.status.toLowerCase() === "delivered").length },
    { value: "returns", label: "Returns", count: returnRequests.length, icon: <RotateCcw className="w-3.5 h-3.5" /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-50 tracking-tight">
                My Orders
              </h1>
            </div>
          </div>
          <p className="text-slate-400 text-lg">
            Track and manage your sneaker orders
          </p>
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
            <p className="text-slate-400">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full"></div>
              <Package className="w-24 h-24 text-slate-700 relative" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">No Orders Yet</h2>
            <p className="text-slate-500 mb-8 text-center max-w-md">
              Start shopping for authentic sneakers and your orders will appear here!
            </p>
            <Link
              to="/"
              className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/50 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters & Search */}
            <div className="mb-6 space-y-4">
              {/* Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      filterStatus === filter.value
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300 border border-slate-700/50"
                    }`}
                  >
                    {filter.icon}
                    {filter.label}
                    {filter.count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        filterStatus === filter.value
                          ? "bg-white/20"
                          : "bg-slate-700/50"
                      }`}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order ID or product name..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 transition-all"
                />
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">No Matching Orders</h3>
                <p className="text-slate-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, idx) => {
                  const returnStatus = getReturnStatus(order.id);
                  
                  return (
                    <div
                      key={order.id}
                      className="group bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300 hover:shadow-lg"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <div className="text-sm text-slate-500 font-medium">
                              Order #{order.id}
                            </div>
                            {returnStatus ? (
                              <>
                                <StatusBadge status={returnStatus} />
                                <span className="text-xs text-amber-400 flex items-center gap-1">
                                  <RotateCcw className="w-3 h-3" />
                                  Return Requested
                                </span>
                              </>
                            ) : (
                              <StatusBadge status={order.status} />
                            )}
                          </div>
                          <div className="text-2xl font-bold text-slate-100 mb-1">
                            Rs. {Number(order.total).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {order.created_at && new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="group/btn flex items-center gap-2 px-5 py-2.5 bg-sky-500/10 hover:bg-sky-500 border border-sky-500/30 hover:border-sky-500 text-sky-300 hover:text-white rounded-xl font-semibold transition-all duration-300"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Items Preview */}
                      {order.items?.length > 0 && (
                        <div className="border-t border-slate-700/50 pt-4">
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Order Items ({order.items.length})
                          </div>
                          <div className="space-y-2">
                            {order.items.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-4 bg-slate-800/30 rounded-lg px-3 py-2"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-200 truncate">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    Qty: {item.qty}
                                    {item.size && ` • Size: ${item.size}`}
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-slate-300">
                                  Rs. {Number(item.price * item.qty).toLocaleString()}
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="text-xs text-slate-500 text-center py-2">
                                +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}