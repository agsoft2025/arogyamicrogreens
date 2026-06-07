"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface OrderStatCardProps {
  label: string;
  value: string;
  note: string;
  noteVariant?: "green" | "neutral";
  icon: ReactNode;
  iconBg: string;
  delay?: number;
}

export default function OrderStatCard({
  label,
  value,
  note,
  noteVariant = "neutral",
  icon,
  iconBg,
  delay = 0,
}: OrderStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(3,38,22,0.1)" }}
      className="bg-white rounded-xl p-6 border border-[#e3e3dd] shadow-sm h-40 flex flex-col justify-between"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#727973] font-[var(--font-work-sans)] leading-tight">
          {label}
        </p>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>

      {/* Bottom row */}
      <div>
        <p className="font-[var(--font-libre-caslon)] text-[46px] font-bold text-[#032616] leading-none mb-1.5">
          {value}
        </p>
        <div
          className={`flex items-center gap-1 text-[12px] font-[var(--font-work-sans)] ${
            noteVariant === "green" ? "text-[#386b00] font-bold" : "text-[#727973]"
          }`}
        >
          {noteVariant === "green" && (
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          )}
          <span>{note}</span>
        </div>
      </div>
    </motion.div>
  );
}
