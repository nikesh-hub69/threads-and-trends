// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              <span className="text-sky-400">Threads</span>
              <span className="text-slate-100">&</span>
              <span className="text-fuchsia-400">Trends</span>
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Your trusted destination for premium sneakers and streetwear. Quality, style, and authenticity guaranteed.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span>in Nepal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop-now" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">
                  Shop Now
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/refund-policy" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">
                  Refund & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@threadsandtrends.com" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-400" />
                <a href="mailto:support@threadsandtrends.com" className="hover:text-sky-400 transition-colors">
                  threadsandtrendsnepal@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-400" />
                <a href="tel:+9779812345678" className="hover:text-sky-400 transition-colors">
                  +977 9840856664
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-400" />
                <span>Lalitpur, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Threads & Trends. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-slate-500 hover:text-sky-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-slate-500 hover:text-sky-400 transition-colors">
                Terms
              </Link>
              <Link to="/refund-policy" className="text-slate-500 hover:text-sky-400 transition-colors">
                Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;