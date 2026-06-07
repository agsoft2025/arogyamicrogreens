"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

export default function SubscriptionCTA() {
  return (
    <section className="px-5 md:px-16 py-20">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn>
          <div className="bg-[#032616] rounded-2xl px-10 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            {/* Decorative leaf watermark */}
            <div className="absolute -right-16 -bottom-16 opacity-[0.07] pointer-events-none select-none">
              <svg className="w-72 h-72 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
              </svg>
            </div>

            {/* Left text */}
            <div className="relative z-10 max-w-xl">
              <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-white mb-3">
                Start Your Organic Journey Today
              </h2>
              <p className="text-white/75 font-[var(--font-work-sans)] leading-relaxed">
                Get 20% off your first month when you sign up for any subscription plan this week.
              </p>
            </div>

            {/* Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#386b00] text-white px-8 py-4 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] hover:bg-[#a5f95b] hover:text-[#032616] transition-colors whitespace-nowrap"
              >
                View All Plans
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: "#f4f4ee" }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-[#032616] px-8 py-4 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] transition-colors whitespace-nowrap"
              >
                Chat With an Expert
              </motion.button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
