"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { useCart } from "@/store/cartStore";
import { useWishlist } from "@/store/wishlistStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "MicroGreens", href: "/microgreens" },
  { label: "Subscription Plans", href: "/subscription" },
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, openLoginModal } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Show admin controls only for admin role
  const isAdmin = isAuthenticated && user?.role === "admin";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]) && href.split("#")[0] !== "/";
  };

  return (
    <header className="bg-[#fafaf4] sticky top-0 z-50 shadow-sm">
      <nav className="flex justify-between items-center w-full px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
            AgriNest
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:flex items-center gap-6 text-[12px] font-bold tracking-widest uppercase font-[var(--font-work-sans)]"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative py-1 transition-colors ${
                isActive(link.href)
                  ? "text-[#032616]"
                  : "text-[#424843] hover:text-[#032616]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#032616]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          {/* Search */}
          <div className="hidden lg:flex items-center bg-[#eeeee9] rounded-full px-4 py-2 gap-2">
            <svg className="w-4 h-4 text-[#727973]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="bg-transparent border-none outline-none text-sm w-44 text-[#1a1c19] placeholder:text-[#727973] font-[var(--font-work-sans)]"
              placeholder="Search Microgreens..."
              type="text"
            />
          </div>

          {/* Icon buttons */}
          <div className="flex items-center gap-3 text-[#032616]">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hover:opacity-70 transition-opacity relative"
            >
              <svg
                className="w-5 h-5"
                fill={pathname === "/wishlist" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#386b00] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="hover:opacity-70 transition-opacity relative"
            >
              <svg
                className="w-5 h-5"
                fill={pathname === "/cart" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-[#386b00] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>

            {/* Admin pill — only for admin role, desktop */}
            {isAdmin && (
              <motion.button
                onClick={() => router.push("/admin/dashboard")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Go to admin dashboard"
                className="flex items-center gap-1.5 bg-[#032616] text-[#a5f95b] px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#0a3d20] transition-colors shadow-sm"
              >
                <CrownIcon />
                <span>Admin</span>
              </motion.button>
            )}

            {isAuthenticated ? (
              <Link
                href="/profile"
                aria-label="My profile"
                className="hover:opacity-70 transition-opacity"
              >
                <svg
                  className="w-5 h-5"
                  fill={pathname === "/profile" ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => openLoginModal("/profile")}
                aria-label="Sign in"
                className="hover:opacity-70 transition-opacity text-[#032616]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-[#032616]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#fafaf4] border-t border-[#e3e3dd]"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block font-bold text-sm uppercase tracking-widest font-[var(--font-work-sans)] py-2 border-b border-[#eeeee9] ${
                      isActive(link.href) ? "text-[#032616]" : "text-[#424843]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Admin entry — mobile, only for admin role */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/admin/dashboard"); }}
                    className="w-full flex items-center gap-2 bg-[#032616] text-[#a5f95b] px-4 py-3 rounded-xl font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)]"
                  >
                    <CrownIcon />
                    Admin Dashboard
                  </button>
                </motion.div>
              )}

              <div className="flex items-center bg-[#eeeee9] rounded-full px-4 py-2 gap-2 mt-2">
                <svg className="w-4 h-4 text-[#727973]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  className="bg-transparent border-none outline-none text-sm w-full text-[#1a1c19] placeholder:text-[#727973]"
                  placeholder="Search Microgreens..."
                  type="text"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function CrownIcon() {
  return (
    <svg
      className="w-3 h-3 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M2 19h20v2H2v-2zM2 5l5 7 5-7 5 7 5-7v12H2V5z" />
    </svg>
  );
}
