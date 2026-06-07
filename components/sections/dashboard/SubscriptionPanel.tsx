"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

export default function SubscriptionPanel() {
  return (
    <FadeIn direction="right" delay={0.15}>
      <div
        className="bg-[#1b3c2a] rounded-xl p-6 h-full relative overflow-hidden"
        style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.18)" }}
      >
        {/* Decorative leaf watermark */}
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none select-none">
          <svg className="w-44 h-44 text-white rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Heading */}
          <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-white mb-5">
            Your Subscriptions
          </h3>

          {/* Active subscription card */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-[#a5f95b] text-[#3b7100] font-bold text-[9px] uppercase tracking-widest px-2 py-1 rounded font-[var(--font-work-sans)]">
                Active
              </span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <RefreshIcon />
              </motion.div>
            </div>
            <h4 className="font-bold text-lg text-white font-[var(--font-work-sans)] leading-tight mb-1">
              Weekly Vitality Box
            </h4>
            <p className="text-xs text-white/70 font-[var(--font-work-sans)] mb-4">
              Delivers every Tuesday morning
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-white font-[var(--font-work-sans)]">
                $34.00/mo
              </span>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#a5f95b] hover:underline"
              >
                Manage
              </motion.button>
            </div>
          </div>

          {/* Next delivery card */}
          <div
            className="bg-[#386b00] rounded-lg p-4 mb-5 border border-[#8adb41]/30"
            style={{ boxShadow: "0 4px 12px rgba(56,107,0,0.35)" }}
          >
            <p className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-white/80 mb-2">
              Next Delivery
            </p>
            <div className="flex items-center gap-2 text-white">
              <CalendarIcon />
              <span className="font-[var(--font-libre-caslon)] text-2xl font-bold">
                Oct 29
              </span>
            </div>
            <p className="text-xs text-white/80 font-[var(--font-work-sans)] mt-2">
              Customization closes in 2 days
            </p>
          </div>

          {/* Browse plans button */}
          <Link href="/subscription">
            <motion.span
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="block w-full border border-white/30 text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3 rounded-lg text-center cursor-pointer transition-colors hover:border-white/50"
            >
              Browse All Plans
            </motion.span>
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}

function RefreshIcon() {
  return (
    <svg className="w-5 h-5 text-[#a5f95b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
