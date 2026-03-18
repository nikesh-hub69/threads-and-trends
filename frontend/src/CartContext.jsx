import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ShoppingCart, CheckCircle, AlertCircle, Info, X } from "lucide-react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    // Load cart from localStorage on initial mount
    try {
      const savedCart = localStorage.getItem("sneaker_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("sneaker_cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  // Show notification helper with auto-dismiss
  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotification({ message, type, id });
    
    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const addToCart = (newItem) => {
    const price = Number(newItem.price);
    const safeItem = { ...newItem, price: Number.isFinite(price) ? price : 0 };

    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === safeItem.productId && it.variantId === safeItem.variantId
      );

      if (idx !== -1) {
        const copy = [...prev];
        const newQuantity = (copy[idx].quantity || 1) + (safeItem.quantity || 1);
        
        // Prevent adding more than max quantity (10)
        if (newQuantity > 10) {
          showNotification("Maximum quantity is 10 per item", "warning");
          return prev;
        }

        copy[idx] = {
          ...copy[idx],
          quantity: newQuantity,
        };
        
        showNotification(`${safeItem.name} quantity updated to ${newQuantity}`, "success");
        return copy;
      }

      showNotification(`${safeItem.name} added to cart!`, "success");
      return [...prev, { ...safeItem, quantity: safeItem.quantity || 1 }];
    });
  };

  const removeFromCart = (productId, variantId) => {
    const item = items.find(
      (it) => it.productId === productId && it.variantId === variantId
    );
    
    setItems((prev) =>
      prev.filter((it) => !(it.productId === productId && it.variantId === variantId))
    );

    if (item) {
      showNotification(`${item.name} removed from cart`, "info");
    }
  };

  const updateQuantity = (productId, variantId, newQuantity) => {
    // Validate quantity
    if (newQuantity < 1 || newQuantity > 10) {
      if (newQuantity > 10) {
        showNotification("Maximum quantity is 10 items", "warning");
      }
      return;
    }

    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === productId && it.variantId === variantId
      );

      if (idx === -1) return prev;

      const copy = [...prev];
      const oldQuantity = copy[idx].quantity;
      
      copy[idx] = {
        ...copy[idx],
        quantity: newQuantity,
      };

      // Show notification for quantity changes
      if (newQuantity > oldQuantity) {
        showNotification(`Quantity increased to ${newQuantity}`, "success");
      } else if (newQuantity < oldQuantity) {
        showNotification(`Quantity decreased to ${newQuantity}`, "info");
      }

      return copy;
    });
  };

  const clearCart = () => {
    const itemCount = items.length;
    setItems([]);
    showNotification(`Cart cleared (${itemCount} items removed)`, "info");
  };

  const isInCart = (productId, variantId) => {
    return items.some(
      (it) => it.productId === productId && it.variantId === variantId
    );
  };

  const getItemQuantity = (productId, variantId) => {
    const item = items.find(
      (it) => it.productId === productId && it.variantId === variantId
    );
    return item ? item.quantity : 0;
  };

  // Calculate total quantity of items
  const totalQuantity = useMemo(
    () => items.reduce((sum, it) => sum + (it.quantity || 0), 0),
    [items]
  );

  // Calculate total price (subtotal)
  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 0), 0),
    [items]
  );

  // Calculate shipping (free over Rs. 15,000)
  const shippingCost = useMemo(
    () => (items.length > 0 && totalPrice < 15000 ? 250 : 0),
    [items.length, totalPrice]
  );

  // Final total (NO TAX - just price + shipping)
  const finalTotal = useMemo(
    () => totalPrice + shippingCost,
    [totalPrice, shippingCost]
  );

  // Calculate savings from free shipping
  const savings = useMemo(
    () => (shippingCost === 0 && totalPrice >= 15000 ? 250 : 0),
    [shippingCost, totalPrice]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        totalQuantity,
        totalPrice,
        shippingCost,
        finalTotal,
        savings,
        notification,
      }}
    >
      {children}
      {notification && <CartNotification notification={notification} onClose={() => setNotification(null)} />}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// Enhanced Toast Notification Component
function CartNotification({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Trigger exit animation before unmount
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => setIsVisible(false), 300);
    }, 3200);
    
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [notification.id]);

  const getStyles = () => {
    switch (notification.type) {
      case "success":
        return {
          gradient: "from-green-500 to-emerald-600",
          border: "border-green-400/50",
          bg: "bg-green-500/95",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "warning":
        return {
          gradient: "from-amber-500 to-orange-600",
          border: "border-amber-400/50",
          bg: "bg-amber-500/95",
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case "error":
        return {
          gradient: "from-red-500 to-rose-600",
          border: "border-red-400/50",
          bg: "bg-red-500/95",
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case "info":
      default:
        return {
          gradient: "from-sky-500 to-blue-600",
          border: "border-sky-400/50",
          bg: "bg-sky-500/95",
          icon: <Info className="w-5 h-5" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div
        className={`relative bg-gradient-to-r ${styles.gradient} backdrop-blur-xl border-2 ${styles.border} rounded-2xl shadow-2xl overflow-hidden min-w-[320px] max-w-md group`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <div className="relative px-5 py-4 flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white border border-white/30 shadow-lg">
            {styles.icon}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-white font-semibold text-sm leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white/60 transition-all duration-[3200ms] ease-linear"
            style={{
              width: isExiting ? "0%" : "100%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}