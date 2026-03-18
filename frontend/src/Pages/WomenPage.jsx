// src/Pages/WomenPage.jsx
import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import { ChevronRight, Heart, Sparkles, Award, ArrowDown, Star } from "lucide-react";

export default function WomenPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("women-products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Page Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full mb-4">
            <Heart className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-semibold text-fuchsia-300">Women's Collection</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-50 mb-4 tracking-tight">
            Style That <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400">Speaks</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Discover sneakers that blend comfort, style, and confidence for every moment
          </p>
        </div>

        {/* HERO SECTION */}
        <section className={`group relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} hover:border-slate-700/50 hover:shadow-fuchsia-500/10`}>
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>

          <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12 p-8 md:p-12">
            {/* Left: Text Content */}
            <div className="flex-1 flex flex-col justify-center space-y-6 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider">
                    Women's Collection
                  </span>
                </div>
              </div>

              {/* Heading */}
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-50 leading-tight mb-4">
                  Explore Women's
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400">
                    Footwear Collection
                  </span>
                </h2>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl">
                Street-ready, minimal or hype pairs — curated sneakers for every outfit, mood and
                occasion. Find your next favourite pair that matches your unique style and energy.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Trending</div>
                    <div className="text-sm font-bold text-slate-200">Styles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                    <span className="text-pink-400 font-bold">✓</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Premium</div>
                    <div className="text-sm font-bold text-slate-200">Quality</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Curated</div>
                    <div className="text-sm font-bold text-slate-200">Selection</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={scrollToProducts}
                  className="group/btn relative px-8 py-4 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Shop Collection
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={scrollToProducts}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-slate-200 font-semibold rounded-xl hover:bg-white/10 hover:border-fuchsia-400/30 transition-all duration-300"
                >
                  View All Styles
                </button>
              </div>
            </div>

            {/* Right: Image Gallery */}
            <div className="flex-1 relative">
              <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[320px] md:h-[400px] lg:h-[480px]">
                {/* Tall Left Image */}
                <div className="col-span-3 row-span-6 rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 relative group/img">
                  <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80"
                    alt="Women's street style sneakers"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white font-bold text-sm opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Street Style
                  </div>
                </div>

                {/* Top Right Image */}
                <div className="col-span-3 row-span-3 rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 relative group/img">
                  <img
                    src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80"
                    alt="Women's sneaker outfit moment"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 left-3 text-white font-bold text-xs opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Outfit Ready
                  </div>
                </div>

                {/* Bottom Right Image */}
                <div className="col-span-3 row-span-3 rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 relative group/img">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                    alt="Women's sneakers close-up detail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 left-3 text-white font-bold text-xs opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Premium Quality
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-fuchsia-500/50 animate-float hidden lg:flex">
                <div className="text-center">
                  <div className="text-white font-black text-lg">HOT</div>
                  <div className="text-white/80 text-xs font-semibold">2024</div>
                </div>
              </div>

              {/* Decorative hearts */}
              <div className="absolute top-8 -left-4 text-fuchsia-400/20 animate-pulse hidden lg:block">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <div className="absolute bottom-8 -right-2 text-pink-400/20 animate-pulse delay-500 hidden lg:block">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-500 hover:text-fuchsia-400 transition-colors cursor-pointer" onClick={scrollToProducts}>
            <span className="text-xs font-semibold uppercase tracking-wider">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>
        </section>

        {/* Highlights Bar */}
        <div className={`mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {[
            { label: "Latest Trends", icon: "✨", color: "fuchsia" },
            { label: "Premium Brands", icon: "👟", color: "pink" },
            { label: "Free Shipping", icon: "💝", color: "rose" },
            { label: "100% Authentic", icon: "💎", color: "purple" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 text-center hover:border-${item.color}-500/30 hover:bg-slate-900/70 transition-all duration-300 group`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className={`text-sm font-semibold text-slate-300 group-hover:text-${item.color}-400 transition-colors`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Style Categories Preview */}
        <div className={`mt-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">Shop by Style</h3>
            <p className="text-slate-400">Find the perfect vibe for your collection</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Casual", emoji: "👟", gradient: "from-fuchsia-500/20 to-pink-500/20" },
              { name: "Athletic", emoji: "⚡", gradient: "from-pink-500/20 to-rose-500/20" },
              { name: "Luxury", emoji: "💎", gradient: "from-rose-500/20 to-purple-500/20" },
              { name: "Limited", emoji: "🔥", gradient: "from-purple-500/20 to-fuchsia-500/20" },
            ].map((style, idx) => (
              <button
                key={idx}
                onClick={scrollToProducts}
                className={`group relative bg-gradient-to-br ${style.gradient} backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:border-fuchsia-400/30`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{style.emoji}</div>
                <div className="text-sm font-bold text-slate-200">{style.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        <section
          id="women-products"
          className={`mt-20 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-fuchsia-400 via-pink-400 to-rose-400 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
                Women's Sneakers Collection
              </h2>
            </div>
            <p className="text-slate-400 ml-7">
              Browse our complete collection of authentic women's footwear
            </p>
          </div>

          <ProductList
            genderFilter="W"
            title=""
            showHero={false}
            showFilters={true}
            includeShopNowInMainList={true}
            showCategorySection={false}
            showBestSellersSection={false}
            showTestimonialsSection={false}
            showFooterSection={true}
          />
        </section>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}