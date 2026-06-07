"use client";

import { motion } from "framer-motion";

export default function ProductsHero() {
  return (
    <header className="bg-[#f4f4ee] py-16 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-[var(--font-libre-caslon)] text-[40px] md:text-[56px] font-bold text-[#032616] mb-4 leading-tight tracking-[-0.02em]"
        >
          Our Organic Harvest
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-lg text-[#424843] max-w-2xl leading-relaxed font-[var(--font-work-sans)]"
        >
          Discover our complete collection of nutrient-dense microgreens, premium heirloom seeds,
          and professional-grade growing kits designed for the modern kitchen.
        </motion.p>
      </div>
    </header>
  );
}
