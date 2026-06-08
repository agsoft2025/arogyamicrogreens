"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#fafaf4] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-center max-w-lg"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#ffdad6] flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-[#ba1a1a]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </motion.div>

        {/* Status code */}
        <p className="font-[var(--font-work-sans)] text-sm font-bold tracking-widest uppercase text-[#ba1a1a] mb-2">
          Error 403
        </p>

        {/* Headline */}
        <h1 className="font-[var(--font-libre-caslon)] text-4xl md:text-5xl font-bold text-[#032616] mb-4 leading-tight">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-[#424843] font-[var(--font-work-sans)] text-base leading-relaxed mb-10">
          You don&apos;t have permission to view this page. This area is
          restricted to administrators. If you believe this is a mistake, please
          contact support.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-block bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-8 py-4 rounded-xl hover:bg-[#386b00] transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/profile"
              className="inline-block border-2 border-[#032616] text-[#032616] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] px-8 py-4 rounded-xl hover:bg-[#032616] hover:text-white transition-colors"
            >
              My Account
            </Link>
          </motion.div>
        </div>

        {/* Decorative divider */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#c1c8c1]/40" />
          <span className="font-[var(--font-libre-caslon)] text-[#727973] text-sm">
            AgriNest
          </span>
          <div className="flex-1 h-px bg-[#c1c8c1]/40" />
        </div>
      </motion.div>
    </main>
  );
}
