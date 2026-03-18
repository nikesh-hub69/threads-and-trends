// src/Pages/ContactPage.jsx
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [copiedText, setCopiedText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeMethod, setActiveMethod] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <main className="tt-container min-h-screen py-16 relative overflow-hidden">
      {/* Dynamic Background with Mouse Tracking */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-radial from-sky-500/20 via-sky-500/5 to-transparent rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 300}px`,
            top: `${mousePosition.y - 300}px`,
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Creative Header */}
      <div className="max-w-6xl mx-auto mb-16 relative">
        <div className="flex flex-col items-center text-center space-y-6 animate-fade-in-down">
          {/* Floating Badge */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 blur-xl animate-pulse-glow" />
            <span className="relative px-6 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-fuchsia-300 to-emerald-300 text-sm font-black tracking-widest uppercase">
              Let's Connect
            </span>
          </div>
          
          {/* Main Heading with Split Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black relative">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-slate-100 animate-gradient-x leading-tight">
              We'd Love to
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-sky-300 to-emerald-300 animate-gradient-x-reverse mt-2 leading-tight">
              Hear From You
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Got questions about authenticity, sizing, or orders? Our sneaker experts are standing by with genuine expertise and care.
          </p>
        </div>
      </div>

      {/* Unique Bento-Style Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up animation-delay-200">
        
        {/* Contact Methods - Left Column (Tall Cards) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WhatsApp - Featured Large Card */}
          <div 
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-950/90 border border-emerald-500/30 p-8 hover:border-emerald-400/60 transition-all duration-500 cursor-pointer"
            onMouseEnter={() => setActiveMethod('whatsapp')}
            onMouseLeave={() => setActiveMethod(null)}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <WhatsAppIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-ping" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full" />
            </div>

            <div className="relative space-y-4">
              <div>
                <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Instant Support</div>
                <h3 className="text-2xl font-black text-white mb-2">Chat on WhatsApp</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Get real-time replies from our sneaker experts. Fastest way to get help!</p>
              </div>

              <a
                href="https://wa.me/9779840856664"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-6 py-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 group-hover:bg-emerald-500/30 group-hover:border-emerald-400/60 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-emerald-100 font-bold">+977 9840856664</span>
                <ArrowRightIcon className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="flex items-center gap-2 text-xs text-emerald-300/70">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Usually replies within minutes
              </div>
            </div>
          </div>

          {/* Phone - Compact Card */}
          <div 
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500/10 via-slate-900/80 to-slate-950/90 border border-sky-500/30 p-6 hover:border-sky-400/60 transition-all duration-500 cursor-pointer"
            onMouseEnter={() => setHoveredCard('phone')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCopy('+9779840856664', 'phone')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <PhoneIcon className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-1">Call Us</div>
                <a
                  href="tel:+9779840856664"
                  className="text-white font-bold text-lg hover:text-sky-300 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  +977 9840856664
                </a>
              </div>

              {copiedText === 'phone' && (
                <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce-in">
                  ✓ Copied
                </div>
              )}
            </div>
          </div>

          {/* Email - Compact Card */}
          <div 
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-fuchsia-500/10 via-slate-900/80 to-slate-950/90 border border-fuchsia-500/30 p-6 hover:border-fuchsia-400/60 transition-all duration-500 cursor-pointer"
            onMouseEnter={() => setHoveredCard('email')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCopy('threadsntrendsnepal@gmail.com', 'email')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 via-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <MailIcon className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-xs text-fuchsia-300 font-bold uppercase tracking-wider mb-1">Email</div>
                <a
                  href="mailto:threadsntrendsnepal@gmail.com"
                  className="text-white font-bold text-sm break-all hover:text-fuchsia-300 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  threadsntrendsnepal@gmail.com
                </a>
              </div>

              {copiedText === 'email' && (
                <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce-in">
                  ✓ Copied
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Info Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Brand Card with 3D Effect */}
          <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 p-8 hover:border-slate-600/60 transition-all duration-500 perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative space-y-6">
              {/* Logo Area */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                <h2 className="text-xl font-black text-white">Threads & Trends Nepal</h2>
              </div>

              <p className="text-slate-400 leading-relaxed">
                Your trusted destination for 100% authentic sneakers across Nepal
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: '✓', text: 'Verified Authentic', color: 'sky' },
                  { icon: '⚡', text: 'Fast Delivery', color: 'emerald' },
                  { icon: '🏆', text: 'Top Rated', color: 'fuchsia' }
                ].map((badge, idx) => (
                  <div 
                    key={idx}
                    className={`px-4 py-2 rounded-full bg-${badge.color}-500/10 border border-${badge.color}-500/30 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span className={`text-${badge.color}-300 text-sm font-bold`}>
                      {badge.icon} {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Response Time with Progress Ring */}
          <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 p-6 hover:border-emerald-500/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-slate-800"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="175.93"
                    strokeDashoffset="44"
                    className="text-emerald-500 transition-all duration-1000 group-hover:strokeDashoffset-0"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ClockIcon className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              
              <div>
                <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1">Response Time</div>
                <div className="text-white font-black text-lg">Within 24 Hours</div>
                <div className="text-slate-500 text-xs">Usually much faster!</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: '100%', label: 'Authentic', icon: '🎯', color: 'sky' },
              { number: '24/7', label: 'Available', icon: '⚡', color: 'fuchsia' }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className={`group relative rounded-xl overflow-hidden bg-gradient-to-br from-${stat.color}-500/10 via-slate-900/80 to-slate-950/90 border border-${stat.color}-500/30 p-4 hover:border-${stat.color}-400/60 transition-all duration-300 cursor-pointer hover:scale-105`}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-black text-${stat.color}-300 mb-1`}>{stat.number}</div>
                <div className="text-xs text-slate-400 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Services & CTA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* How We Help - Vertical Card */}
          <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 p-6 hover:border-slate-600/60 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-fuchsia-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎯</div>
                <h3 className="text-lg font-black text-white">How We Help</h3>
              </div>

              <div className="space-y-3">
                {[
                  { icon: '📦', text: 'Order Support', color: 'sky' },
                  { icon: '👟', text: 'Sizing Guide', color: 'fuchsia' },
                  { icon: '🚚', text: 'Track Orders', color: 'emerald' },
                  { icon: '🤝', text: 'Partnerships', color: 'sky' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="group/item flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="text-2xl group-hover/item:scale-125 transition-transform duration-300">{item.icon}</div>
                    <span className="text-sm text-slate-300 font-semibold group-hover/item:text-white transition-colors">{item.text}</span>
                    <ArrowRightIcon className="w-4 h-4 text-slate-600 ml-auto opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button - Send Email */}
          <a
            href="mailto:threadsntrendsnepal@gmail.com"
            className="group relative flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-2xl
                       bg-gradient-to-br from-fuchsia-500/20 via-sky-500/10 to-fuchsia-500/20 
                       border-2 border-fuchsia-500/40 overflow-hidden
                       hover:border-fuchsia-400/60 hover:shadow-2xl hover:shadow-fuchsia-500/20 
                       hover:scale-105 transition-all duration-500"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/20 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <MailIcon className="w-12 h-12 text-fuchsia-300 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            <div className="relative z-10 text-center">
              <div className="text-white font-black text-lg mb-1">Send Email</div>
              <div className="text-xs text-fuchsia-300/70">Detailed inquiries welcome</div>
            </div>
          </a>
        </div>
      </div>

      {/* Map Section with Creative Design */}
      <div className="max-w-7xl mx-auto mt-12 animate-fade-in-up animation-delay-400">
        <div className="relative rounded-3xl overflow-hidden border border-slate-700/50 bg-slate-900/60 shadow-2xl backdrop-blur-sm">
          
          {/* Map Header with Gradient */}
          <div className="relative px-8 py-6 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border-b border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-fuchsia-500/5 to-emerald-500/5" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                  <LocationIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-black text-lg mb-1">Find Us in Kathmandu</div>
                  <div className="text-slate-400 text-sm">Nepal • View on Google Maps</div>
                </div>
              </div>
              
              <a 
                href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7662400.591140575!2d76.21665042078898!3d20.324817395917425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1936285e704b%3A0xdb45f0c80b12ec8f!2sThreads%20N%20Trends!5e0!3m2!1sen!2snp!4v1769617461142!5m2!1sen!2snp"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-sm font-bold hover:bg-sky-500/30 hover:border-sky-400/60 hover:scale-105 transition-all duration-300"
              >
                Open in Maps
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Map with Overlay Effect */}
          <div className="relative group/map h-96">
            <iframe
              title="Threads & Trends Location"
              className="w-full h-full grayscale-[40%] group-hover/map:grayscale-0 transition-all duration-700"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7662400.591140575!2d76.21665042078898!3d20.324817395917425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1936285e704b%3A0xdb45f0c80b12ec8f!2sThreads%20N%20Trends!5e0!3m2!1sen!2snp!4v1769617461142!5m2!1sen!2snp" 
            />
            
            {/* Hover Instruction */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 group-hover/map:opacity-0 transition-opacity duration-500">
              <div className="px-6 py-3 rounded-full bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 text-slate-300 text-sm font-semibold">
                Hover to explore map
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-x-reverse {
          0%, 100% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }

        .animate-gradient-x-reverse {
          background-size: 200% auto;
          animation: gradient-x-reverse 3s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgb(148 163 184 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148 163 184 / 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </main>
  );
}

/* ---------- Icon Components ---------- */

function PhoneIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m22 8-10 7L2 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M20.5 11.9a8.5 8.5 0 0 1-12.6 7.5L3 20.8l1.5-4.7A8.5 8.5 0 1 1 20.5 11.9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.2c.2-.5.4-.5.7-.5h.6c.2 0 .4.1.5.3l.8 1.8c.1.2.1.5 0 .7l-.5.6c-.1.1-.2.3-.1.5.6 1.1 1.6 2.1 2.7 2.7.2.1.4 0 .5-.1l.6-.5c.2-.1.5-.1.7 0l1.8.8c.2.1.3.3.3.5v.6c0 .3 0 .5-.5.7-.5.2-1.7.7-3.9-.2-2.1-.9-3.7-2.6-4.6-4.6-.9-2.2-.4-3.4-.2-3.9Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function ClockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path 
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path 
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path 
        d="M5 12h14M12 5l7 7-7 7" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}