"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type RefObject } from "react";

const CUSTOMERS = [
  {
    initials: "EM",
    name: "Eleanor Marsh",
    email: "e.marsh@example.com",
    plan: "HARVEST PRO",
    planVariant: "lime" as const,
    orders: 47,
    ltv: "₹2,68,140",
  },
  {
    initials: "JH",
    name: "Jonathan Hale",
    email: "j.hale@example.com",
    plan: "HARVEST PRO",
    planVariant: "lime" as const,
    orders: 39,
    ltv: "₹2,24,502",
  },
  {
    initials: "SC",
    name: "Sofia Chen",
    email: "s.chen@example.com",
    plan: "WEEKLY BOX",
    planVariant: "gray" as const,
    orders: 31,
    ltv: "₹1,62,479",
  },
  {
    initials: "RP",
    name: "Raj Patel",
    email: "r.patel@example.com",
    plan: "WEEKLY BOX",
    planVariant: "gray" as const,
    orders: 28,
    ltv: "₹1,51,726",
  },
  {
    initials: "AM",
    name: "Amelia Moore",
    email: "a.moore@example.com",
    plan: "HARVEST PRO",
    planVariant: "lime" as const,
    orders: 25,
    ltv: "₹1,48,555",
  },
];

export default function TopCustomersTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as RefObject<Element>, { once: true, margin: "-60px" });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e3e3dd] overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-[#f4f4ee]">
        <h3 className="font-[var(--font-libre-caslon)] text-lg font-bold text-[#1a1c19]">
          Top Customers
        </h3>
        <p className="text-[12px] text-[#727973] font-[var(--font-work-sans)] mt-0.5">
          By lifetime value this month
        </p>
      </div>

      <div ref={ref} className="divide-y divide-[#f4f4ee]">
        {CUSTOMERS.map((c, i) => (
          <motion.div
            key={c.email}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex items-center gap-4 px-6 py-4 hover:bg-[#fafaf4] transition-colors"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#1b3c2a] text-white flex items-center justify-center font-bold text-[12px] font-[var(--font-work-sans)] shrink-0">
              {c.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#1a1c19] font-[var(--font-work-sans)] truncate">
                {c.name}
              </p>
              <p className="text-[11px] text-[#727973] font-[var(--font-work-sans)] truncate">
                {c.email}
              </p>
            </div>

            {/* Plan badge */}
            <span
              className={`hidden sm:inline text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide font-[var(--font-work-sans)] shrink-0 ${
                c.planVariant === "lime"
                  ? "bg-[#d4f4a0] text-[#3b7100]"
                  : "bg-[#f0f0ea] text-[#424843]"
              }`}
            >
              {c.plan}
            </span>

            {/* Orders */}
            <div className="text-center shrink-0 hidden md:block w-14">
              <p className="font-bold text-sm text-[#1a1c19] font-[var(--font-work-sans)]">
                {c.orders}
              </p>
              <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)]">orders</p>
            </div>

            {/* LTV */}
            <div className="text-right shrink-0 w-20">
              <p className="font-bold text-sm text-[#032616] font-[var(--font-work-sans)]">
                {c.ltv}
              </p>
              <p className="text-[10px] text-[#9ca8a3] font-[var(--font-work-sans)]">lifetime</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-[#f4f4ee]">
        <button className="text-[12px] font-bold text-[#386b00] font-[var(--font-work-sans)] hover:text-[#032616] transition-colors flex items-center gap-1">
          View All Customers
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
