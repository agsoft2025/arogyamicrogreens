"use client";

import { motion } from "framer-motion";

export default function WishlistHeader() {
  return (
    <div className="mb-12 md:mb-16">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
        className="font-[var(--font-libre-caslon)] text-[40px] md:text-[56px] font-bold text-[#032616] leading-tight mb-4"
      >
        Your Wishlist
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-lg text-[#424843] font-[var(--font-work-sans)] max-w-xl leading-relaxed"
      >
        Manage your favorite organic microgreens and artisanal products. Move
        them to your cart when you&apos;re ready for the next harvest.
      </motion.p>
    </div>
  );
}
