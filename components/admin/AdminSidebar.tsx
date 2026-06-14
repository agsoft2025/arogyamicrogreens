"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";

/* ── Nav items ───────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "Overview",         href: "/admin/dashboard", icon: <DashboardIcon /> },
  { label: "Product Catalog",  href: "/admin/products",  icon: <PlantIcon /> },
  { label: "Order Management", href: "/admin/orders",    icon: <ShippingIcon /> },
  { label: "User Management",  href: "/admin/users",     icon: <GroupIcon /> },
  { label: "Settings",         href: "/admin/settings",  icon: <SettingsIcon /> },
];

/* ── Component ───────────────────────────────────────────────── */

export default function AdminSidebar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user, logout } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* Initials avatar from user name */
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  /* Format mobile for display */
  const displayPhone = user?.mobileNumber
    ? `+91 ${user.mobileNumber.replace(/^\+91/, "").replace(/(\d{5})(\d{5})/, "$1 $2")}`
    : "";

  async function handleLogout() {
    setIsLoggingOut(true);
    logout();                // clears localStorage + dispatches LOGOUT + fires apiLogout()
    router.push("/");        // immediate redirect — RoleGuard also redirects as belt-and-suspenders
  }

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f4f4ee] border-r border-[#c1c8c1]/30 p-6 z-50">
        {/* ── Brand ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-10"
        >
          <h1 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] leading-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-[#424843] font-[var(--font-work-sans)] mt-0.5">
            Organic Management
          </p>
        </motion.div>

        {/* ── Nav ────────────────────────────────────────────── */}
        <nav className="flex-1 flex flex-col gap-1" role="navigation" aria-label="Admin navigation">
          {NAV_ITEMS.map((item, i) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-[12px] tracking-wide font-[var(--font-work-sans)] transition-colors relative ${
                    active
                      ? "bg-[#a5f95b] text-[#3b7100]"
                      : "text-[#424843] hover:bg-[#e8e8e3] hover:text-[#032616]"
                  }`}
                >
                  <span className={active ? "text-[#3b7100]" : "text-[#424843]"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* ── Bottom section ─────────────────────────────────── */}
        <div className="pt-6 space-y-4 border-t border-[#c1c8c1]/30">

          {/* User profile card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-3 px-2"
          >
            {/* Initials avatar */}
            <div className="w-10 h-10 rounded-full bg-[#386b00] text-white flex items-center justify-center shrink-0 font-bold text-sm font-[var(--font-work-sans)] select-none">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm font-[var(--font-work-sans)] text-[#1a1c19] truncate">
                {user?.name ?? "Admin"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#424843] font-[var(--font-work-sans)]">
                {user?.role === "admin" ? "Administrator" : user?.role ?? "Admin"}
              </p>
              {displayPhone && (
                <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)] mt-0.5 truncate">
                  {displayPhone}
                </p>
              )}
            </div>
          </motion.div>

          {/* Logout button */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowConfirm(true)}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#c1c8c1] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#ffdad6]/40 hover:border-[#ba1a1a]/30 hover:text-[#ba1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Log out of admin panel"
          >
            {isLoggingOut ? (
              <SpinnerIcon className="w-4 h-4 animate-spin" />
            ) : (
              <LogoutIcon />
            )}
            {isLoggingOut ? "Logging out…" : "Logout"}
          </motion.button>
        </div>
      </aside>

      {/* ── Confirmation modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[200]"
              onClick={() => setShowConfirm(false)}
            />

            {/* Dialog */}
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl p-8"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="logout-dialog-title"
              aria-describedby="logout-dialog-desc"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#ffdad6]/60 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>

              <h2
                id="logout-dialog-title"
                className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#1a1c19] text-center mb-2"
              >
                Log out?
              </h2>
              <p
                id="logout-dialog-desc"
                className="text-sm text-[#727973] font-[var(--font-work-sans)] text-center mb-7 leading-relaxed"
              >
                You'll be signed out of the Admin Portal. Any unsaved changes will be lost.
              </p>

              <div className="flex gap-3">
                {/* Cancel */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-[#e3e3dd] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#f4f4ee] transition-colors"
                >
                  Cancel
                </motion.button>

                {/* Confirm logout */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowConfirm(false);
                    handleLogout();
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#ba1a1a] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#93000a] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log Out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Icons ─────────────────────────────────────────────────────── */

function DashboardIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
function PlantIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2 3.7-1.2.2-2.5.1-3.5-.6C7 11.7 6.5 10 7 9c1 0 2 .4 2.5 1.4z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.2-.1 2.4-.5 3.3-1.4.9-.9 1.3-2.2 1.1-3.4-.9 0-2.2.3-3.3.8z" />
    </svg>
  );
}
function ShippingIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
      <rect width="13" height="8" x="9" y="11" rx="1" />
      <circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
    </svg>
  );
}
function GroupIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
