"use client";

import { motion } from "framer-motion";

export default function DashboardHeader() {
  return (
    <header className="mb-8 md:mb-10">
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
        className="font-[var(--font-libre-caslon)] text-[32px] md:text-[40px] font-bold text-[#032616] mb-2 leading-tight"
      >
        Welcome back, Arthur.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-base text-[#424843] font-[var(--font-work-sans)]"
      >
        Track your farm-fresh microgreens and manage your garden-to-table experience.
      </motion.p>
    </header>
  );
}
