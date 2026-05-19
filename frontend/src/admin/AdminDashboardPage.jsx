// src/admin/AdminDashboardPage.jsx
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  // Sample stats - replace with real API data
  const stats = [
    { 
      label: "Total Orders", 
      value: "156", 
      change: "+12%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      gradient: "from-sky-500 to-cyan-500",
    },
    { 
      label: "Revenue", 
      value: "Rs 2.4M", 
      change: "+8%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-green-500",
    },
    { 
      label: "Total Products", 
      value: "248", 
      change: "+5%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      gradient: "from-fuchsia-500 to-pink-500",
    },
    { 
      label: "Active Users", 
      value: "1,234", 
      change: "+18%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  // Recent orders sample data
  const recentOrders = [
    { id: "ORD-1234", customer: "Ram Sharma", amount: "Rs 12,500", status: "completed", time: "2 hours ago" },
    { id: "ORD-1235", customer: "Sita Rai", amount: "Rs 8,900", status: "pending", time: "3 hours ago" },
    { id: "ORD-1236", customer: "Hari Thapa", amount: "Rs 15,200", status: "processing", time: "5 hours ago" },
    { id: "ORD-1237", customer: "Maya Gurung", amount: "Rs 6,700", status: "completed", time: "6 hours ago" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "processing": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-400">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="group rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 p-6 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn backdrop-blur-sm"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <div className="text-white">
                {stat.icon}
              </div>
            </div>

            <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
            
            <div className="flex items-end justify-between">
              <div className="text-3xl font-extrabold text-slate-100">{stat.value}</div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Orders Card */}
            <Link
              to="/admin/orders"
              className="group rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 p-6 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: "400ms" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-400 mb-1">Orders</div>
              <div className="text-2xl font-extrabold text-slate-100 mb-2">Manage Orders</div>
              <div className="text-sm text-slate-500">View and process customer orders</div>
            </Link>

            {/* Products Card */}
            <Link
              to="/admin/products"
              className="group rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 p-6 hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-fuchsia-500/10 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: "500ms" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center group-hover:bg-fuchsia-500/20 transition-colors">
                  <svg className="w-4 h-4 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-400 mb-1">Products</div>
              <div className="text-2xl font-extrabold text-slate-100 mb-2">Manage Stock</div>
              <div className="text-sm text-slate-500">Update inventory and pricing</div>
            </Link>

            {/* ✅ FIXED: Changed from /admin/users (doesn't exist) to /admin/returns (exists in routes) */}
            <Link
              to="/admin/returns"
              className="group rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: "600ms" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-400 mb-1">Returns</div>
              <div className="text-2xl font-extrabold text-slate-100 mb-2">Return Requests</div>
              <div className="text-sm text-slate-500">Process customer return requests</div>
            </Link>

            {/* Analytics Card */}
            <div className="group rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 animate-fadeIn cursor-pointer"
              style={{ animationDelay: "700ms" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Soon
                </span>
              </div>
              <div className="text-sm text-slate-400 mb-1">Analytics</div>
              <div className="text-2xl font-extrabold text-slate-100 mb-2">View Reports</div>
              <div className="text-sm text-slate-500">Sales and traffic insights</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 animate-fadeIn" style={{ animationDelay: "800ms" }}>
          <h2 className="text-xl font-bold text-slate-100 mb-4">Recent Orders</h2>
          
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 p-5 backdrop-blur-sm">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="pb-4 border-b border-slate-800/50 last:border-0 last:pb-0 group hover:translate-x-1 transition-transform duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{order.id}</div>
                      <div className="text-xs text-slate-400">{order.customer}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-300">{order.amount}</div>
                    <div className="text-xs text-slate-500">{order.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/admin/orders"
              className="mt-4 block text-center text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              View all orders →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4 animate-fadeIn" style={{ animationDelay: "900ms" }}>
        <div className="rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Avg Order Value</div>
          <div className="text-2xl font-bold text-slate-100">Rs 9,850</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold text-slate-100">3.2%</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Pending Orders</div>
          <div className="text-2xl font-bold text-slate-100">12</div>
        </div>
      </div>
    </div>
  );
}