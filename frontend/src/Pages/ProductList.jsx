// src/Pages/ProductList.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../api";

import menCategoryImg from "../assets/men-category.jpg";
import womenCategoryImg from "../assets/women-category.jpg";
import heroBanner from "../assets/hero-banner.jpg";
import hero2 from "../assets/hero-banner-2.jpg";
import hero3 from "../assets/hero-banner-3.jpg";

import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";



// ✅ supports BOTH API shapes:
const getBrandName = (p) => p?.brand?.name || p?.brand_name || "";
const getCategoryName = (p) => p?.category?.name || p?.category_name || "";

// ✅ supports BOTH list shapes:
const asList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

const normGender = (g) => {
  if (!g) return "";
  const s = String(g).toLowerCase();
  if (s === "m" || s === "men") return "M";
  if (s === "w" || s === "women") return "W";
  if (s === "u" || s === "unisex") return "U";
  if (s === "all") return "ALL";
  return String(g);
};

// ✅ merge helper (unique by id, fallback slug)
const mergeUnique = (a = [], b = []) => {
  const map = new Map();
  [...a, ...b].forEach((p) => {
    const key = p?.id ?? p?.slug;
    if (key == null) return;
    if (!map.has(key)) map.set(key, p);
  });
  return Array.from(map.values());
};

function ProductList({
  genderFilter = null,
  title = "Latest Drops",
  showHero = true,
  showFilters = true,
  includeShopNowInMainList = false,
  showCategorySection = true,
  showBestSellersSection = true,
  showTestimonialsSection = true,
  showFooterSection = true,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const [bestLoading, setBestLoading] = useState(true);


  // UI filters
  const [selectedGender, setSelectedGender] = useState(genderFilter || "ALL");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedGender(genderFilter || "ALL");
  }, [genderFilter]);

  // ✅ HERO SLIDER
  const heroSlides = useMemo(
    () => [
      { img: heroBanner, alt: "Threads & Trends hero 1" },
      { img: hero2, alt: "Threads & Trends hero 2" },
      { img: hero3, alt: "Threads & Trends hero 3" },
    ],
    []
  );

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const resumeTimerRef = useRef(null);

  const resumeAfter = (ms = 7000) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setHeroPaused(false), ms);
  };

  const goPrev = () => {
    if (!heroSlides.length) return;
    setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);
    setHeroPaused(true);
    resumeAfter(7000);
  };

  const goNext = () => {
    if (!heroSlides.length) return;
    setHeroIndex((i) => (i + 1) % heroSlides.length);
    setHeroPaused(true);
    resumeAfter(7000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showHero || title !== "Latest Drops") return;
    if (!heroSlides.length) return;
    if (heroPaused) return;

    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 3500);

    return () => clearInterval(id);
  }, [showHero, title, heroSlides.length, heroPaused]);

  // ✅ MAIN PRODUCTS FETCH
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (includeShopNowInMainList) {
          const [resA, resB] = await Promise.all([
            api.get("/catalog/products/"),
            api.get("/catalog/products/shop-now/"),
          ]);
          const listA = asList(resA.data);
          const listB = asList(resB.data);
          setProducts(mergeUnique(listA, listB));
        } else {
          const res = await api.get("/catalog/products/");
          setProducts(asList(res.data));
        }
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [includeShopNowInMainList]);

  // ✅ Best sellers
  useEffect(() => {
    if (!showBestSellersSection) return;

    const fetchBest = async () => {
      setBestLoading(true);
      try {
        const res = await api.get("/catalog/products/best-sellers/");
        const list = asList(res.data);
        setBestSellers(list.slice(0, 4));
      } catch (err) {
        console.error("Error fetching best sellers", err);
        setBestSellers([]);
      } finally {
        setBestLoading(false);
      }
    };

    fetchBest();
  }, [showBestSellersSection]);

  // ✅ Unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => getBrandName(p)).filter(Boolean)));
  }, [products]);

  // ✅ Filter products
  const filteredProducts = useMemo(() => {
    const gf = genderFilter && String(genderFilter).toUpperCase() !== "ALL" ? genderFilter : null;

    return products.filter((product) => {
      const g = normGender(product.gender);

      if (gf && g !== normGender(gf)) return false;
      if (selectedGender !== "ALL" && g !== selectedGender) return false;
      if (selectedBrand !== "ALL" && getBrandName(product) !== selectedBrand) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (product.name || "").toLowerCase();
        const brandName = getBrandName(product).toLowerCase();
        const categoryName = getCategoryName(product).toLowerCase();
        if (!name.includes(q) && !brandName.includes(q) && !categoryName.includes(q)) return false;
      }

      return true;
    });
  }, [products, genderFilter, selectedGender, selectedBrand, searchQuery]);

  const genderLabel = (g) => (g === "M" ? "Men" : g === "W" ? "Women" : "Unisex");

  const ProductCard = ({ product }) => (
    <div className="group block rounded-3xl border-2 border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-sm overflow-hidden hover:border-sky-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-2">
      <Link to={`/products/${product.slug}`}>
        {/* Image Container */}
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
          <div className="flex items-center gap-2 text-xs font-black text-sky-400 uppercase tracking-wide">
            <span>{getBrandName(product)}</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">{getCategoryName(product)}</span>
          </div>

          <h3 className="font-black text-lg text-slate-100 line-clamp-2 leading-tight group-hover:text-sky-300 transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>

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

          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-400">
              <span>View Details</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <main className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* HERO */}
      {showHero && title === "Latest Drops" && (
        <section className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse-subtle animation-delay-1000"></div>
          </div>

         <div className="container-wide py-12 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 animate-fadeIn">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                    Elevate the game with
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.05] tracking-tight">
                  <span className="text-slate-100">Threads</span>{" "}
                  <span className="text-sky-400">&</span>{" "}
                  <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Trends</span>
                </h1>

                <p className="text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed">
                  Discover curated, authentic sneakers for Nepal. From everyday pairs to hype drops, your next favourite sneaker is here.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    to="/shop-now"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:from-sky-400 hover:to-cyan-400 transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-400/40 hover:-translate-y-0.5"
                  >
                    <span>Shop Now</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all"
                  >
                    Learn More
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm text-slate-400">100% Authentic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-slate-400">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm text-slate-400">Curated Selection</span>
                  </div>
                </div>
              </div>

              {/* Right Slider */}
              <div className="relative animate-fadeIn animate-delay-200">
                <div
                  className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800/50 shadow-2xl shadow-slate-950/50"
                  onMouseEnter={() => setHeroPaused(true)}
                  onMouseLeave={() => {
                    setHeroPaused(false);
                    resumeAfter(3500);
                  }}
                >
                  {heroSlides.map((s, idx) => {
                    const active = idx === heroIndex;
                    return (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          active ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <img
                          src={s.img}
                          alt={s.alt}
                          className={`w-full h-full object-cover select-none pointer-events-none transition-transform duration-[6000ms] ease-out ${
                            active ? "scale-[1.08]" : "scale-100"
                          }`}
                          draggable="false"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-200 hover:text-sky-300 hover:border-sky-500/60 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-200 hover:text-sky-300 hover:border-sky-500/60 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Next slide"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setHeroIndex(idx);
                          setHeroPaused(true);
                          resumeAfter(7000);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          idx === heroIndex 
                            ? "w-8 bg-gradient-to-r from-sky-400 to-cyan-400 shadow-lg shadow-sky-400/50" 
                            : "w-2 bg-slate-400/60 hover:bg-slate-300/80"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
       </section>
      )}

      {/* MAIN LIST SECTION */}
      <section id="latest-drops" className="w-full py-16 lg:py-24">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-100 tracking-tight">{title}</h2>
              <p className="text-base text-slate-400 mt-3 font-medium">Browse our curated collection of premium sneakers</p>
            </div>

            <div className="relative w-full md:w-80">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search sneakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/60 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 border-2 border-slate-800/50 backdrop-blur-sm">
              <div className="space-y-6">
                {(!genderFilter || String(genderFilter).toUpperCase() === "ALL") && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Gender</label>
                    <div className="flex flex-wrap gap-3">
                      {["ALL", "M", "W", "U"].map((g) => {
                        const label = g === "ALL" ? "All" : g === "M" ? "Men" : g === "W" ? "Women" : "Unisex";
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
                )}

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Brand</label>
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
                    {brands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                          selectedBrand === b 
                            ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 scale-105" 
                            : "bg-slate-800/60 text-slate-300 border-2 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 hover:scale-105"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-semibold text-lg">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-900/60 border-2 border-slate-800 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl text-slate-300 font-bold mb-2">No products found</p>
              <p className="text-slate-400">Try changing your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <div 
                  key={product.id} 
                  className="animate-fadeIn"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      {showCategorySection && (
        <section className="w-full py-16 lg:py-24 bg-slate-900/30 border-y border-slate-800/50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-100 mb-4 tracking-tight">Shop by Category</h2>
              <p className="text-lg text-slate-400 font-medium">Explore collections designed for everyone</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Link 
                to="/men" 
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800/50 hover:border-sky-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/30 hover:-translate-y-3"
              >
                <div className="aspect-[3/5] overflow-hidden">
                  <img src={menCategoryImg} alt="Men's Collection" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <div className="text-4xl font-black text-white mb-3 group-hover:text-sky-300 transition-colors">Men</div>
                  <div className="text-base text-slate-300 font-semibold mb-4">Explore Men's Sneakers</div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-4">
                    <span>Shop Now</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link 
                to="/women" 
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800/50 hover:border-fuchsia-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-500/30 hover:-translate-y-3"
              >
                <div className="aspect-[3/5] overflow-hidden">
                  <img src={womenCategoryImg} alt="Women's Collection" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <div className="text-4xl font-black text-white mb-3 group-hover:text-fuchsia-300 transition-colors">Women</div>
                  <div className="text-base text-slate-300 font-semibold mb-4">Explore Women's Sneakers</div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-4">
                    <span>Shop Now</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      {showBestSellersSection && (
        <section className="w-full py-16 lg:py-24">
          <div className="container-wide">
            <div className="flex items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-100 mb-3 tracking-tight">Best Sellers</h2>
                <p className="text-lg text-slate-400 font-medium">Most loved pairs — updated regularly</p>
              </div>
              <Link 
                to="/shop-now" 
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/60 border-2 border-slate-800 hover:border-sky-500/50 text-sm font-bold text-sky-400 hover:text-sky-300 transition-all hover:scale-105 group"
              >
                <span>View All</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {bestLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
              </div>
            ) : bestSellers.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-2xl bg-slate-900/40 border-2 border-slate-800/50">
                <p className="text-slate-400 text-base">
                  No best sellers yet. Mark products as <span className="font-bold text-slate-300">Best Seller</span> in Django admin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestSellers.map((p, idx) => (
                  <div 
                    key={p.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {showTestimonialsSection && <Testimonials />}
      {showFooterSection && <Footer />}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        .animate-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}

export default ProductList;