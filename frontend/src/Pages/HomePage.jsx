// src/Pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductList from "./ProductList";
import {
  TrendingUp,
  ShieldCheck,
  Truck,
  Award,
  Star,
  ChevronRight,
  Zap,
  Package,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider images/content
  const heroSlides = [
    {
      title: "Authentic Sneakers",
      subtitle: "100% Verified",
      description: "Every pair verified for authenticity. No fakes, just heat.",
      cta: "Shop Now",
      gradient: "from-sky-600 via-blue-600 to-purple-600",
      image: "🔥",
    },
    {
      title: "Latest Drops",
      subtitle: "Just Landed",
      description: "Get the newest releases before they sell out.",
      cta: "Browse Collection",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      image: "👟",
    },
    {
      title: "Premium Quality",
      subtitle: "Guaranteed",
      description: "Free shipping on orders over Rs. 15,000.",
      cta: "Start Shopping",
      gradient: "from-orange-600 via-red-600 to-pink-600",
      image: "✨",
    },
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Featured brands
  const brands = [
    { name: "Nike", icon: "✓" },
    { name: "Adidas", icon: "✓" },
    { name: "Jordan", icon: "✓" },
    { name: "Puma", icon: "✓" },
    { name: "New Balance", icon: "✓" },
    { name: "Converse", icon: "✓" },
  ];

  // Trust indicators
  const trustFeatures = [
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: "100% Authentic",
      description: "Every sneaker verified",
      color: "green",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Delivery",
      description: "On orders over Rs. 15k",
      color: "sky",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Only the best pairs",
      color: "purple",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Shipping",
      description: "3-5 business days",
      color: "amber",
    },
  ];

  // Quick stats
  const stats = [
    { value: "5000+", label: "Happy Customers" },
    { value: "10000+", label: "Sneakers Sold" },
    { value: "50+", label: "Brands Available" },
    { value: "100%", label: "Authentic Guarantee" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section with Slider */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            {/* Slide Content */}
            <div className="mb-8 animate-fadeIn" key={currentSlide}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6 animate-slideDown">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-slate-200">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r mb-6 animate-slideUp">
                <span className={`bg-gradient-to-r ${heroSlides[currentSlide].gradient} bg-clip-text`}>
                  {heroSlides[currentSlide].title}
                </span>
              </h1>

              {/* Emoji */}
              <div className="text-6xl md:text-8xl mb-6 animate-bounce-slow">
                {heroSlides[currentSlide].image}
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 animate-fadeIn animation-delay-200">
                {heroSlides[currentSlide].description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn animation-delay-400">
                <button
                  onClick={() => navigate("/products")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {heroSlides[currentSlide].cta}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Browse All
                </button>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? "w-8 bg-sky-400" : "w-2 bg-slate-600 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      </section>

      {/* Trust Features */}
      <section className="relative py-12 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="group text-center animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className={`text-${feature.color}-400`}>{feature.icon}</div>
                </div>
                <div className="text-sm font-bold text-slate-200 mb-1">{feature.title}</div>
                <div className="text-xs text-slate-400">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center group animate-fadeIn"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="relative py-16 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3">
              Authentic Brands
            </h2>
            <p className="text-slate-400">
              We only stock verified sneakers from premium brands
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center hover:border-sky-500/30 hover:bg-slate-900/80 transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {brand.icon}
                </div>
                <div className="text-sm font-bold text-slate-300 group-hover:text-sky-400 transition-colors">
                  {brand.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Drops Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-sky-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Latest Drops</h2>
              </div>
              <p className="text-slate-400">Fresh kicks just landed</p>
            </div>
            <Link
              to="/products"
              className="group hidden md:flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product List Component */}
          <ProductList showHero={false} title="" limit={8} />

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-colors"
            >
              View All Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-16 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3">
              Why Sneaker Heads Choose Us
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We're not just another sneaker store. We're a community of enthusiasts dedicated to authenticity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Authenticity Guaranteed",
                description: "Every sneaker goes through rigorous authentication. We guarantee 100% authentic products or your money back.",
                color: "green",
              },
              {
                icon: <Package className="w-8 h-8" />,
                title: "Secure Packaging",
                description: "Premium packaging to ensure your sneakers arrive in perfect condition. Double-boxed for maximum protection.",
                color: "sky",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Loyalty Rewards",
                description: "Earn points on every purchase. 1 point = Rs. 1 discount. The more you shop, the more you save.",
                color: "amber",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className={`text-${item.color}-400`}>{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-semibold text-sky-300">Start Your Collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-100 mb-6">
            Ready to Step Up Your Game?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of sneaker enthusiasts who trust us for authentic, premium kicks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/products")}
              className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => navigate("/products")}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Browse Collection
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}