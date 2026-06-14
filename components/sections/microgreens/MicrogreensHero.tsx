"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import peaShootsHero from "@/assests/peashootsmicrogreen.png";

const badges = [
  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    label: "100% Organic",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-1 3-1c0 0-1-1-3-1s-3 2-3 2 1 0 2 .5C10 6 17 8 17 8z" />
      </svg>
    ),
    label: "Zero Pesticides",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect width="13" height="8" x="9" y="11" rx="1" />
        <circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
      </svg>
    ),
    label: "Harvest-to-Door",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
};

export default function MicrogreensHero() {
  return (
    <section
      className="relative px-5 md:px-16 py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(at 0% 0%, rgba(165,249,91,0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(27,60,42,0.05) 0, transparent 50%), #f4f4ee",
      }}
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10"
        >
          <motion.span
            variants={itemVariants}
            className="font-bold text-[11px] tracking-widest uppercase text-[#386b00] block mb-4 font-[var(--font-work-sans)]"
          >
            Nature&apos;s Multivitamin
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-[var(--font-libre-caslon)] text-[40px] md:text-[56px] leading-tight font-bold text-[#032616] mb-6"
          >
            Tiny Greens,
            <br />
            <span className="italic">Massive Impact.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-[#424843] mb-10 max-w-lg leading-relaxed font-[var(--font-work-sans)]"
          >
            Microgreens contain up to 40 times higher concentrations of vital nutrients than their
            mature counterparts. Each leaf is a concentrated burst of flavor, antioxidants, and
            life-force harvested at the peak of vitality.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 bg-[#eeeee9] px-4 py-2.5 rounded-full border border-[#c1c8c1]"
              >
                <span className="text-[#386b00]">{b.icon}</span>
                <span className="font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)]">
                  {b.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative"
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-3">
            <Image
              src={peaShootsHero}
              alt="Fresh pea shoots microgreens"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Nutrient Density card */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -bottom-8 -left-4 md:-left-8 bg-white p-5 rounded-xl shadow-xl border border-[#e3e3dd] max-w-[200px] -rotate-3 hidden md:block"
          >
            <p className="font-bold text-[11px] tracking-widest uppercase text-[#386b00] mb-2 font-[var(--font-work-sans)]">
              Nutrient Density
            </p>
            <div className="h-2 w-full bg-[#eeeee9] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "95%" }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[#386b00] rounded-full"
              />
            </div>
            <p className="text-xs mt-2 text-[#424843] leading-relaxed font-[var(--font-work-sans)]">
              Vitamins C, E, and K are significantly more concentrated in micro-varieties.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
