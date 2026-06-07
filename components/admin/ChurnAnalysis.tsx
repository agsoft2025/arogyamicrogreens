"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type RefObject } from "react";

export default function ChurnAnalysis() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as RefObject<Element>, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="bg-[#032616] rounded-2xl p-6 text-white h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-[var(--font-libre-caslon)] text-lg font-bold text-white">
            Churn Analysis
          </h3>
          <p className="text-[12px] text-white/60 font-[var(--font-work-sans)] mt-0.5">
            Subscriber retention rate
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <ChurnIcon />
        </div>
      </div>

      {/* Main metric */}
      <div className="flex-1">
        <div className="flex items-end gap-3 mb-2">
          <span className="font-[var(--font-libre-caslon)] text-[52px] font-bold leading-none text-white">
            2.8%
          </span>
          <span className="text-[#a5f95b] font-bold text-[15px] font-[var(--font-work-sans)] mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m18 15-6-6-6 6" />
            </svg>
            -0.4%
          </span>
        </div>
        <p className="text-white/60 text-[12px] font-[var(--font-work-sans)]">
          Churn rate this month vs. last month
        </p>

        {/* Mini bar chart */}
        <div className="mt-5 flex items-end gap-1.5 h-12">
          {[3.8, 4.1, 3.6, 3.9, 3.4, 3.7, 3.2, 3.5, 3.1, 3.3, 3.0, 2.8].map((v, i) => {
            const h = ((v - 2.5) / (4.5 - 2.5)) * 100;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  background: i === 11 ? "#a5f95b" : "rgba(255,255,255,0.2)",
                  height: `${h}%`,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: inView ? 1 : 0 }}
                transition={{ delay: i * 0.04 + 0.2, duration: 0.4, ease: [0.25, 0.4, 0.25, 1], originY: 1 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-white/40 font-[var(--font-work-sans)]">Oct '24</span>
          <span className="text-[10px] text-white/40 font-[var(--font-work-sans)]">Oct '25</span>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 w-full bg-[#386b00] hover:bg-[#4a8a00] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3.5 rounded-xl transition-colors"
      >
        Review Retention Strategy
      </motion.button>
    </motion.div>
  );
}

function ChurnIcon() {
  return (
    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
