// src/Pages/ShopNowPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../api";

function genderLabel(g) {
  return g === "M" ? "Men" : g === "W" ? "Women" : "Unisex";
}

// ✅ supports BOTH API shapes
const getBrandName = (p) => p?.brand?.name || p?.brand_name || "";
const getCategoryName = (p) => p?.category?.name || p?.category_name || "";

function ProductCard({ product }) {
  return (
    <article className="group relative rounded-3xl border-2 border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-sm overflow-hidden hover:border-sky-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-2">
      {/* Image */}
      <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/60 h-72 flex items-center justify-center overflow-hidden">
        {product.main_image ? (
          <img
            src={getImageUrl(product.main_image)}
            alt={product.name}
            className="w-full h-full object-contain p-6 group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-slate-600 font-medium">No image</span>
          </div>
        )}

        {/* Badges */}
        {(product.is_new || product.on_sale || product.is_best_seller) && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/50 animate-pulse-subtle">
                NEW
              </span>
            )}
            {product.on_sale && (
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/50">
                SALE
              </span>
            )}
            {product.is_best_seller && (
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                BEST
              </span>
            )}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 text-xs font-black text-sky-400 uppercase tracking-wide">
          <span>{getBrandName(product)}</span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-500">{getCategoryName(product)}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-black text-lg text-slate-100 line-clamp-2 leading-tight group-hover:text-sky-300 transition-colors min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Price & Gender */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div>
            <div className="text-2xl font-black text-slate-50">
              ₨{Number(product.base_price || 0).toLocaleString()}
            </div>
            {product.original_price && product.original_price > product.base_price && (
              <div className="text-sm text-slate-500 line-through font-semibold">
                ₨{Number(product.original_price).toLocaleString()}
              </div>
            )}
          </div>
          <span className="text-xs font-black px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400 uppercase tracking-wider">
            {genderLabel(product.gender)}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/products/${product.slug}`}
          className="block mt-4 w-full text-center py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-sm hover:from-sky-400 hover:to-cyan-400 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-200 group-hover:-translate-y-1"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default function ShopNowPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState("featured");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchShopNow = async () => {
      try {
        const res = await api.get("/catalog/products/shop-now/");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching Shop Now products", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShopNow();
  }, []);

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    const brands = new Set();
    items.forEach((p) => {
      const brand = getBrandName(p).toLowerCase();
      if (brand) brands.add(brand);
    });
    return Array.from(brands);
  }, [items]);

  // Filter products
  const filteredItems = useMemo(() => {
    return items.filter((product) => {
      // Brand filter
      if (selectedBrand !== "ALL") {
        const productBrand = getBrandName(product).toLowerCase();
        if (productBrand !== selectedBrand.toLowerCase()) return false;
      }

      // Gender filter
      if (selectedGender !== "ALL") {
        const productGender = String(product.gender || "").toUpperCase();
        if (productGender !== selectedGender) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = (product.name || "").toLowerCase();
        const brand = getBrandName(product).toLowerCase();
        const category = getCategoryName(product).toLowerCase();
        
        if (!name.includes(query) && !brand.includes(query) && !category.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedBrand, selectedGender, searchQuery]);

  // Sort filtered products
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];

    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => Number(a.base_price || 0) - Number(b.base_price || 0));
      case "price-desc":
        return list.sort((a, b) => Number(b.base_price || 0) - Number(a.base_price || 0));
      case "name-asc":
        return list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
      case "name-desc":
        return list.sort((a, b) => String(b.name || "").localeCompare(String(a.name || "")));
      case "newest":
        return list.sort((a, b) => {
          const da = Date.parse(a.created_at || a.created || a.updated_at || a.updated || 0) || 0;
          const db = Date.parse(b.created_at || b.created || b.updated_at || b.updated || 0) || 0;
          return db - da;
        });
      case "featured":
      default:
        return list;
    }
  }, [filteredItems, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrand("ALL");
    setSelectedGender("ALL");
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters = selectedBrand !== "ALL" || selectedGender !== "ALL" || searchQuery.trim() !== "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-subtle animation-delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-300">
            Shop Now
          </h1>
          <p className="mt-3 text-base text-slate-400 font-medium">
            Curated collection of premium sneakers — handpicked by our team
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in animation-delay-100">
          <div className="relative max-w-2xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/60 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all font-medium text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 border-2 border-slate-800/50 backdrop-blur-sm animate-fade-in animation-delay-200">
          <div className="space-y-6">
            {/* Brand Filter with Quick Picks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Filter by Brand
                </label>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedBrand("ALL")}
                  className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                    selectedBrand === "ALL"
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 scale-105"
                      : "bg-slate-800/60 text-slate-300 border-2 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 hover:scale-105"
                  }`}
                >
                  All Brands
                </button>

                {/* Quick Brand Picks - Always Visible */}
                {["Nike", "Jordan", "Adidas"].map((brand) => {
                  const hasBrand = availableBrands.includes(brand.toLowerCase());
                  return (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      disabled={!hasBrand}
                      className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                        selectedBrand === brand
                          ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 scale-105"
                          : hasBrand
                          ? "bg-slate-800/60 text-slate-300 border-2 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 hover:scale-105"
                          : "bg-slate-900/40 text-slate-600 border-2 border-slate-800 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {brand}
                      {!hasBrand && <span className="ml-2 text-xs">(0)</span>}
                    </button>
                  );
                })}

                {/* Other Brands */}
                {availableBrands
                  .filter((b) => !["nike", "jordan", "adidas"].includes(b))
                  .map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-5 py-3 rounded-xl font-bold text-sm transition-all capitalize ${
                        selectedBrand.toLowerCase() === brand
                          ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 scale-105"
                          : "bg-slate-800/60 text-slate-300 border-2 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 hover:scale-105"
                      }`}
                    >
                      {brand.charAt(0).toUpperCase() + brand.slice(1)}
                    </button>
                  ))}
              </div>
            </div>

            {/* Gender Filter & Sort */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Filter */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                  Filter by Gender
                </label>
                <div className="flex flex-wrap gap-3">
                  {["ALL", "M", "W"].map((g) => {
                    const label = g === "ALL" ? "All" : g === "M" ? "Men" : "Women";
                    return (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                          selectedGender === g
                            ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 scale-105"
                            : "bg-slate-800/60 text-slate-300 border-2 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 hover:scale-105"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-800/60 border-2 border-slate-700 text-slate-100 font-bold text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all cursor-pointer hover:bg-slate-800"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name-asc">Name: A → Z</option>
                  <option value="name-desc">Name: Z → A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-semibold text-lg">Loading products...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 px-6 rounded-2xl bg-slate-900/40 border-2 border-slate-800/50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/60 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg text-slate-300 font-bold mb-2">No Shop Now Products</p>
            <p className="text-slate-400 text-base">
              Tick <span className="font-bold text-slate-300">Shop Now</span> checkbox in Django admin to feature products here.
            </p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-24 px-6 rounded-2xl bg-slate-900/40 border-2 border-slate-800/50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/60 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl text-slate-300 font-bold mb-3">No products match your filters</p>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:from-sky-400 hover:to-cyan-400 shadow-lg shadow-sky-500/30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-slate-400">
                Showing <span className="text-sky-400 font-bold text-base">{sortedItems.length}</span> of{" "}
                <span className="text-slate-300 font-bold">{items.length}</span> products
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {sortedItems.map((p, idx) => (
                <div
                  key={p.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}