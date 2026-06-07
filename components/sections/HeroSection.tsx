"use client";

import { motion } from "framer-motion";
import Heroimg from "@/assests/heroimg.png";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative px-5 md:px-16 py-16 md:py-24 overflow-hidden bg-[#f4f4ee]">
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="font-[var(--font-libre-caslon)] text-[36px] md:text-[56px] leading-tight font-bold text-[#032616] mb-4"
          >
            Eat Fresh.<br />Live AgriNest.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg text-[#424843] mb-10 max-w-md leading-relaxed font-[var(--font-work-sans)]"
          >
            Farm-fresh microgreens packed with nutrients, delivered to your doorstep within hours.
            Experience the power of pure, hydroponic greens.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#032616] text-white px-8 py-4 rounded-lg font-bold text-xs tracking-widest uppercase font-[var(--font-work-sans)] shadow-lg"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="border-2 border-[#032616] text-[#032616] px-8 py-4 rounded-lg font-bold text-xs tracking-widest uppercase font-[var(--font-work-sans)]"
            >
              Subscribe &amp; Save
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 grid grid-cols-2 gap-4"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#386b00] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <span className="text-xs font-medium text-[#1a1c19] font-[var(--font-work-sans)]">100% Organic &amp; Safe</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#386b00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-xs font-medium text-[#1a1c19] font-[var(--font-work-sans)]">Fresh to Your Door</span>
            </div>
          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative"
        >
          <Image
            src={Heroimg}
            alt="Hero"
            width={650}
            height={500}
          />


          {/* Delivered Today badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -bottom-5 -left-4 md:-left-8 bg-white p-4 rounded-xl shadow-xl border border-[#e3e3dd] flex items-center gap-3"
          >
            <div className="bg-[#a5f95b] p-2 rounded-full">
              <svg className="w-4 h-4 text-[#3b7100]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect width="13" height="8" x="9" y="11" rx="1" />
                <circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-xs text-[#032616] font-[var(--font-work-sans)]">Delivered Today</p>
              <p className="text-xs opacity-60 font-[var(--font-work-sans)]">Harvested 2h ago</p>
            </div>
          </motion.div>

          {/* Eco badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="absolute top-5 right-5 bg-white p-2 rounded-full shadow-md"
          >
            <div className="border-2 border-[#a5f95b] rounded-full p-1.5">
              <svg className="w-4 h-4 text-[#386b00]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
