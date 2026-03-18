import { useState, useEffect } from "react";
import InfoPageLayout from "../components/InfoPageLayout";

export default function AboutPage() {
  const [stats, setStats] = useState({ customers: 0, products: 0, brands: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Animated counter effect
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      const animateCount = (target, setter, key) => {
        let current = 0;
        const increment = target / 50;
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            setter(prev => ({ ...prev, [key]: target }));
            clearInterval(interval);
          } else {
            setter(prev => ({ ...prev, [key]: Math.floor(current) }));
          }
        }, 30);
      };

      animateCount(500, setStats, 'customers');
      animateCount(200, setStats, 'products');
      animateCount(15, setStats, 'brands');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <InfoPageLayout
      title="About Threads & Trends"
      subtitle="Curated, authentic sneakers for Nepal — built for people who care about quality, trust, and style."
      heroRight={
        <div className="rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-950/60 to-slate-900/40 backdrop-blur-sm p-6 md:p-8 w-full md:w-[420px] shadow-2xl shadow-slate-950/50 hover:border-sky-500/50 hover:shadow-sky-500/10 transition-all duration-500 animate-fadeIn animate-delay-200 group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-sky-500/50">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold group-hover:text-sky-400 transition-colors">Our Promise</div>
          </div>
          
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="flex gap-4 group/item hover:translate-x-2 transition-all duration-300 cursor-default">
              <div className="mt-1 w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/50 flex-shrink-0 group-hover/item:scale-125 group-hover/item:shadow-emerald-500/80 transition-all duration-300 animate-pulse-subtle" />
              <div>
                <div className="font-semibold text-slate-100 mb-1 group-hover/item:text-emerald-400 transition-colors">Authenticity-first</div>
                <div className="text-slate-400 leading-relaxed">We focus on genuine pairs and trusted sourcing.</div>
              </div>
            </div>
            
            <div className="flex gap-4 group/item hover:translate-x-2 transition-all duration-300 cursor-default">
              <div className="mt-1 w-3 h-3 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 shadow-lg shadow-sky-500/50 flex-shrink-0 group-hover/item:scale-125 group-hover/item:shadow-sky-500/80 transition-all duration-300 animate-pulse-subtle" style={{ animationDelay: '150ms' }} />
              <div>
                <div className="font-semibold text-slate-100 mb-1 group-hover/item:text-sky-400 transition-colors">Clean shopping experience</div>
                <div className="text-slate-400 leading-relaxed">Fast browsing, simple checkout, clear updates.</div>
              </div>
            </div>
            
            <div className="flex gap-4 group/item hover:translate-x-2 transition-all duration-300 cursor-default">
              <div className="mt-1 w-3 h-3 rounded-full bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 shadow-lg shadow-fuchsia-500/50 flex-shrink-0 group-hover/item:scale-125 group-hover/item:shadow-fuchsia-500/80 transition-all duration-300 animate-pulse-subtle" style={{ animationDelay: '300ms' }} />
              <div>
                <div className="font-semibold text-slate-100 mb-1 group-hover/item:text-fuchsia-400 transition-colors">Customer support</div>
                <div className="text-slate-400 leading-relaxed">We help you pick sizing, care tips, and orders.</div>
              </div>
            </div>
          </div>
        </div>
      }
      sections={[
        {
          title: "Who we are",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed text-base hover:text-slate-200 transition-colors duration-300">
                Threads &amp; Trends is a sneaker-focused e-commerce platform designed for the Nepalese market.
                We make it easier to discover premium footwear with a storefront that feels modern, trustworthy, and simple to use.
              </p>
              <p className="text-slate-300 leading-relaxed text-base hover:text-slate-200 transition-colors duration-300">
                Our goal is to reduce uncertainty for buyers by emphasizing clear product details, variants (sizes/stock),
                and a smoother shopping journey end-to-end.
              </p>
              
              {/* Visual separator */}
              <div className="flex items-center gap-3 py-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
                <div className="w-2 h-2 rounded-full bg-sky-500/50 animate-pulse"></div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
              </div>
            </div>
          ),
        },
        {
          title: "What we offer",
          content: (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { 
                  t: "Premium Footwear", 
                  d: "Curated selection across trending and timeless pairs.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  ),
                  color: "from-sky-500 to-cyan-500",
                  shadow: "shadow-sky-500/20",
                  hoverShadow: "group-hover:shadow-sky-500/50"
                },
                { 
                  t: "Authenticity Mindset", 
                  d: "We prioritize reliable sourcing and transparency.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  color: "from-emerald-500 to-green-500",
                  shadow: "shadow-emerald-500/20",
                  hoverShadow: "group-hover:shadow-emerald-500/50"
                },
                { 
                  t: "Smooth Experience", 
                  d: "Search, filter, wishlist, and checkout built for speed.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  color: "from-fuchsia-500 to-pink-500",
                  shadow: "shadow-fuchsia-500/20",
                  hoverShadow: "group-hover:shadow-fuchsia-500/50"
                },
              ].map((x, idx) => (
                <div
                  key={x.t}
                  className={`group rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/50 to-slate-900/30 backdrop-blur-sm p-6 hover:border-slate-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 animate-fadeIn cursor-default ${x.hoverShadow}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${x.color} shadow-lg ${x.shadow} mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}>
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {x.icon}
                    </div>
                  </div>
                  <div className="text-slate-50 font-semibold text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-fuchsia-400 transition-all duration-300">{x.t}</div>
                  <div className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{x.d}</div>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: "Why choose us",
          content: (
            <div className="space-y-5">
              <ul className="space-y-5">
                <li className="flex gap-4 group hover:translate-x-3 transition-all duration-300 cursor-default">
                  <div className="mt-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 shadow-lg shadow-sky-500/50 flex-shrink-0 group-hover:scale-150 group-hover:shadow-sky-500/80 transition-all duration-300 animate-pulse-subtle" />
                  <span className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                    <b className="text-slate-100 font-semibold group-hover:text-sky-400 transition-colors">Quality assurance:</b> focus on consistent product information and stock/variant clarity.
                  </span>
                </li>
                <li className="flex gap-4 group hover:translate-x-3 transition-all duration-300 cursor-default">
                  <div className="mt-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 shadow-lg shadow-fuchsia-500/50 flex-shrink-0 group-hover:scale-150 group-hover:shadow-fuchsia-500/80 transition-all duration-300 animate-pulse-subtle" style={{ animationDelay: '100ms' }} />
                  <span className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                    <b className="text-slate-100 font-semibold group-hover:text-fuchsia-400 transition-colors">Customer satisfaction:</b> better browsing, cleaner UI, and helpful product details.
                  </span>
                </li>
                <li className="flex gap-4 group hover:translate-x-3 transition-all duration-300 cursor-default">
                  <div className="mt-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/50 flex-shrink-0 group-hover:scale-150 group-hover:shadow-emerald-500/80 transition-all duration-300 animate-pulse-subtle" style={{ animationDelay: '200ms' }} />
                  <span className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                    <b className="text-slate-100 font-semibold group-hover:text-emerald-400 transition-colors">Trend-ready:</b> spotlight sections like "Shop Now" and "Best Sellers".
                  </span>
                </li>
              </ul>

              {/* Enhanced Stats Section */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800/50">
                {[
                  { label: "Happy Customers", value: stats.customers, suffix: "+", color: "text-sky-400", gradient: "from-sky-400 to-cyan-400", glow: "shadow-sky-500/50" },
                  { label: "Products", value: stats.products, suffix: "+", color: "text-fuchsia-400", gradient: "from-fuchsia-400 to-pink-400", glow: "shadow-fuchsia-500/50" },
                  { label: "Brands", value: stats.brands, suffix: "+", color: "text-emerald-400", gradient: "from-emerald-400 to-green-400", glow: "shadow-emerald-500/50" },
                ].map((stat, idx) => (
                  <div 
                    key={stat.label} 
                    className={`text-center animate-fadeIn group cursor-default hover:scale-110 transition-transform duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300`}>
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider group-hover:text-slate-400 transition-colors">{stat.label}</div>
                    <div className={`w-12 h-1 bg-gradient-to-r ${stat.gradient} mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg ${stat.glow}`}></div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Our mission",
          content: (
            <div className="space-y-6">
              <p className="text-slate-300 leading-relaxed text-base hover:text-slate-200 transition-colors duration-300">
                Our mission is to provide premium footwear with a strong emphasis on trust and customer experience.
                We aim to make sneaker shopping simpler and more confident through better presentation, smoother flows,
                and consistent communication.
              </p>

              {/* Enhanced Mission Values */}
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  { 
                    title: "Trust", 
                    desc: "Building lasting relationships through transparency and quality",
                    gradient: "from-sky-500/10 to-cyan-500/10",
                    border: "border-sky-500/30",
                    hoverGradient: "hover:from-sky-500/20 hover:to-cyan-500/20",
                    hoverBorder: "hover:border-sky-400",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    iconColor: "text-sky-400"
                  },
                  { 
                    title: "Innovation", 
                    desc: "Constantly improving the shopping experience",
                    gradient: "from-fuchsia-500/10 to-pink-500/10",
                    border: "border-fuchsia-500/30",
                    hoverGradient: "hover:from-fuchsia-500/20 hover:to-pink-500/20",
                    hoverBorder: "hover:border-fuchsia-400",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    iconColor: "text-fuchsia-400"
                  },
                  { 
                    title: "Excellence", 
                    desc: "Curating only the best products for our customers",
                    gradient: "from-emerald-500/10 to-green-500/10",
                    border: "border-emerald-500/30",
                    hoverGradient: "hover:from-emerald-500/20 hover:to-green-500/20",
                    hoverBorder: "hover:border-emerald-400",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    ),
                    iconColor: "text-emerald-400"
                  },
                  { 
                    title: "Community", 
                    desc: "Creating a space for sneaker enthusiasts to connect",
                    gradient: "from-amber-500/10 to-orange-500/10",
                    border: "border-amber-500/30",
                    hoverGradient: "hover:from-amber-500/20 hover:to-orange-500/20",
                    hoverBorder: "hover:border-amber-400",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ),
                    iconColor: "text-amber-400"
                  },
                ].map((value, idx) => (
                  <div 
                    key={value.title}
                    className={`group rounded-xl border ${value.border} ${value.hoverBorder} bg-gradient-to-br ${value.gradient} ${value.hoverGradient} backdrop-blur-sm p-5 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fadeIn cursor-default`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center ${value.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {value.icon}
                      </div>
                      <div className="font-semibold text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-fuchsia-400 transition-all duration-300">{value.title}</div>
                    </div>
                    <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors ml-11">{value.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}