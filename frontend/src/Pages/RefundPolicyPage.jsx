// src/Pages/RefundPolicyPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  PackageCheck, 
  RotateCcw, 
  Clock, 
  Shield, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  FileText,
  MessageCircle
} from "lucide-react";

function RefundPolicyPage() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
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

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-2xl border border-sky-500/30 mb-6">
            <RotateCcw className="w-10 h-10 text-sky-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 tracking-tight mb-4">
            Refund & Returns Policy
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Your satisfaction is our priority. Learn about our hassle-free return and refund process.
          </p>
          <div className="mt-6 text-sm text-slate-500">
            Last Updated: <span className="text-slate-400 font-semibold">February 6, 2026</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-2xl p-6 mb-12 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => scrollToSection('return-policy')}
              className="text-left px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-sky-400 transition-all text-sm"
            >
              → Return Policy
            </button>
            <button
              onClick={() => scrollToSection('refund-process')}
              className="text-left px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-sky-400 transition-all text-sm"
            >
              → Refund Process
            </button>
            <button
              onClick={() => scrollToSection('eligible-items')}
              className="text-left px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-sky-400 transition-all text-sm"
            >
              → Eligible Items
            </button>
            <button
              onClick={() => scrollToSection('return-steps')}
              className="text-left px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-sky-400 transition-all text-sm"
            >
              → How to Return
            </button>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">30-Day Returns</h3>
            <p className="text-sm text-slate-400">
              Return unused items within 30 days of delivery for a full refund.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Free Return Shipping</h3>
            <p className="text-sm text-slate-400">
              We cover return shipping costs for defective or incorrect items.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Quality Guarantee</h3>
            <p className="text-sm text-slate-400">
              All products are quality-checked before shipping to ensure satisfaction.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Return Policy */}
          <section id="return-policy" className="scroll-mt-24">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2 bg-sky-500/10 rounded-lg mt-1">
                  <PackageCheck className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">Return Policy Overview</h2>
                  <p className="text-slate-400">
                    We want you to be completely satisfied with your purchase from Threads & Trends.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-slate-300">
                <p>
                  We offer a <span className="text-sky-400 font-semibold">30-day return policy</span> on most items. 
                  If you're not completely satisfied with your purchase, you can return it within 30 days of 
                  receiving your order for a full refund or exchange.
                </p>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Return Window
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>Standard returns: 30 days from delivery date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>Defective items: 60 days from delivery date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-1">•</span>
                      <span>Holiday purchases (Nov 1 - Dec 31): Extended to January 31st</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Eligible Items */}
          <section id="eligible-items" className="scroll-mt-24">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                Eligible for Return
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Returnable Items
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Unworn shoes with original tags and packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Items in original condition with all accessories</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Defective or damaged products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Wrong items received</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Incorrect size or color shipped</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Non-Returnable Items
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Worn or used shoes (unless defective)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Items without original packaging or tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Customized or personalized items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Sale items marked as "Final Sale"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Items purchased from third-party sellers</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-300 font-semibold mb-1">Important Note</p>
                  <p className="text-slate-300">
                    Items must be returned in their original, unworn condition with all tags attached. 
                    Shoes should show no signs of wear on the soles or upper materials.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Return */}
          <section id="return-steps" className="scroll-mt-24">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-purple-400" />
                </div>
                How to Return an Item
              </h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center text-sky-400 font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">Initiate Return Request</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      Log in to your account and go to "My Orders". Select the order containing the item you wish to return 
                      and click "Request Return".
                    </p>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Alternative:</span> Contact our support team at{" "}
                        <a href="mailto:returns@threadsandtrends.com" className="text-sky-400 hover:underline">
                          returns@threadsandtrends.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center text-sky-400 font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">Select Return Reason</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      Choose the reason for your return (e.g., wrong size, defective, changed mind) and provide 
                      any additional details or photos if applicable.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center text-sky-400 font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">Receive Return Label</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      We'll email you a prepaid return shipping label within 24 hours. Print it and attach it to your package.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-xs text-green-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="font-semibold">Free Returns:</span> We cover return shipping for defective 
                          or incorrect items. For other returns, a Rs. 500 shipping fee may be deducted from your refund.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center text-sky-400 font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">Pack and Ship</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      Securely pack the item(s) in the original packaging with all tags and accessories. 
                      Drop off at any authorized shipping location.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1 ml-4">
                      <li>• Include all original packaging, tags, and accessories</li>
                      <li>• Use a sturdy box to prevent damage during transit</li>
                      <li>• Keep your tracking number for reference</li>
                    </ul>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center text-sky-400 font-bold">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">Track Your Return</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      Monitor your return shipment status in "My Orders". Once we receive and inspect your return, 
                      we'll process your refund within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section id="refund-process" className="scroll-mt-24">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                Refund Process
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Refund Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <Clock className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-1">Processing Time</p>
                        <p className="text-xs text-slate-400">
                          5-7 business days after we receive and inspect your returned item
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <CreditCard className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-1">Credit to Original Payment Method</p>
                        <p className="text-xs text-slate-400">
                          Refunds are issued to the original payment method. Bank processing may take an additional 3-5 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Refund Amount</h3>
                  <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                    <table className="w-full text-sm">
                      <tbody className="space-y-2">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 text-slate-300">Product Price</td>
                          <td className="py-2 text-right text-slate-100 font-semibold">Full Refund ✓</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 text-slate-300">Original Shipping Fee</td>
                          <td className="py-2 text-right text-slate-400">Non-refundable</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 text-slate-300">Return Shipping</td>
                          <td className="py-2 text-right text-slate-400">Free (defective) or Rs. 500 deducted</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-300">Taxes</td>
                          <td className="py-2 text-right text-slate-100 font-semibold">Refunded ✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-300 font-semibold mb-1">Refund Guarantee</p>
                    <p className="text-slate-300">
                      If your return meets our policy requirements, you're guaranteed a full refund. 
                      We'll notify you via email once the refund has been processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section className="scroll-mt-24">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-green-400" />
                </div>
                Exchanges
              </h2>

              <div className="space-y-4 text-slate-300">
                <p>
                  We currently don't offer direct exchanges. If you need a different size or color:
                </p>

                <ol className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <span>Return the original item following our standard return process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <span>Place a new order for the desired item</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <span>Your refund will be processed once we receive the returned item</span>
                  </li>
                </ol>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3 mt-6">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-green-300 font-semibold mb-1">Pro Tip</p>
                    <p className="text-slate-300">
                      To ensure you get your preferred size/color, place your new order first. This way, 
                      you won't miss out if the item sells out while we process your return.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Special Circumstances */}
          <section className="scroll-mt-24">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Special Circumstances</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Defective or Damaged Items
                  </h3>
                  <p className="text-slate-300 text-sm mb-3">
                    If you receive a defective or damaged item, please contact us immediately at{" "}
                    <a href="mailto:support@threadsandtrends.com" className="text-sky-400 hover:underline">
                      support@threadsandtrends.com
                    </a>{" "}
                    with photos of the damage. We'll arrange a free return and expedited replacement or full refund.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-blue-400" />
                    Wrong Item Received
                  </h3>
                  <p className="text-slate-300 text-sm mb-3">
                    If we shipped the wrong item, we'll cover all return shipping costs and send you the correct 
                    item at no additional charge. Contact us within 7 days of delivery.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-400" />
                    Lost or Stolen Packages
                  </h3>
                  <p className="text-slate-300 text-sm mb-3">
                    For lost or stolen packages, please file a claim with the shipping carrier using your tracking 
                    number. We'll assist you in this process and may offer a replacement or refund on a case-by-case basis.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="scroll-mt-24">
            <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-500/20 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">Need Help with a Return?</h3>
                    <p className="text-slate-300 text-sm">
                      Our customer support team is here to assist you with any questions about returns or refunds.
                    </p>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-400/40 flex items-center gap-2 whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Support
                </Link>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="text-center text-sm text-slate-500 mt-12 pt-8 border-t border-slate-800/50">
            <p>
              This refund policy was last updated on February 6, 2026. We reserve the right to modify this policy at any time.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <Link to="/terms" className="text-sky-400 hover:underline">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sky-400 hover:underline">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-sky-400 hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RefundPolicyPage;