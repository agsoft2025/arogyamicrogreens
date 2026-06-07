"use client";

import { motion } from "framer-motion";

export default function SubscriptionHero() {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src="https://lh3.googleusercontent.com/aida/AP1WRLuKxMbzFxLqUtRhMdGAjL3p3ge51Oc8dqIKv2TT7QNQ2aISgt4bRgip1eBSqgttBnslGYIcnZigCAj_b2lRz3rp_n74RrRoAtOCZoseqCPIhU7lCEttDRgxu_0bYdtd9JcCFPJNPMottom2kopWX4cYuMsd5W0EUsPjBqJM7BMxsdte2XJgwd8sF-iRrSaGxwQ1ZHkK83t_ZvfW3C_Pp-yjVgS4Oc6dQUcWSlJLsUEFsNPz-Taqnc8P5DA"
        alt="Fresh microgreens growing in a tray"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#032616]/50" />

      {/* Text */}
      <div className="relative z-10 text-center text-white px-5 md:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-[var(--font-libre-caslon)] text-[36px] md:text-[56px] leading-tight font-bold mb-4 drop-shadow-lg"
        >
          Harvest Freshness Weekly
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-lg max-w-2xl mx-auto drop-shadow-md font-[var(--font-work-sans)] leading-relaxed"
        >
          Nourish your body with our premium organic microgreen subscriptions, delivered directly
          from our urban farm to your doorstep.
        </motion.p>
      </div>
    </section>
  );
}
