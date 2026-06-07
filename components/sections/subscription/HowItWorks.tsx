"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const steps = [
  {
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
    title: "Pick Your Plan",
    desc: "Select the subscription tier that matches your household's needs and delivery frequency.",
  },
  {
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h.5" />
        <path d="M12 2a3 3 0 0 1 3 3v1h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-.5" />
        <path d="M8 21v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
        <path d="M3 21h18" />
        <path d="M12 11v4" />
      </svg>
    ),
    title: "We Harvest",
    desc: "Our farmers pick your microgreens at the peak of nutrition just hours before dispatch.",
  },
  {
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect width="13" height="8" x="9" y="11" rx="1" />
        <circle cx="12" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
      </svg>
    ),
    title: "Doorstep Delivery",
    desc: "Enjoy fresh, organic microgreens delivered in eco-friendly packaging every single week.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#eeeee9] py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
            How It Works
          </h2>
          <p className="text-[#424843] mt-2 font-[var(--font-work-sans)]">
            Freshness from farm to fork in 3 easy steps.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Dashed connector — desktop only */}
          <div className="hidden md:block absolute top-[40px] left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-px border-t-2 border-dashed border-[#c1c8c1]" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.55 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Icon circle */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-20 h-20 bg-[#a5f95b] text-[#3b7100] rounded-full flex items-center justify-center mb-6 shadow-md"
              >
                {step.icon}
              </motion.div>

              <h4 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] mb-3">
                {step.title}
              </h4>
              <p className="text-sm text-[#424843] font-[var(--font-work-sans)] leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
