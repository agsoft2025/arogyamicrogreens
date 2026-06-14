"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative bg-[#fafaf4] py-10 md:py-12 overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1b3c2a 0.8px, transparent 0.8px)",
          backgroundSize: "24px 24px",
          opacity: 0.06,
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-[var(--font-libre-caslon)] text-[40px] md:text-[56px] font-bold text-[#032616] mb-6 leading-tight tracking-[-0.02em]"
        >
          Let&apos;s Grow Together
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-lg text-[#424843] max-w-2xl mx-auto leading-relaxed font-[var(--font-work-sans)]"
        >
          Have a question about our microgreens, subscriptions, or workshops? Our team is rooted in
          providing the best support for your organic journey.
        </motion.p>
      </div>
    </section>
  );
}
