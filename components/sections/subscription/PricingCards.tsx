"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import { getActivePlans, SubscriptionPlan } from "@/services/subscription-plan.api";

/* -- Icons -- */

const GiftIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect width="22" height="5" x="1" y="7" />
    <line x1="12" x2="12" y1="22" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const BulletIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LeafIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-5 8Z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* -- Dot pattern -- */

const DOT_PATTERN = `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='1.2' fill='%23b8d4a8' fill-opacity='0.45'/%3E%3C/svg%3E")`;

/* -- Feature icon map -- */

function getFeatureIcon(iconType?: string) {
  switch (iconType) {
    case "gift": return <GiftIcon />;
    case "star": return <StarIcon />;
    case "check": return <CheckIcon />;
    default: return null;
  }
}

/* -- Skeleton loader -- */

function PlanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-[#dde5da] p-8 bg-white animate-pulse">
          <div className="h-4 w-16 bg-[#e8f0e4] rounded-full mb-4" />
          <div className="h-7 w-32 bg-[#e8f0e4] rounded mb-2" />
          <div className="h-3 w-48 bg-[#f0f5ee] rounded mb-6" />
          <div className="h-16 w-28 bg-[#e8f0e4] rounded mb-8" />
          <div className="space-y-3">
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="h-10 bg-[#f5f8f3] rounded-xl" />
            ))}
          </div>
          <div className="h-12 bg-[#e8f0e4] rounded-xl mt-8" />
        </div>
      ))}
    </div>
  );
}

/* -- Plan Grid -- */

function PlanGrid({ plans }: { plans: SubscriptionPlan[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      {plans.map((plan, i) => {
        const featured = plan.featured;

        return (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.13, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            whileHover={{
              y: -10,
              boxShadow: featured
                ? "0 28px 56px rgba(56,107,0,0.22), 0 0 0 2px rgba(56,107,0,0.25)"
                : "0 28px 52px rgba(3,38,22,0.13)",
            }}
            className={`relative flex flex-col rounded-2xl overflow-hidden transition-shadow duration-300 ${
              featured ? "border-2 border-[#386b00]" : "border border-[#dde5da]"
            }`}
            style={{
              boxShadow: featured
                ? "0 8px 32px rgba(56,107,0,0.15), 0 0 0 1px rgba(56,107,0,0.1)"
                : "0 4px 20px rgba(3,38,22,0.07)",
            }}
          >
            {/* Dot pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: DOT_PATTERN,
                backgroundSize: "28px 28px",
                backgroundRepeat: "repeat",
              }}
            />

            {/* Featured: gradient accent strip at top */}
            {featured && (
              <div
                className="absolute top-0 left-0 right-0 h-[3px] z-10"
                style={{
                  background: "linear-gradient(90deg, #4a8a00 0%, #a5f95b 50%, #386b00 100%)",
                }}
              />
            )}

            {/* Badge -- top-right pill */}
            {plan.badge && (
              <div className="absolute top-5 right-5 z-10">
                <span className="inline-flex items-center gap-1.5 bg-[#386b00] text-white text-[9px] font-bold tracking-[0.15em] uppercase font-[var(--font-work-sans)] px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Main card body */}
            <div
              className={`relative z-[1] flex flex-col flex-1 p-8 bg-white/88 backdrop-blur-[2px] ${
                featured ? "pt-9" : ""
              }`}
            >
              {/* Tier pill */}
              <span
                className={`self-start inline-block text-[9px] font-bold tracking-[0.18em] uppercase font-[var(--font-work-sans)] px-3 py-1 rounded-full mb-4 ${
                  featured
                    ? "bg-[#e8f7d4] text-[#386b00]"
                    : "bg-[#f0f5ee] text-[#5a7060]"
                }`}
              >
                {plan.tier}
              </span>

              {/* Plan name + tagline */}
              <h3 className="font-[var(--font-libre-caslon)] text-[26px] font-bold text-[#032616] leading-tight mb-1.5">
                {plan.name}
              </h3>
              <p className="text-[13px] text-[#607860] font-[var(--font-work-sans)] leading-relaxed mb-6">
                {plan.tagline}
              </p>

              {/* Decorative divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c8d8c0] to-transparent" />
                <LeafIcon />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c8d8c0] to-transparent" />
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-start gap-1 leading-none">
                  <span className="font-[var(--font-work-sans)] text-[18px] font-bold text-[#386b00] mt-2">
                    &#8377;
                  </span>
                  <span className="font-[var(--font-libre-caslon)] text-[58px] font-bold text-[#032616] leading-none tracking-tight">
                    {plan.price}
                  </span>
                </div>
                <p className="text-[11px] text-[#8a9e8a] font-[var(--font-work-sans)] mt-1.5 tracking-widest uppercase font-semibold">
                  per {plan.period}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-auto">
                {plan.features.map((feat, fi) => {
                  const icon = getFeatureIcon(feat.iconType);
                  return (
                    <li
                      key={fi}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                        feat.highlight
                          ? "bg-[#eaf7da] text-[#2a5200]"
                          : "bg-[#f5f8f3] text-[#2a3a2a]"
                      }`}
                    >
                      <span className={feat.highlight ? "text-[#386b00]" : "text-[#7aaa50]"}>
                        {icon ?? <BulletIcon />}
                      </span>
                      <span
                        className={`text-[13px] font-[var(--font-work-sans)] leading-snug ${
                          feat.highlight ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {feat.text}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`group w-full mt-8 py-4 px-6 rounded-xl font-bold text-[11px] tracking-[0.14em] uppercase font-[var(--font-work-sans)] flex items-center justify-center gap-2.5 transition-all duration-200 ${
                  plan.buttonStyle === "secondary"
                    ? "bg-[#386b00] text-white hover:bg-[#2d5600] shadow-[0_4px_14px_rgba(56,107,0,0.30)] hover:shadow-[0_6px_22px_rgba(56,107,0,0.42)]"
                    : "bg-[#032616] text-white hover:bg-[#0a3d20] shadow-[0_4px_14px_rgba(3,38,22,0.22)] hover:shadow-[0_6px_22px_rgba(3,38,22,0.34)]"
                }`}
              >
                Subscribe Now
                <ArrowIcon />
              </motion.button>

              {/* Trust micro-text */}
              <p className="text-[10px] text-center text-[#9aaa9a] font-[var(--font-work-sans)] mt-3 tracking-wide">
                No commitment &middot; Cancel anytime
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* -- Section heading -- */

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <FadeIn className="text-center mb-16">
      <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase font-[var(--font-work-sans)] text-[#386b00] bg-[#e6f7d4] px-4 py-1.5 rounded-full mb-5">
        <LeafIcon />
        {label}
      </span>
      <h2 className="font-[var(--font-libre-caslon)] text-3xl md:text-[42px] font-bold text-[#032616] leading-tight">
        {title}
      </h2>
      <p className="text-[#607860] mt-3 font-[var(--font-work-sans)] max-w-xl mx-auto text-[15px] leading-relaxed">
        {subtitle}
      </p>
    </FadeIn>
  );
}

/* -- Main export -- */

export default function PricingCards() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivePlans()
      .then((data) => setPlans(data))
      .catch((err) => {
        console.error("[PricingCards] Failed to load plans:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const microgreensPlans = plans.filter((p) => p.category === "microgreens");
  const mealPlans = plans.filter((p) => p.category === "microgreens-meal");

  return (
    <section className="py-28 px-5 md:px-16 bg-[#f5f9f2]">
      <div className="max-w-[1280px] mx-auto space-y-24">

        {/* Microgreens Plans */}
        <div>
          <SectionHeading
            label="Fresh Subscription Plans"
            title="Microgreens Subscription Plans"
            subtitle="Tailored nutrition for every lifestyle. Cancel or pause anytime."
          />
          {loading ? <PlanSkeleton /> : <PlanGrid plans={microgreensPlans} />}
        </div>

        {/* Meal Plans */}
        {(loading || mealPlans.length > 0) && (
          <div>
            <SectionHeading
              label="Complete Meal Plans"
              title="Microgreens & Meal Subscription Plans"
              subtitle="Complete meal solutions with the freshness of microgreens. Cancel or pause anytime."
            />
            {loading ? <PlanSkeleton /> : <PlanGrid plans={mealPlans} />}
          </div>
        )}

      </div>
    </section>
  );
}
