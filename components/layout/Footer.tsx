"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AgriNestSocialRow } from "@/components/ui/SocialIcons";

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
          <p className="text-sm opacity-70 mb-6 leading-relaxed font-[var(--font-work-sans)]">
            Harvesting the future of food through sustainable, urban hydroponic farming.
            Freshness you can taste, health you can feel.
          </p>

          {/* Social media icons */}
          <div className="mb-6">
            <AgriNestSocialRow variant="dark" iconSize={20} />
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

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-xs tracking-widest uppercase font-[var(--font-work-sans)] mb-6">Contact Us</h4>
          <div className="space-y-4">

            {/* Address */}
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-[#a5f95b] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <address className="text-sm text-[#c4c8be] not-italic leading-relaxed font-[var(--font-work-sans)]">
                Plot No 359, Gokul Plots,<br />
                KPHB 9th Phase,<br />
                Hyderabad, Telangana – 500085,<br />
                India
              </address>
            </div>

            {/* Phone 1 */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#a5f95b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17v-.08z" />
              </svg>
              <a
                href="tel:+918500395821"
                className="text-sm text-[#c4c8be] hover:text-white transition-colors font-[var(--font-work-sans)]"
                aria-label="Call +91 8500395821"
              >
                +91 8500395821
              </a>
            </div>

            {/* Phone 2 */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#a5f95b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17v-.08z" />
              </svg>
              <a
                href="tel:+918500395831"
                className="text-sm text-[#c4c8be] hover:text-white transition-colors font-[var(--font-work-sans)]"
                aria-label="Call +91 8500395831"
              >
                +91 8500395831
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#a5f95b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a
                href="mailto:agrinestmicrogreens@gmail.com"
                className="text-sm text-[#c4c8be] hover:text-white transition-colors font-[var(--font-work-sans)]"
              >
                agrinestmicrogreens@gmail.com
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-6 border-t border-[#333730] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm opacity-60 font-[var(--font-work-sans)]">
          &copy; {new Date().getFullYear()} AgriNest Microgreens. All rights reserved.
        </p>
        <div className="flex gap-4 items-center opacity-50">
          <span className="text-xs font-bold tracking-wider font-[var(--font-work-sans)]">VISA</span>
          <span className="text-xs font-bold tracking-wider font-[var(--font-work-sans)]">MASTERCARD</span>
          <span className="text-xs font-bold tracking-wider font-[var(--font-work-sans)]">UPI</span>
        </div>
      </div>
    </footer>
  );
}
