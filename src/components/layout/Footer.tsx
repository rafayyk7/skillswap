import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Explore Skills", href: "/explore" },
    { label: "Find Matches", href: "/matches" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Community", href: "/#community" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "Guides", href: "/guides" },
    { label: "API Docs", href: "/api-docs" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/6 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">SkillSwap</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              The global community where knowledge is exchanged, not bought.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "𝕏", href: "#" },
                { icon: "⌥", href: "#" },
                { icon: "in", href: "#" },
                { icon: "◎", href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
          <p className="text-sm text-slate-600">
            Built with ❤️ for the global learning community
          </p>
        </div>
      </div>
    </footer>
  );
}
