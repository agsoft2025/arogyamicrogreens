"use client";

import { motion } from "framer-motion";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#fafaf4] border-b border-[#e3e3dd] h-20 flex items-center px-8">
      <div className="flex items-center justify-between w-full">
        {/* Title */}
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

        {/* Right actions */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex items-center gap-4"
        >
          {/* Date range pill */}
          <button className="flex items-center gap-2 bg-[#f4f4ee] border border-[#c1c8c1] rounded-full px-4 py-2 text-sm text-[#424843] font-[var(--font-work-sans)] hover:bg-[#e8e8e3] transition-colors">
            <CalendarIcon />
            <span className="hidden sm:inline text-[12px] font-bold">Oct 1 – Oct 31</span>
            <ChevronDownIcon />
          </button>

          {/* Bell */}
          <button className="relative p-2 rounded-full hover:bg-[#f4f4ee] transition-colors" aria-label="Notifications">
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] border border-[#fafaf4]" />
          </button>

          {/* Account */}
          <button className="p-2 rounded-full hover:bg-[#f4f4ee] transition-colors" aria-label="Account">
            <AccountIcon />
          </button>
        </motion.div>
      </div>
    </header>
  );
}

/* ── Icons ───────────────────────── */
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
function AccountIcon() {
  return (
    <svg className="w-5 h-5 text-[#424843]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
