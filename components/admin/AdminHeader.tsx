"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";

export default function AdminHeader() {
  const router               = useRouter();
  const { user, logout }     = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef              = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [menuOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    router.push("/");
  }

  /* Initials avatar */
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-40 bg-[#fafaf4] border-b border-[#e3e3dd] h-20 flex items-center px-8">
      <div className="flex items-center justify-between w-full">

        {/* ── Page title ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <h2 className="font-[var(--font-libre-caslon)] text-[22px] font-bold text-[#1a1c19] leading-tight">
            Analytics &amp; Insights
          </h2>
          <p className="text-xs text-[#727973] font-[var(--font-work-sans)] mt-0.5">
            October 2025 · Live data
          </p>
        </motion.div>

        {/* ── Right actions ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex items-center gap-3"
        >
          {/* ── User Site switcher ─────────────────────────────
               Lime-green pill — visually distinct from admin chrome.
               Always visible in the admin header; one click returns
               the admin to the customer-facing storefront.
          ─────────────────────────────────────────────────────── */}
          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Return to customer site"
            className="flex items-center gap-2 bg-[#a5f95b] text-[#032616] px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#8fe040] transition-colors shadow-sm"
          >
            <UserSiteIcon />
            <span className="hidden sm:inline">User Site</span>
          </motion.button>

          {/* Date range pill */}
          <button className="flex items-center gap-2 bg-[#f4f4ee] border border-[#c1c8c1] rounded-full px-4 py-2 text-sm text-[#424843] font-[var(--font-work-sans)] hover:bg-[#e8e8e3] transition-colors">
            <CalendarIcon />
            <span className="hidden sm:inline text-[12px] font-bold">Oct 1 – Oct 31</span>
            <ChevronDownIcon />
          </button>

          {/* Notifications bell */}
          <button
            className="relative p-2 rounded-full hover:bg-[#f4f4ee] transition-colors"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] border border-[#fafaf4]" />
          </button>

          {/* ── Account menu ───────────────────────────────── */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors ${
                menuOpen ? "bg-[#e8e8e3]" : "hover:bg-[#f4f4ee]"
              }`}
            >
              {/* Initials avatar */}
              <div className="w-8 h-8 rounded-full bg-[#386b00] text-white flex items-center justify-center font-bold text-[11px] tracking-wide font-[var(--font-work-sans)] shrink-0 select-none">
                {initials}
              </div>
              <span className="hidden sm:block text-[12px] font-bold text-[#1a1c19] font-[var(--font-work-sans)] max-w-[100px] truncate">
                {user?.name ?? "Admin"}
              </span>
              <motion.span
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon />
              </motion.span>
            </button>

            {/* ── Dropdown ───────────────────────────────────── */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  key="dropdown"
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e3e3dd] overflow-hidden"
                  role="menu"
                  aria-label="Account options"
                >
                  {/* User info header */}
                  <div className="px-4 py-4 border-b border-[#f4f4ee]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#386b00] text-white flex items-center justify-center font-bold text-sm font-[var(--font-work-sans)] shrink-0 select-none">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-[#1a1c19] font-[var(--font-work-sans)] truncate">
                          {user?.name ?? "Admin"}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5">
                          {user?.role === "admin" ? "Administrator" : user?.role ?? ""}
                        </p>
                        {user?.mobileNumber && (
                          <p className="text-[11px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5 truncate">
                            {user.mobileNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <button
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-bold text-[#424843] font-[var(--font-work-sans)] hover:bg-[#f4f4ee] hover:text-[#032616] transition-colors text-left"
                    >
                      <ProfileIcon />
                      Profile
                    </button>

                    <div className="my-1 border-t border-[#f4f4ee]" />

                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-bold text-[#ba1a1a] font-[var(--font-work-sans)] hover:bg-[#ffdad6]/30 transition-colors text-left"
                    >
                      <LogoutIcon />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

/* ── Icons ─────────────────────────────────────────────────────── */

function UserSiteIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[#424843] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg className="w-3 h-3 text-[#727973] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg className="w-5 h-5 text-[#424843]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-[#9ca8a3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
