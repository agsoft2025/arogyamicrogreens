"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  badge: string;
  badgeColor: "green" | "red";
  note: string;
  delay?: number;
}

export default function MetricCard({
  icon,
  iconBg,
  label,
  value,
  badge,
  badgeColor,
  note,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(3,38,22,0.1)" }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-[#e3e3dd] transition-shadow"
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <span
          className={`text-[11px] font-bold tracking-wide font-[var(--font-work-sans)] px-2.5 py-1 rounded-full ${
            badgeColor === "green"
              ? "bg-[#d4f4a0] text-[#3b7100]"
              : "bg-[#ffd9d5] text-[#ba1a1a]"
          }`}
        >
          {badge}
        </span>
      </div>

      <p className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] mb-1">
        {label}
      </p>
      <p className="font-[var(--font-libre-caslon)] text-[28px] font-bold text-[#1a1c19] leading-none mb-2">
        {value}
      </p>
      <p className="text-[12px] text-[#727973] font-[var(--font-work-sans)] italic">{note}</p>
    </motion.div>
  );
}
