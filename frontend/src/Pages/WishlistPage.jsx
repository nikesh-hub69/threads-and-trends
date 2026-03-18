// src/Pages/WishlistPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../WishlistContext";
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  Tag,
  TrendingUp,
  Sparkles,
  X,
  ShoppingCart
} from "lucide-react";
import { useState } from "react";

function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistItems = [], removeFromWishlist, clearWishlist } = useWishlist();
  const [removingId, setRemovingId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromWishlist(id);
      setRemovingId(null);
    }, 300);
  };

  const handleClearAll = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl border border-pink-500/30">
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-50 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-slate-400 mt-1">
                {wishlistItems.length === 0 
                  ? "No saved items yet" 
                  : `${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'} saved`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {wishlistItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/30 text-slate-300 text-sm font-semibold hover:border-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Clear Wishlist?</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Are you sure you want to remove all {wishlistItems.length} items from your wishlist? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-12">
                <Heart className="w-28 h-28 text-slate-700 relative" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-200 mb-3">Your Wishlist is Empty</h2>
            <p className="text-slate-400 mb-8 text-center max-w-md text-lg">
              Save your favorite sneakers here! Click the heart icon on any product to add it to your wishlist.
            </p>
            <Link
              to="/shop-now"
              className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Discover Sneakers
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-100">{wishlistItems.length}</div>
                    <div className="text-xs text-slate-500">Saved Items</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/10 rounded-lg">
                    <Tag className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-100">
                      Rs. {wishlistItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">Total Value</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-100">
                      Rs. {Math.floor(wishlistItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0) / wishlistItems.length).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">Avg. Price</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-100">
                      {new Set(wishlistItems.map(item => item.brandName)).size}
                    </div>
                    <div className="text-xs text-slate-500">Brands</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                const isRemoving = removingId === item.id;
                
                return (
                  <article
                    key={item.id}
                    className={`group bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 hover:border-sky-500/30 backdrop-blur-sm ${
                      isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-slate-900">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <ShoppingBag className="w-16 h-16 text-slate-700" />
                        </div>
                      )}
                      
                      {/* Remove Button Overlay */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        aria-label="Remove from wishlist"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Wishlist Badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full flex items-center gap-1.5">
                        <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                        <span className="text-xs font-bold text-pink-300">Saved</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3">
                      {/* Brand & Gender */}
                      <div className="text-[11px] uppercase tracking-[0.15em] font-bold text-sky-400">
                        {item.brandName || "Premium Brand"}
                        {item.genderLabel && <span className="text-slate-600"> • {item.genderLabel}</span>}
                      </div>

                      {/* Product Name */}
                      <Link 
                        to={`/products/${item.slug}`}
                        className="group/link"
                      >
                        <h3 className="text-base font-bold text-slate-100 line-clamp-2 leading-tight group-hover/link:text-sky-400 transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                        <span className="text-xl font-black bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                          Rs. {Number(item.price || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-2">
                        <Link
                          to={`/products/${item.slug}`}
                          className="flex-1 text-sm font-bold py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-center transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-2 group/btn"
                        >
                          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          View
                        </Link>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="px-3 py-2.5 rounded-xl border border-slate-700/50 text-slate-400 hover:border-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 group/remove"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}

export default WishlistPage;