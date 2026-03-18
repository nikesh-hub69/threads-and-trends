// src/WishlistContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("tt_wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tt_wishlist", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const isInWishlist = (productId) => items.some((x) => x.id === productId);

  const addToWishlist = (item) => {
    setItems((prev) => {
      if (prev.some((x) => x.id === item.id)) return prev;
      return [item, ...prev];
    });
  };

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((x) => x.id !== productId));
  };

  const toggleWishlist = (item) => {
    setItems((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      return exists ? prev.filter((x) => x.id !== item.id) : [item, ...prev];
    });
  };

  const clearWishlist = () => setItems([]);

  const value = useMemo(
    () => ({
      wishlistItems: items,
      wishlistCount: items.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}