"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

interface PlanFeature {
  text: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

interface Plan {
  id: string;
  tier: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: PlanFeature[];
  featured?: boolean;
  badge?: string;
  buttonStyle: "primary" | "secondary";
}

const GiftIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect width="22" height="5" x="1" y="7" />
    <line x1="12" x2="12" y1="22" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 shrink-0 text-[#386b00]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="m5 13 4 4L19 7" />
  </svg>
);

const plans: Plan[] = [
  {
    id: "weekly",
    tier: "Entry Level",
    name: "Weekly Plan",
    tagline: "Perfect for solo health enthusiasts",
    price: "$19",
    period: "/week",
    features: [
      { text: "7 Days Supply" },
      { text: "1 Variety / Pack" },
      { text: "Free Delivery" },
    ],
    buttonStyle: "primary",
  },
  {
    id: "monthly",
    tier: "Best Value",
    name: "Monthly Plan",
    tagline: "Great for couples and chefs",
    price: "$59",
    period: "/month",
    features: [
      { text: "30 Days Supply" },
      { text: "4 Varieties / Pack" },
      { text: "Free Delivery" },
      {
        text: "Surprise Monthly Gift",
        highlight: true,
        icon: <StarIcon />,
      },
    ],
    featured: true,
    badge: "Most Popular",
    buttonStyle: "secondary",
  },
  {
    id: "family",
    tier: "Bulk Bundle",
    name: "Family Pack",
    tagline: "Ideal for large healthy households",
    price: "$99",
    period: "/month",
    features: [
      { text: "30 Days Supply (XL)" },
      { text: "6 Varieties / Pack" },
      { text: "Free Delivery" },
      {
        text: "Family Workshop Pass",
        highlight: true,
        icon: <GiftIcon />,
      },
    ],
    buttonStyle: "primary",
  },
];

export default function PricingCards() {
  return (
    <section className="py-24 px-5 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn className="text-center mb-14">
          <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616]">
            Choose Your Plan
          </h2>
          <p className="text-[#424843] mt-2 font-[var(--font-work-sans)]">
            Tailored nutrition for every lifestyle. Cancel or pause anytime.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(3,38,22,0.14)" }}
              className={`relative bg-white rounded-xl flex flex-col p-8 ${
                plan.featured
                  ? "border-2 border-[#386b00]"
                  : "border border-[#e3e3dd]"
              }`}
              style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.10)" }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#386b00] text-white px-5 py-1.5 rounded-full font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className={`mb-6 ${plan.featured ? "text-center" : ""}`}>
                <span
                  className={`font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] ${
                    plan.featured ? "text-[#386b00]" : "text-[#727973]"
                  }`}
                >
                  {plan.tier}
                </span>
                <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] mt-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className={`mb-8 ${plan.featured ? "text-center" : ""}`}>
                <span className="font-[var(--font-libre-caslon)] text-5xl font-bold text-[#032616]">
                  {plan.price}
                </span>
                <span className="text-[#424843] font-[var(--font-work-sans)] ml-1">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-auto">
                {plan.features.map((feat) => (
                  <li
                    key={feat.text}
                    className={`flex items-center gap-3 ${
                      feat.highlight ? "font-bold text-[#386b00]" : "text-[#1a1c19]"
                    } font-[var(--font-work-sans)]`}
                  >
                    {feat.icon ? (
                      <span className="text-[#386b00]">{feat.icon}</span>
                    ) : (
                      <CheckIcon />
                    )}
                    <span className="text-sm">{feat.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full mt-8 py-4 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] transition-colors ${
                  plan.buttonStyle === "secondary"
                    ? "bg-[#386b00] text-white hover:bg-[#032616]"
                    : "bg-[#032616] text-white hover:bg-[#386b00]"
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
