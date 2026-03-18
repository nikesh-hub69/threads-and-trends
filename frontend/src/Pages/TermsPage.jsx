// src/Pages/TermsPage.jsx
import InfoPageLayout from "../components/InfoPageLayout";

export default function TermsPage() {
  return (
    <InfoPageLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using Threads & Trends."
      badge="Legal"
      icon="⚖️"
      sections={[
        {
          title: "Acceptance of Terms",
          icon: "✅",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                By accessing and using the Threads & Trends platform (website and mobile applications), you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/30">
                <p className="text-amber-200 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-lg mt-0.5">⚠️</span>
                  <span>
                    <strong className="font-bold">Important:</strong> If you do not agree to these terms, please discontinue use of the platform immediately.
                  </span>
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Orders & Payments",
          icon: "💳",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                All orders placed through Threads & Trends are subject to confirmation and acceptance. We reserve the right to refuse or cancel any order at our discretion.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900/60 transition-colors duration-300">
                  <span className="text-2xl mt-1">💰</span>
                  <div>
                    <h4 className="font-bold text-slate-100 mb-1">Payment Methods</h4>
                    <p className="text-sm text-slate-400">
                      We accept online payment gateways (eSewa, Khalti, credit/debit cards) and cash on delivery where available.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900/60 transition-colors duration-300">
                  <span className="text-2xl mt-1">📋</span>
                  <div>
                    <h4 className="font-bold text-slate-100 mb-1">Order Confirmation</h4>
                    <p className="text-sm text-slate-400">
                      You will receive order confirmation and status updates in your account dashboard and via email.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900/60 transition-colors duration-300">
                  <span className="text-2xl mt-1">🏷️</span>
                  <div>
                    <h4 className="font-bold text-slate-100 mb-1">Pricing & Availability</h4>
                    <p className="text-sm text-slate-400">
                      Prices, availability, and promotional offers are subject to change without prior notice. All prices are in Nepalese Rupees (NPR).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Shipping & Delivery",
          icon: "🚚",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                We strive to deliver your orders within the estimated timeframe. However, delivery times may vary based on your location and external factors beyond our control.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📍</span>
                    <h4 className="font-bold text-sky-200 text-sm">Location-Based</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Delivery times vary by region. Check estimated delivery during checkout.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📦</span>
                    <h4 className="font-bold text-purple-200 text-sm">Order Tracking</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Track your order status in real-time through your account dashboard.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong className="text-slate-100 font-bold">Note:</strong> We are not responsible for delays caused by courier services, natural disasters, or other unforeseen circumstances.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Returns & Refunds",
          icon: "↩️",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Returns and refunds are processed according to our Return Policy. Products must meet specific conditions to be eligible for return.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <h4 className="font-bold text-emerald-200 mb-2">Eligible for Return</h4>
                      <ul className="space-y-1.5 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>Damaged or defective products upon arrival</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>Wrong product shipped</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>Size exchange (subject to availability)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✕</span>
                    <div>
                      <h4 className="font-bold text-rose-200 mb-2">Not Eligible for Return</h4>
                      <ul className="space-y-1.5 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                          <span className="text-rose-400 mt-1">•</span>
                          <span>Products worn, washed, or damaged after delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-400 mt-1">•</span>
                          <span>Items without original packaging and tags</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-400 mt-1">•</span>
                          <span>Sale or clearance items (unless defective)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-900/30">
                <p className="text-sky-200 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-lg mt-0.5">💡</span>
                  <span>
                    For detailed return instructions and refund timelines, please review our complete Return Policy or contact our customer support team.
                  </span>
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "User Accounts",
          icon: "👤",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                When you create an account with Threads & Trends, you are responsible for maintaining the security and confidentiality of your account credentials.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-sky-800/60 transition-colors duration-300 group">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🔒</span>
                    <div>
                      <h4 className="font-bold text-slate-100 mb-2">Your Responsibilities</h4>
                      <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-400 mt-1">→</span>
                          <span>Keep your password secure and confidential</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-400 mt-1">→</span>
                          <span>Do not share your account with others</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-400 mt-1">→</span>
                          <span>Notify us immediately of any unauthorized access</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-400 mt-1">→</span>
                          <span>Provide accurate and up-to-date information</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-sky-800/60 transition-colors duration-300 group">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
                    <div>
                      <h4 className="font-bold text-slate-100 mb-2">Account Termination</h4>
                      <p className="text-sm text-slate-400">
                        We reserve the right to suspend or terminate accounts that violate our terms, engage in fraudulent activity, or misuse the platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/30">
                <p className="text-amber-200 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-lg mt-0.5">⚠️</span>
                  <span>
                    You are fully responsible for all activities that occur under your account. Report suspicious activity immediately to{" "}
                    <a href="mailto:support@threadsandtrends.com" className="font-bold underline hover:text-amber-100 transition-colors">
                      support@threadsandtrends.com
                    </a>
                  </span>
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Limitation of Liability",
          icon: "⚖️",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                To the maximum extent permitted by applicable law, Threads & Trends shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                    <span>📜</span>
                    We Are Not Liable For:
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-500 mt-1">•</span>
                      <span>Loss of profits, data, or business opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-500 mt-1">•</span>
                      <span>Service interruptions or technical errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-500 mt-1">•</span>
                      <span>Delays or failures caused by third-party services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-500 mt-1">•</span>
                      <span>Unauthorized access to your account due to your negligence</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/30">
                  <p className="text-sky-200 text-sm leading-relaxed">
                    <strong className="font-bold">Maximum Liability:</strong> Our total liability to you for any claim arising from these terms or your use of the platform shall not exceed the amount you paid us in the 12 months preceding the claim.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/60">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong className="text-slate-100 font-bold">Legal Disclaimer:</strong> Some jurisdictions do not allow limitations on implied warranties or exclusion of liability for certain damages. In such cases, our liability will be limited to the maximum extent permitted by law.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Intellectual Property",
          icon: "©️",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                All content on the Threads & Trends platform, including but not limited to text, images, logos, designs, and software, is the property of Threads & Trends or its licensors and is protected by intellectual property laws.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✓</span>
                    <h4 className="font-bold text-purple-200 text-sm">You May</h4>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li>• View and browse content</li>
                    <li>• Share product links</li>
                    <li>• Use for personal shopping</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✕</span>
                    <h4 className="font-bold text-rose-200 text-sm">You May Not</h4>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li>• Copy or reproduce content</li>
                    <li>• Use our branding commercially</li>
                    <li>• Scrape or mine data</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Changes to Terms",
          icon: "🔄",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting to the platform.
              </p>

              <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-900/30">
                <p className="text-sky-200 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-lg mt-0.5">💡</span>
                  <span>
                    <strong className="font-bold">Stay Informed:</strong> We recommend reviewing these terms periodically. Your continued use of the platform after changes constitutes acceptance of the updated terms.
                  </span>
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Contact Us",
          icon: "📧",
          content: (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                If you have any questions or concerns about these Terms & Conditions, please don't hesitate to reach out to our team.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/30 to-indigo-950/30 border border-sky-900/30 hover:border-sky-800/50 transition-all duration-300 group">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">📧</span>
                    <div>
                      <h4 className="font-bold text-sky-200 mb-1">Email Support</h4>
                      <a 
                        href="mailto:support@threadsandtrends.com" 
                        className="text-sm text-slate-300 hover:text-sky-300 transition-colors underline"
                      >
                        support@threadsandtrends.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-green-950/30 border border-emerald-900/30 hover:border-emerald-800/50 transition-all duration-300 group">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">💬</span>
                    <div>
                      <h4 className="font-bold text-emerald-200 mb-1">Live Chat</h4>
                      <p className="text-sm text-slate-300">
                        Available Mon-Sat, 10 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ]}
      footer={
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/60">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📅</span>
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Last Updated</h3>
              <p className="text-slate-400 text-sm mb-4">
                These Terms & Conditions were last updated on <strong className="text-slate-200">January 30, 2026</strong>.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                By continuing to use Threads & Trends after this date, you acknowledge that you have read and agree to the current version of these terms.
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}