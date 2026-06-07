"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

export default function SubscribeCTA() {
  return (
    <section className="px-5 md:px-16 py-24 bg-[#333730] text-white">
      <div className="max-w-[1280px] mx-auto text-center">
        <FadeIn>
          <h2 className="font-[var(--font-libre-caslon)] text-[36px] md:text-[56px] leading-tight font-bold mb-6 text-[#83a78f]">
            Never Miss a Harvest
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto opacity-80 font-[var(--font-work-sans)] leading-relaxed">
            Join the AgriNest Subscription and receive a rotation of fresh microgreens delivered
            weekly or bi-weekly. Save 15% on every harvest.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-[#386b00] text-white rounded-lg font-[var(--font-libre-caslon)] text-xl font-bold hover:bg-[#032616] transition-colors"
            >
              Explore Plans
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-transparent border border-white rounded-lg font-[var(--font-libre-caslon)] text-xl font-bold hover:bg-white hover:text-[#032616] transition-colors"
            >
              How It Works
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
