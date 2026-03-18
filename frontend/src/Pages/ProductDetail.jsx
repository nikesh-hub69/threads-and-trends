// src/Pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api, { getImageUrl } from "../api";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { useWishlist } from "../WishlistContext";
import SizeRecommender from "../components/SizeRecommender";
import ShoeCareTips from "../components/ShoeCareTips";
import ShoeViewer3D from "../components/ShoeViewer3D";
import ShoeARTryOn from "../components/ShoeARTryOn";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Package,
  Truck,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  Award,
  Box,
  Camera,
} from "lucide-react";

function LoginRequiredModal({ open, onClose, onLogin }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full p-8 mx-4 animate-scaleIn">
        <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-sky-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-50 mb-3 text-center">
          Login Required
        </h2>
        <p className="text-slate-300 mb-6 text-center leading-relaxed">
          Create an account or sign in to add products to your cart and wishlist.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-sky-500/50 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [show3D, setShow3D]                 = useState(false);
  const [showAR, setShowAR]                 = useState(false);

  const requireLogin = () => {
    if (!user) { setShowLoginModal(true); return false; }
    return true;
  };

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct]               = useState(null);
  const [loading, setLoading]               = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [justAdded, setJustAdded]           = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/catalog/products/${slug}/`);
        setProduct(res.data);
        const variants = res.data.variants || [];
        const firstAvailable =
          variants.find((v) => v.is_active && Number(v.stock || 0) > 0) ||
          variants[0] ||
          null;
        setSelectedVariantId(firstAvailable ? firstAvailable.id : null);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const selectedVariant =
    product?.variants?.find((v) => v.id === selectedVariantId) || null;

  const productImages = product?.images || [];
  const allImages =
    productImages.length > 0
      ? productImages.map((img) => getImageUrl(img.image))
      : product?.main_image
      ? [getImageUrl(product.main_image)]
      : [];

  const currentImage = allImages[selectedImageIndex] || null;

  const wishlistItem = useMemo(() => {
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brandName: product.brand?.name || "",
      price: Number(product.base_price || 0),
      image: currentImage,
      gender: product.gender,
    };
  }, [product, currentImage]);

  const wishlisted = product ? isInWishlist(product.id) : false;
  const inCart =
    product && selectedVariant ? isInCart(product.id, selectedVariant.id) : false;

  const handleAddToCart = () => {
    if (!requireLogin()) return;
    if (!product || !selectedVariant) return;
    if (!selectedVariant.is_active || Number(selectedVariant.stock || 0) <= 0) return;

    const rawPrice =
      selectedVariant.price !== null && selectedVariant.price !== undefined
        ? selectedVariant.price
        : product.base_price;

    addToCart({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      brandName: product.brand?.name || "",
      size: selectedVariant.size,
      price: Number(rawPrice),
      quantity: 1,
      image: currentImage,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const applyRecommendedSize = (rec) => {
    const target = String(rec?.eu ?? "").replace(/[^\d.]/g, "");
    if (!target || !product?.variants?.length) return;
    const variants = product.variants;
    const exact = variants.find((v) => String(v.size).includes(target));
    if (exact?.id) { setSelectedVariantId(exact.id); return; }
    const t = Number(target);
    if (!Number.isFinite(t)) return;
    let best = null, bestDiff = Infinity;
    for (const v of variants) {
      const vn = Number(String(v.size).replace(/[^\d.]/g, ""));
      if (!Number.isFinite(vn)) continue;
      const diff = Math.abs(vn - t);
      if (diff < bestDiff) { bestDiff = diff; best = v; }
    }
    if (best?.id) setSelectedVariantId(best.id);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-300 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6">This product doesn't exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const isVariantActive = Boolean(selectedVariant?.is_active);
  const inStock         = Number(selectedVariant?.stock || 0) > 0;
  const canAddToCart    = Boolean(selectedVariant) && isVariantActive && inStock;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

      {/* ── Toast ── */}
      {justAdded && (
        <div className="fixed top-24 right-4 z-50 animate-slideInRight">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl shadow-green-500/50 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Added to cart!</span>
          </div>
        </div>
      )}

      {/* ── 3D Viewer Modal ── */}
      {show3D && (
        <ShoeViewer3D
          modelUrl={product.model_3d || "/models/shoe.glb"}
          onClose={() => setShow3D(false)}
          shoeName={product.name}
        />
      )}

      {/* ── AR Try-On Modal ── */}
      {showAR && (
        <ShoeARTryOn
          shoeImage={currentImage}
          shoeName={product.name}
          onClose={() => setShowAR(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

        {/* Back */}
        <Link to="/" className="group inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors mb-6">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Products</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-4">
            <div className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="text-slate-500">No image available</div>
              )}

              {/* Authenticity Badge */}
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                100% Authentic
              </div>

              {/* View in 3D pill — bottom of image */}
              <button
                onClick={() => setShow3D(true)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-black/70 hover:bg-sky-500 border border-white/20 hover:border-sky-400 text-white text-sm font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/30 whitespace-nowrap"
              >
                <Box className="w-4 h-4" />
                View in 3D
              </button>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === idx
                        ? "border-sky-400 scale-105"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ── AR + 3D quick-access row under thumbnails ── */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShow3D(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-purple-700/40 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300 text-sm font-semibold"
              >
                <Box className="w-4 h-4" />
                View in 3D
              </button>
              <button
                onClick={() => setShowAR(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-orange-700/40 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300 text-sm font-semibold"
              >
                <Camera className="w-4 h-4" />
                AR Try-On
              </button>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="space-y-6">

            {/* Brand & Category */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{product.brand?.name}</span>
              <span className="text-slate-700">•</span>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{product.category?.name}</span>
            </div>

            {/* Name */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-50 mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full">
                <span className="text-xs font-semibold text-slate-400">
                  {product.gender === "M" ? "👨 Men's" : product.gender === "W" ? "👩 Women's" : "🌟 Unisex"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-sky-400">
                Rs. {Number(product.base_price).toLocaleString()}
              </span>
              {selectedVariant?.price && selectedVariant.price !== product.base_price && (
                <span className="text-2xl font-semibold text-slate-500 line-through">
                  Rs. {Number(selectedVariant.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-slate-300 leading-relaxed border-l-2 border-sky-500/30 pl-4">
                {product.description}
              </p>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 text-center">
                <ShieldCheck className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-xs text-slate-400">Authentic</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 text-center">
                <Truck className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <div className="text-xs text-slate-400">Free Ship</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 text-center">
                <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-slate-400">Premium</div>
              </div>
            </div>

            {/* Size Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Select Size</h3>
                  {selectedVariant && (
                    <span className="text-xs text-slate-500">
                      {Number(selectedVariant.stock || 0) > 0 ? `${selectedVariant.stock} in stock` : "Out of stock"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariantId;
                    const isOut = Number(variant.stock || 0) === 0 || !variant.is_active;
                    return (
                      <button
                        key={variant.id}
                        disabled={isOut}
                        onClick={() => { if (!isOut) setSelectedVariantId(variant.id); }}
                        className={`relative px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          isOut
                            ? "bg-slate-800/30 border border-slate-700/30 text-slate-600 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-sky-500 border-2 border-sky-400 text-white shadow-lg shadow-sky-500/30 scale-105"
                            : "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-sky-500/50 hover:text-sky-300"
                        }`}
                      >
                        {variant.size}
                        {isSelected && !isOut && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {!selectedVariant && (
                  <p className="text-xs text-amber-400 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Please select a size to continue
                  </p>
                )}
              </div>
            )}

            {/* Size Recommender */}
            <SizeRecommender onPickSize={applyRecommendedSize} />

            {/* Action Buttons */}
            <div className="space-y-3">

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart && user}
                className={`group w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  !user || canAddToCart
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-[1.02]"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {!user ? (
                    <><ShoppingCart className="w-5 h-5" />Log in to Purchase<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  ) : inCart ? (
                    <><CheckCircle2 className="w-5 h-5" />Added to Cart</>
                  ) : canAddToCart ? (
                    <><ShoppingCart className="w-5 h-5" />Add to Cart<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  ) : !selectedVariant ? "Select a Size First" : "Currently Unavailable"}
                </span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => { if (!requireLogin()) return; if (wishlistItem) toggleWishlist(wishlistItem); }}
                className={`group w-full py-4 rounded-xl font-semibold border-2 transition-all duration-300 ${
                  !user
                    ? "border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500/10"
                    : wishlisted
                    ? "border-pink-500 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                    : "border-slate-700 text-slate-300 hover:border-pink-400 hover:text-pink-400"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
                  {!user ? "Log in to Save" : wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                </span>
              </button>

              {/* View in 3D + AR Try-On side by side */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShow3D(true)}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold border-2 border-purple-700/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300"
                >
                  <Box className="w-5 h-5" />
                  View in 3D
                </button>
                <button
                  onClick={() => setShowAR(true)}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold border-2 border-orange-700/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300"
                >
                  <Camera className="w-5 h-5" />
                  AR Try-On
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">Ships within 24-48 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-300">Free delivery on orders over Rs. 15,000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300">Earn loyalty points with this purchase</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300">
                    30-day returns •{" "}
                    <Link to="/refund-policy" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors">
                      View refund policy
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shoe Care Tips */}
        <div className="mt-16">
          <ShoeCareTips
            cleaning={product?.care_cleaning}
            storage={product?.care_storage}
            maintenance={product?.care_maintenance}
            fallbackName={product?.name}
          />
        </div>
      </div>

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => { setShowLoginModal(false); navigate("/login", { state: { from: location.pathname } }); }}
      />

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn        { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn       { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        .animate-fadeIn       { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn      { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </main>
  );
}

export default ProductDetail;