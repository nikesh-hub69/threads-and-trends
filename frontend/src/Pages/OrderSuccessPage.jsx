import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  CreditCard,
  Wallet,
  Gift,
  Truck,
  Clock,
  ArrowRight,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const pm = params.get("pm") || "cod";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Confetti Effect */}
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-50 mb-4">
              {pm === "esewa" ? "Order Created! 🎉" : "Order Placed Successfully! 🎉"}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              {pm === "esewa"
                ? "Your order is pending payment. Complete the payment to confirm your order."
                : "Thank you for your order! We'll start processing it right away."}
            </p>

            {/* Order ID Badge */}
            <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-4 mb-6">
              <Package className="w-5 h-5 text-sky-400" />
              <div className="text-left">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Order ID
                </div>
                <div className="text-xl font-bold text-sky-400">#{orderId}</div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/30 border border-slate-700/30 rounded-full px-5 py-2.5 mb-8">
              {pm === "esewa" ? (
                <CreditCard className="w-4 h-4 text-emerald-400" />
              ) : (
                <Wallet className="w-4 h-4 text-sky-400" />
              )}
              <span className="text-sm text-slate-400">Payment Method:</span>
              <span className="text-sm font-bold text-slate-200">
                {pm === "esewa" ? "eSewa" : "Cash on Delivery"}
              </span>
            </div>

            {/* eSewa Warning */}
            {pm === "esewa" && (
              <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-amber-200 mb-1">
                    Payment Pending
                  </div>
                  <div className="text-sm text-amber-100/80 leading-relaxed">
                    Complete your eSewa payment to confirm this order. The payment gateway will be available once the backend integration is complete.
                  </div>
                </div>
              </div>
            )}

            {/* What's Next Section */}
            <div className="mt-10 mb-8">
              <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                What Happens Next?
              </h3>

              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-3">
                    <Package className="w-5 h-5 text-sky-400" />
                  </div>
                  <div className="text-sm font-semibold text-slate-200 mb-1">
                    Order Processing
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    We'll verify and pack your items carefully
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                    <Truck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-sm font-semibold text-slate-200 mb-1">
                    Fast Shipping
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Your order ships within 24-48 hours
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-sm font-semibold text-slate-200 mb-1">
                    Delivery & Enjoy
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Receive your authentic sneakers safely
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Info */}
            <div className="mb-8 bg-gradient-to-br from-emerald-900/20 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-200">
                  You'll Earn Loyalty Points!
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Points will be added to your account after delivery (1 point per Rs. 100)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={`/orders/${orderId}`}
                className="group w-full sm:w-auto relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Track Your Order
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-slate-200 font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>

            {/* eSewa Pay Button */}
            {pm === "esewa" && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() =>
                    alert("eSewa payment gateway will be available after backend integration.")
                  }
                  className="group relative px-8 py-4 bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  <CreditCard className="w-5 h-5" />
                  Complete Payment with eSewa
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-2">
                    Coming Soon
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Additional Info - REFUND POLICY LINK ADDED */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-slate-500">
              Need help?{" "}
              <Link to="/contact" className="text-sky-400 hover:text-sky-300 underline">
                Contact our support team
              </Link>
            </p>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4 text-green-400" />
              30-day returns available •{" "}
              <Link to="/refund-policy" className="text-sky-400 hover:text-sky-300 underline">
                View refund policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}