"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const plans = [
  {
    id: "weekly",
    name: "Weekly Plan",
    tagline: "Perfect for beginners",
    price: "₹1,649",
    period: "/week",
    features: ["7 Days Supply", "1 Variety / Pack", "Free Delivery"],
    featured: false,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    tagline: "Best value for your health",
    price: "₹5,799",
    period: "/month",
    features: ["30 Days Supply", "4 Varieties / Month", "Free Delivery + Surprise"],
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "family",
    name: "Family Pack",
    tagline: "Great for families",
    price: "₹9,999",
    period: "/month",
    features: ["30 Days Supply", "8 Varieties / Month", "Free Delivery + Gifts"],
    featured: false,
  },
];

function CheckIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 ${filled ? "text-[#386b00]" : "text-[#386b00]"}`}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {filled ? (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </>
      )}
    </svg>
  );
}

export default function SubscriptionPlans() {
  return (
    <section id="plans" className="bg-[#f4f4ee] py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
            Subscribe &amp; Save More
          </h2>
          <p className="text-[#424843] mt-2 font-[var(--font-work-sans)]">Flexible plans for your daily green intake</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.55 }}
              whileHover={!plan.featured ? { y: -8 } : {}}
              className={`bg-white rounded-xl text-center relative transition-all ${
                plan.featured
                  ? "border-2 border-[#386b00] scale-105 z-10"
                  : "border border-[#e3e3dd]"
              }`}
              style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.1)", padding: "2rem" }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#386b00] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <h3 className="font-bold text-xs tracking-widest uppercase text-[#032616] mb-1 font-[var(--font-work-sans)]">
                {plan.name}
              </h3>
              <p className="text-sm text-[#727973] mb-6 font-[var(--font-work-sans)]">{plan.tagline}</p>

              <div className="mb-8">
                <span className="font-[var(--font-libre-caslon)] text-4xl font-bold text-[#032616]">{plan.price}</span>
                <span className="text-[#424843] text-sm font-[var(--font-work-sans)]">{plan.period}</span>
              </div>

              <ul className="text-left space-y-4 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className={`flex items-center gap-3 text-sm font-[var(--font-work-sans)] ${plan.featured ? "font-bold text-[#032616]" : "text-[#1a1c19]"}`}>
                    <CheckIcon filled={plan.featured} />
                    {feat}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3.5 rounded-lg font-bold text-xs tracking-widest uppercase font-[var(--font-work-sans)] transition-colors ${
                  plan.featured
                    ? "bg-[#386b00] text-white hover:bg-[#032616]"
                    : "border-2 border-[#032616] text-[#032616] hover:bg-[#032616] hover:text-white"
                }`}
              >
                Subscribe Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
