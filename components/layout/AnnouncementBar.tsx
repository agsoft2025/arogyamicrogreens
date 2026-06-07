"use client";

import { motion } from "framer-motion";

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#032616] text-white py-2 px-5 md:px-16"
    >
      <div className="max-w-[1280px] mx-auto flex justify-between items-center text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
            </svg>
            Freshly Harvested Daily
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect width="13" height="8" x="9" y="11" rx="1" />
              <circle cx="12" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
            </svg>
            Same Day Delivery
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#a5f95b]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          4.9/5 from 1,200+ Customers
        </div>
      </div>
    </motion.div>
  );
}
