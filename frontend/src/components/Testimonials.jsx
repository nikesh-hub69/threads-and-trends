import { useEffect, useMemo, useRef, useState } from "react";
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play,
  ShieldCheck,
  Package
} from "lucide-react";

export default function Testimonials() {
  const testimonials = useMemo(
    () => [
      {
        quote:
          "As a sneakerhead, finding unique kicks is a passion. Threads & Trends has an incredible selection of limited-edition sneakers that I couldn't find elsewhere. Shipping is fast, and the shoes always arrive in pristine condition.",
        name: "Nikesh Subedi",
        role: "Verified Customer",
        avatar: "/Images/Nikesh.JPG",
        shoe: "/Images/testimonial-shoe.png",
        rating: 5,
        verified: true,
        purchase: "Nike SB Born and Raised",
      },
      {
        quote:
          "The quality checks feel real — the pair I received matched every detail I expected. Packaging was clean, and delivery updates were clear the whole time.",
        name: "Suyank Rai",
        role: "Verified Customer",
        avatar: "/Images/Suyank.JPG",
        shoe: "/Images/testimonial-shoe-2.png",
        rating: 5,
        verified: true,
        purchase: "Nike Blazer",
      },
      {
        quote:
          "Best experience in Nepal for authentic sneakers. Quick response, genuine products, and the sizing guidance helped a lot. Will buy again.",
        name: "Anjana",
        role: "Verified Customer",
        avatar: "/Images/Anjana.JPG",
        shoe: "/Images/testimonial-shoe-3.png",
        rating: 5,
        verified: true,
        purchase: "Adidas Pink Samba",
      },
    ],
    []
  );

  const INTERVAL_MS = 6000;

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState("next");

  const timerRef = useRef(null);

  const goTo = (next, dir = "next") => {
    setDirection(dir);
    setVisible(false);

    window.setTimeout(() => {
      setIndex((prev) => {
        const n = typeof next === "function" ? next(prev) : next;
        const len = testimonials.length;
        return ((n % len) + len) % len;
      });
      window.setTimeout(() => setVisible(true), 20);
    }, 300);
  };

  const next = () => goTo((p) => p + 1, "next");
  const prev = () => goTo((p) => p - 1, "prev");

  useEffect(() => {
    if (paused) return;

    timerRef.current = window.setInterval(() => {
      next();
    }, INTERVAL_MS);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, index]);

  const t = testimonials[index];

  return (
    <section className="mt-20">
      <div className="tt-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500/10 to-purple-500/10 border border-sky-500/30 rounded-full mb-4">
            <Star className="w-4 h-4 text-sky-400 fill-sky-400" />
            <span className="text-sm font-bold text-sky-400 uppercase tracking-wider">
              Customer Reviews
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real reviews from real sneakerheads who trust us for authentic kicks
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl border border-slate-800/50
                     bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-900/90
                     shadow-2xl shadow-slate-950/50 backdrop-blur-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Background Decorations */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-sky-500/5 via-transparent to-fuchsia-500/5" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12 items-center">
            {/* LEFT SIDE - Testimonial Content */}
            <div
              className={`flex flex-col gap-6 transition-all duration-500 ease-out ${
                visible 
                  ? "opacity-100 translate-y-0" 
                  : direction === "next" 
                    ? "opacity-0 translate-y-4" 
                    : "opacity-0 -translate-y-4"
              }`}
            >
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30 backdrop-blur-sm">
                  <ShieldCheck className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-100">
                    Threads <span className="text-sky-400">&</span> <span className="text-fuchsia-400">Trends</span>
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">5.0 • 200+ reviews</span>
                  </div>
                </div>
              </div>

              {/* Quote Icon */}
              <div className="relative">
                <div className="absolute -left-2 -top-2 text-sky-500/20">
                  <Quote className="w-16 h-16" fill="currentColor" />
                </div>
                
                {/* Testimonial Quote */}
                <blockquote className="relative text-lg md:text-xl leading-relaxed text-slate-200 pl-8">
                  {t.quote}
                </blockquote>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-1">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-4 pt-2">
                <div className="relative">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-700/50 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23334155' width='56' height='56'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2394a3b8'%3E" + t.name.charAt(0) + "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {t.verified && (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full border-2 border-slate-900">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{t.name}</span>
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-xs font-semibold text-green-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">{t.role}</div>
                  {t.purchase && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      <Package className="w-3 h-3" />
                      Purchased: {t.purchase}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Dots & Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 hover:scale-110 ${
                        i === index 
                          ? "w-8 bg-gradient-to-r from-sky-400 to-blue-500" 
                          : "w-2 bg-slate-700 hover:bg-slate-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Manual Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-sky-400 group"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => setPaused(!paused)}
                    className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-sky-400"
                    aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                  >
                    {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={next}
                    className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-sky-400 group"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Sneaker Display */}
            <div className="hidden lg:flex justify-center items-center">
              <div
                className={`relative transition-all duration-500 ease-out ${
                  visible 
                    ? "opacity-100 scale-100 rotate-0" 
                    : direction === "next"
                      ? "opacity-0 scale-95 rotate-3"
                      : "opacity-0 scale-95 -rotate-3"
                }`}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-purple-500/20 blur-3xl rounded-full scale-150" />
                
                {/* Sneaker Card */}
                <div className="relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                  
                  {/* Authenticity Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full backdrop-blur-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs font-bold text-green-400">AUTHENTIC</span>
                  </div>
                  
                  <img
                    src={t.shoe}
                    alt="Featured Sneaker"
                    className="relative max-w-sm w-full h-auto transform rotate-[-12deg] hover:rotate-[-8deg] transition-transform duration-500 drop-shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="flex items-center justify-center h-64 text-slate-600">
                          <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="relative px-8 lg:px-12 pb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <div className={`w-2 h-2 rounded-full ${paused ? 'bg-amber-400 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
              {paused ? "Carousel Paused" : "Auto-playing"}
            </div>
            <div className="text-slate-600">
              {index + 1} / {testimonials.length}
            </div>
          </div>

          {/* Progress Bar */}
          {!paused && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/30">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 animate-progress"
                style={{ animation: `progress ${INTERVAL_MS}ms linear` }}
              />
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">100%</div>
              <div className="text-xs text-slate-500">Authentic</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <Star className="w-5 h-5 text-sky-400 fill-sky-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">5.0</div>
              <div className="text-xs text-slate-500">Rating</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Package className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">1000+</div>
              <div className="text-xs text-slate-500">Orders</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-fuchsia-500/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">200+</div>
              <div className="text-xs text-slate-500">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          width: 0%;
        }
      `}</style>
    </section>
  );
}