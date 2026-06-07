"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CartHeader() {
  return (
    <div className="mb-10 md:mb-12">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm font-[var(--font-work-sans)] text-[#424843] mb-3"
      >
        <Link
          href="/"
          className="hover:text-[#032616] transition-colors hover:underline"
        >
          Home
        </Link>
        <span className="opacity-50">/</span>
        <span className="font-bold text-[#032616]">Your Shopping Cart</span>
      </motion.nav>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.25, 0.4, 0.25, 1] }}
        className="font-[var(--font-libre-caslon)] text-[40px] md:text-[56px] font-bold text-[#032616] leading-tight"
      >
        Review Your Harvest
      </motion.h1>
    </div>
  );
}
