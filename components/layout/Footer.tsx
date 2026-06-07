"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "MicroGreens", href: "/microgreens" },
  { label: "Subscription Plans", href: "/subscription" },
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact" },
];

const supportLinks = [
  { label: "Contact Support", href: "/contact" },
  { label: "Shipping FAQ", href: "/contact#faq" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1e221c] text-white">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-[var(--font-libre-caslon)] text-2xl font-bold mb-6 block hover:text-[#a5f95b] transition-colors"
          >
            AgriNest
          </Link>
          <p className="text-sm opacity-70 mb-8 leading-relaxed">
            Harvesting the future of food through sustainable, urban hydroponic farming.
            Freshness you can taste, health you can feel.
          </p>
          <div className="flex gap-4">
            {[
              <svg key="fb" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
              <svg key="ig" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
              <svg key="tw" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
            ].map((icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#a5f95b] hover:text-[#a5f95b] transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-xs tracking-widest uppercase font-[var(--font-work-sans)] mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#c4c8be] hover:text-white transition-colors font-[var(--font-work-sans)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-xs tracking-widest uppercase font-[var(--font-work-sans)] mb-6">Support</h4>
          <ul className="space-y-3">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#c4c8be] hover:text-white transition-colors font-[var(--font-work-sans)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-xs tracking-widest uppercase font-[var(--font-work-sans)] mb-6">Newsletter</h4>
          <p className="text-sm opacity-70 mb-4 font-[var(--font-work-sans)]">
            Stay updated with our latest offers and healthy tips.
          </p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              className="bg-[#333730] border border-[#444] text-white p-3 rounded-lg focus:outline-none focus:border-[#a5f95b] text-sm placeholder:text-white/40 font-[var(--font-work-sans)]"
              placeholder="Enter your email"
              type="email"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#386b00] text-white font-bold py-3 rounded-lg text-xs tracking-widest uppercase hover:bg-[#032616] transition-colors font-[var(--font-work-sans)]"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-6 border-t border-[#333730] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm opacity-60 font-[var(--font-work-sans)]">
          © 2024 AgriNest Organic Microgreens. Freshly Harvested.
        </p>
        <div className="flex gap-4 items-center opacity-50">
          <span className="text-xs font-bold tracking-wider">VISA</span>
          <span className="text-xs font-bold tracking-wider">MASTERCARD</span>
          <span className="text-xs font-bold tracking-wider">PAYPAL</span>
        </div>
      </div>
    </footer>
  );
}
