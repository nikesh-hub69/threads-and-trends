import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useState } from "react";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Lock, 
  Truck, 
  ShieldCheck,
  Heart,
  Tag,
  Package,
  CheckCircle2
} from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [removingId, setRemovingId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate pricing - NO TAX, clean and simple
  const subtotal = totalPrice;
  const shipping = items.length > 0 ? (subtotal >= 15000 ? 0 : 250) : 0;
  const finalTotal = subtotal + shipping;
  const savingsAmount = shipping === 0 && subtotal >= 15000 ? 250 : 0;

  const handleRemove = async (productId, variantId) => {
    const itemKey = `${productId}-${variantId}`;
    setRemovingId(itemKey);
    
    setTimeout(() => {
      removeFromCart(productId, variantId);
      setRemovingId(null);
    }, 300);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 600);
  };

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    if (newQty > 10) return;
    
    if (updateQuantity) {
      updateQuantity(item.productId, item.variantId, newQty);
    }
  };

  // Calculate progress to free shipping
  const shippingProgress = Math.min((subtotal / 15000) * 100, 100);
  const remainingForFreeShipping = Math.max(15000 - subtotal, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Sticky Header with back button */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Continue Shopping</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title with Items Count */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-2xl border border-sky-500/30">
              <ShoppingBag className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-50 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-slate-400 mt-1">
                {items.length === 0 
                  ? "Your cart is empty" 
                  : `${items.length} ${items.length === 1 ? 'item' : 'items'} ready for checkout`}
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          /* Enhanced Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-12">
                <ShoppingBag className="w-28 h-28 text-slate-700 relative" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-200 mb-3">Your cart is empty</h2>
            <p className="text-slate-400 mb-8 text-center max-w-md text-lg">
              Start your sneaker journey! Explore our authentic collection and find your perfect pair.
            </p>
            <Link
              to="/shop-now"
              className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                Explore Collection
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trust Badges - Enhanced */}
              <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-5 shadow-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2.5 group cursor-default">
                    <div className="p-2.5 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                      <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-300 text-center leading-tight">
                      100% Authentic
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2.5 group cursor-default">
                    <div className="p-2.5 bg-sky-500/10 rounded-xl group-hover:bg-sky-500/20 transition-colors">
                      <Truck className="w-6 h-6 text-sky-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-300 text-center leading-tight">
                      Free Shipping
                      <br />
                      <span className="text-sky-400">Rs.15k+</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2.5 group cursor-default">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                      <Lock className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-300 text-center leading-tight">
                      Secure Payment
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Progress Bar */}
              {shipping > 0 && remainingForFreeShipping > 0 && (
                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Tag className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-amber-300 mb-1">
                        You're close to FREE shipping! 🎉
                      </h3>
                      <p className="text-xs text-amber-200/80">
                        Add <span className="font-bold text-amber-300">Rs. {remainingForFreeShipping.toLocaleString()}</span> more to unlock free delivery
                      </p>
                    </div>
                  </div>
                  <div className="relative h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 transition-all duration-700 ease-out shadow-lg shadow-amber-500/50"
                      style={{ width: `${shippingProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Free Shipping Achieved */}
              {shipping === 0 && subtotal >= 15000 && (
                <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/30 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-green-300 mb-0.5">
                        Free Shipping Unlocked! ✓
                      </h3>
                      <p className="text-xs text-green-200/80">
                        You're saving Rs. 250 on delivery
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-4">
                {items.map((item) => {
                  const itemKey = `${item.productId}-${item.variantId}`;
                  const isRemoving = removingId === itemKey;
                  
                  return (
                    <div
                      key={itemKey}
                      className={`group bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/10 ${
                        isRemoving ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex gap-5">
                          {/* Product Image with Enhanced Styling */}
                          <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-lg">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                />
                              ) : (
                                <Package className="w-12 h-12 text-slate-600" />
                              )}
                            </div>
                            {/* Authenticity Badge - Enhanced */}
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-lg border border-green-400/50">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                AUTH
                              </span>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                {/* Brand Name */}
                                <div className="text-[11px] text-sky-400 uppercase tracking-[0.2em] font-bold mb-1.5">
                                  {item.brandName || "Premium Brand"}
                                </div>
                                
                                {/* Product Name */}
                                <h3 className="text-lg md:text-xl font-bold text-slate-50 mb-3 leading-tight line-clamp-2 group-hover:text-sky-400 transition-colors">
                                  {item.name}
                                </h3>
                                
                                {/* Size and Color Tags */}
                                <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 backdrop-blur-sm rounded-lg text-slate-300 border border-slate-700/50">
                                    <span className="text-xs text-slate-500 font-medium">Size</span>
                                    <span className="font-bold text-slate-100">{item.size || "N/A"}</span>
                                  </span>
                                  {item.color && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 backdrop-blur-sm rounded-lg text-slate-300 border border-slate-700/50">
                                      <span className="text-xs text-slate-500 font-medium">Color</span>
                                      <span className="font-bold text-slate-100">{item.color}</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {/* Wishlist Button (Optional) */}
                                <button
                                  className="p-2.5 text-slate-500 hover:text-pink-400 hover:bg-pink-400/10 rounded-lg transition-all duration-300 group/heart"
                                  aria-label="Add to wishlist"
                                >
                                  <Heart className="w-5 h-5 group-hover/heart:scale-110 transition-transform" />
                                </button>

                                {/* Remove Button */}
                                <button
                                  onClick={() => handleRemove(item.productId, item.variantId)}
                                  className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300 group/trash"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                                </button>
                              </div>
                            </div>

                            {/* Quantity and Price Row */}
                            <div className="flex items-end justify-between gap-4 pt-3 border-t border-slate-800/50">
                              {/* Quantity Selector - Enhanced */}
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Qty</span>
                                <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50">
                                  <button
                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-sky-400 active:scale-95"
                                  >
                                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                                  </button>
                                  <span className="text-base font-bold text-slate-100 w-10 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                    disabled={item.quantity >= 10}
                                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-sky-400 active:scale-95"
                                  >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>

                              {/* Price - Enhanced */}
                              <div className="text-right">
                                <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                                  Rs. {Number(item.price * item.quantity).toLocaleString()}
                                </div>
                                {item.quantity > 1 && (
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    Rs. {Number(item.price).toLocaleString()} × {item.quantity}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary - Right Side (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                {/* Order Summary Card - Enhanced */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-b border-slate-800/50 px-6 py-5">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-sky-500/20 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-sky-400" />
                      </div>
                      Order Summary
                    </h2>
                  </div>

                  {/* Summary Details */}
                  <div className="p-6 space-y-4">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-sm font-medium">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                      <span className="text-base font-bold text-slate-100">Rs. {Number(subtotal).toLocaleString()}</span>
                    </div>
                    
                    {/* Shipping */}
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Truck className="w-4 h-4 text-sky-400" />
                        Shipping
                        {shipping === 0 && (
                          <span className="text-xs text-green-400 font-bold px-2 py-0.5 bg-green-400/10 rounded-full border border-green-400/30">
                            FREE
                          </span>
                        )}
                      </span>
                      <span className="text-base font-bold text-slate-100">
                        {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}
                      </span>
                    </div>

                    {/* Savings (if applicable) */}
                    {savingsAmount > 0 && (
                      <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-green-400">
                          <Tag className="w-4 h-4" />
                          You're Saving
                        </span>
                        <span className="text-base font-bold text-green-400">
                          Rs. {savingsAmount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="relative py-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-slate-900 px-3 text-xs text-slate-600">TOTAL</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/30 rounded-xl p-4">
                      <span className="text-lg font-bold text-slate-100">Total Amount</span>
                      <span className="text-3xl font-black bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                        Rs. {Number(finalTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className={`group relative w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                        isCheckingOut ? 'animate-pulse' : ''
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <Lock className="w-5 h-5" />
                        <span className="text-lg">
                          {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </button>

                    <p className="text-xs text-center text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      Secure checkout with SSL encryption
                    </p>
                  </div>
                </div>

                {/* Trust Indicators - Enhanced */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    Why Shop With Us
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 group cursor-default">
                      <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-200 mb-0.5">100% Authentic</h4>
                        <p className="text-xs text-slate-500">Verified genuine products only</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group cursor-default">
                      <div className="p-2 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20 transition-colors flex-shrink-0">
                        <Truck className="w-5 h-5 text-sky-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-200 mb-0.5">Fast Delivery</h4>
                        <p className="text-xs text-slate-500">Free shipping on orders Rs.15k+</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group cursor-default">
                      <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
                        <Lock className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-200 mb-0.5">Secure Payment</h4>
                        <p className="text-xs text-slate-500">Your data is always protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}