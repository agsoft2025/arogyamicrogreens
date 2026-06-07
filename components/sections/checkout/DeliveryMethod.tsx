"use client";

import { motion } from "framer-motion";

export type DeliveryOption = "standard" | "express";

interface DeliveryMethodProps {
  selected: DeliveryOption;
  onChange: (option: DeliveryOption) => void;
}

const OPTIONS = [
  {
    id: "standard" as DeliveryOption,
    label: "Standard Farm Delivery",
    sublabel: "Delivered in 2-3 days",
    price: "FREE",
    priceClass: "text-[#386b00] font-bold",
  },
  {
    id: "express" as DeliveryOption,
    label: "Fresh Express",
    sublabel: "Next morning harvest delivery",
    price: "$12.00",
    priceClass: "text-[#424843]",
  },
];

export default function DeliveryMethod({ selected, onChange }: DeliveryMethodProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className="bg-white rounded-xl p-6 border border-[#c1c8c1]/30"
      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <TruckIcon />
        <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
          Delivery Method
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => {
          const active = selected === opt.id;
          return (
            <motion.label
              key={opt.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                active
                  ? "border-[#386b00] bg-[#386b00]/5"
                  : "border-[#c1c8c1] hover:border-[#386b00]"
              }`}
            >
              {/* Custom radio */}
              <div
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  active ? "border-[#386b00]" : "border-[#727973]"
                }`}
                onClick={() => onChange(opt.id)}
              >
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-[#386b00]"
                  />
                )}
              </div>
              <input
                type="radio"
                name="delivery"
                value={opt.id}
                checked={active}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />

              <div className="flex-grow">
                <p className="font-bold text-sm font-[var(--font-work-sans)] text-[#1a1c19]">
                  {opt.label}
                </p>
                <p className="text-xs text-[#424843] font-[var(--font-work-sans)]">
                  {opt.sublabel}
                </p>
              </div>

              <span className={`font-bold text-sm font-[var(--font-work-sans)] shrink-0 ${opt.priceClass}`}>
                {opt.price}
              </span>
            </motion.label>
          );
        })}
      </div>
    </motion.section>
  );
}

function TruckIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#386b00] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
      <rect width="13" height="8" x="9" y="11" rx="1" />
      <circle cx="12" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
    </svg>
  );
}
