"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import subscriptionHeroImg from "@/assests/subscriptionhero.jpg";

export default function SubscriptionHero() {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={subscriptionHeroImg}
        alt="Fresh microgreens growing in a tray"
        fill
        sizes="100vw"
        className="object-cover"
        priority
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
