import { Shield, Lock, Eye, UserCheck, Mail, FileText, AlertCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <AlertCircle className="w-6 h-6" />,
      color: "sky",
      title: "Overview",
      content: (
        <>
          <p className="text-slate-300 leading-relaxed mb-4">
            We collect only what we need to operate the store (account, orders, delivery, and support).
            We do not sell your personal data.
          </p>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm leading-relaxed">
              <strong className="text-slate-300">Note:</strong> This privacy policy is a template. 
              Replace/adjust these statements to match your actual implementation and requirements.
            </p>
          </div>
        </>
      ),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      color: "blue",
      title: "Information We Collect",
      content: (
        <>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <UserCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Account Data</div>
                <p className="text-slate-400 text-sm">
                  Name, email, and login credentials (stored securely with encryption).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Order Data</div>
                <p className="text-slate-400 text-sm">
                  Items purchased, prices, delivery details, payment method, and order status.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Eye className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Usage Data</div>
                <p className="text-slate-400 text-sm">
                  Basic analytics and logs to improve platform performance, security, and user experience.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: <Eye className="w-6 h-6" />,
      color: "purple",
      title: "How We Use Your Information",
      content: (
        <>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
              <span className="text-slate-300">
                To process orders and payments, and provide delivery updates and tracking information.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
              <span className="text-slate-300">
                To provide customer support and respond to your requests, questions, or concerns.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
              <span className="text-slate-300">
                To improve the platform experience and prevent fraud, abuse, or security issues.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
              <span className="text-slate-300">
                To communicate important updates about your orders or account.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: <Lock className="w-6 h-6" />,
      color: "green",
      title: "Security & Protection",
      content: (
        <>
          <p className="text-slate-300 leading-relaxed mb-4">
            We use industry-standard security practices including authentication controls, encrypted 
            data transmission, and secure credential handling. Access to sensitive operations and 
            personal data is restricted to authorized personnel only.
          </p>
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                While no online system can be guaranteed 100% secure, we actively work to reduce 
                risks and continuously monitor our systems for potential vulnerabilities.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      color: "amber",
      title: "Your Rights & Choices",
      content: (
        <>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="font-semibold text-slate-200 mb-2">Access & Update</div>
              <p className="text-slate-400 text-sm">
                You can review and update your account details at any time through your account settings.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="font-semibold text-slate-200 mb-2">Data Deletion</div>
              <p className="text-slate-400 text-sm">
                You can request deletion of your personal data where applicable, subject to legal 
                requirements for order history and transaction records.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="font-semibold text-slate-200 mb-2">Privacy Questions</div>
              <p className="text-slate-400 text-sm">
                If you have any questions about how we handle your data, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: <Mail className="w-6 h-6" />,
      color: "sky",
      title: "Contact Us",
      content: (
        <>
          <p className="text-slate-300 leading-relaxed mb-4">
            If you have questions, concerns, or requests regarding this privacy policy or your 
            personal data, please reach out to us:
          </p>
          <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-sky-400" />
              <span className="font-semibold text-sky-300">Get in Touch</span>
            </div>
            <p className="text-slate-400 text-sm mb-3">
              Visit our Contact page or email our privacy team directly.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 rounded-lg text-sm font-semibold transition-all duration-300"
            >
              Contact Support
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full mb-6">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-slate-300">Legal</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-slate-50 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            This explains what data we collect, why we collect it, and how we protect it.
          </p>

          {/* Last Updated */}
          <div className="mt-6 text-sm text-slate-500">
            Last updated: January 2026
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 hover:border-slate-700/50 transition-all duration-300"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-${section.color}-500/10 border border-${section.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-${section.color}-400`}>
                    {section.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-100">
                  {section.title}
                </h2>
              </div>

              {/* Section Content */}
              <div className="prose prose-invert prose-slate max-w-none">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-slate-200">Your Privacy Matters</span>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            We are committed to protecting your privacy and being transparent about our data practices. 
            This policy may be updated from time to time to reflect changes in our practices or legal requirements.
          </p>
        </div>
      </div>
    </main>
  );
}