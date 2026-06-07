"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export type TrackingStep = "processing" | "in_transit" | "delivered";

interface Step {
  id: TrackingStep;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    id: "processing",
    label: "Processing",
    sublabel: "Oct 24, 08:30 AM",
    icon: <CheckIcon />,
  },
  {
    id: "in_transit",
    label: "In Transit",
    sublabel: "Estimated Today",
    icon: <TruckIcon />,
  },
  {
    id: "delivered",
    label: "Delivered",
    sublabel: "Awaiting Arrival",
    icon: <HomeIcon />,
  },
];

/* currentStep index: 0=processing, 1=in_transit, 2=delivered */
const CURRENT_STEP_INDEX = 1;

export default function CurrentOrderTracker() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  /* progress bar width: 0% → 1 step = 0%, 2 steps = 50%, 3 steps = 100% */
  const progressPct = (CURRENT_STEP_INDEX / (STEPS.length - 1)) * 100;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="bg-white rounded-xl p-6 md:p-8 border border-[#c6ecd1]/50 overflow-hidden relative"
      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
    >
      {/* Atmospheric blur */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#386b00]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
        <div>
          <span className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00] block mb-1">
            Live Tracking
          </span>
          <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
            Current Order #AN-9842
          </h2>
        </div>
        <div className="flex gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#032616] text-white font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-2.5 rounded-lg hover:bg-[#386b00] transition-colors"
          >
            View Details
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="border border-[#032616] text-[#032616] font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] px-5 py-2.5 rounded-lg hover:bg-[#032616]/5 transition-colors"
          >
            Support
          </motion.button>
        </div>
      </div>

      {/* Progress stepper */}
      <div className="py-6 relative z-10">
        <div className="relative">
          {/* Track background */}
          <div className="absolute top-5 left-5 right-5 h-1 bg-[#eeeee9] rounded-full z-0" />
          {/* Progress fill */}
          <motion.div
            className="absolute top-5 left-5 h-1 bg-[#386b00] rounded-full z-0"
            initial={{ width: "0%" }}
            animate={inView ? { width: `calc(${progressPct}% - 10px)` } : {}}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          />

          {/* Steps */}
          <div className="relative z-10 flex justify-between">
            {STEPS.map((step, i) => {
              const completed = i < CURRENT_STEP_INDEX;
              const active = i === CURRENT_STEP_INDEX;
              const pending = i > CURRENT_STEP_INDEX;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.3 + i * 0.15,
                    duration: 0.5,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="flex flex-col items-center"
                >
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      completed || active
                        ? "bg-[#386b00] text-white"
                        : "bg-[#eeeee9] text-[#727973] border border-[#c1c8c1]"
                    } ${active ? "ring-4 ring-[#a5f95b]" : ""}`}
                  >
                    {step.icon}
                  </div>

                  {/* Labels */}
                  <span
                    className={`mt-3 font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] ${
                      active
                        ? "text-[#386b00]"
                        : pending
                        ? "text-[#424843]"
                        : "text-[#032616]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`text-[10px] font-[var(--font-work-sans)] mt-0.5 ${
                      active ? "text-[#386b00] font-bold" : "text-[#424843]"
                    }`}
                  >
                    {step.sublabel}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order product + delivery address */}
      <div className="mt-6 pt-6 border-t border-[#e3e3dd] flex flex-col md:flex-row gap-6 justify-between relative z-10">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-lg bg-[#e1e4da] overflow-hidden shrink-0">
            <motion.img
              src="https://lh3.googleusercontent.com/aida/AP1WRLtfEa9LJ5xpi2sL468RiSDOJe065huio5qrWRF3N_5WTO0Zlo4EvcD212_uOC7dqJ65cNPy-AnAQiT2M5FMigf06z6VRP6d6SZPepZxdPprOs3uDl-hQtSejH3szCyDsUnyACjnf7-y5m8lZoZJKqpHR65ah7ezuV1qNfBVzud8X4W4ybv3p_PNteasCN8Xuef9tgLlPFnjtXWzvpYmOZAfsQr6YjtOHz24wr20ZRWK5WOu8Liz2p_ByG8"
              alt="Chef's Gourmet Bundle"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div>
            <p className="font-bold text-sm font-[var(--font-work-sans)] text-[#032616]">
              Chef&apos;s Gourmet Bundle
            </p>
            <p className="text-xs text-[#424843] font-[var(--font-work-sans)] mt-0.5">
              Radish, Sunflower, and Pea Shoots (x2)
            </p>
          </div>
        </div>

        <div className="md:text-right shrink-0">
          <p className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843] mb-0.5">
            Delivery Address
          </p>
          <p className="text-sm text-[#424843] font-[var(--font-work-sans)]">
            42 Organic Lane, Portland, OR
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
