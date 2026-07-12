"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * PaymentOption
 *
 * "razorpay" → Online payment (card / UPI / net-banking / wallets).
 *              Razorpay collects & validates payment details inside its own
 *              secure modal — we never handle raw card/UPI data here.
 *
 * "cod"       → Cash on Delivery.
 */
export type PaymentOption = "razorpay" | "cod";

interface PaymentMethodProps {
  selected: PaymentOption;
  onSelect: (opt: PaymentOption) => void;
}

const METHODS: { id: PaymentOption; label: string; sublabel: string; icon: React.ReactNode }[] = [
  {
    id: "razorpay",
    label: "Online Payment",
    sublabel: "Credit / Debit Card, UPI, Net Banking, Wallets — powered by Razorpay",
    icon: <RazorpayIcon />,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    sublabel: "Pay with cash when your order arrives",
    icon: <CodIcon />,
  },
];

export default function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      className="bg-white rounded-xl p-6 border border-[#c1c8c1]/30"
      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <WalletIcon />
        <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
          Payment Method
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {METHODS.map((method) => {
          const active = selected === method.id;
          return (
            <motion.div
              key={method.id}
              className={`rounded-xl border-2 cursor-pointer transition-colors ${
                active
                  ? "border-[#032616] bg-[#032616]/5"
                  : "border-[#c1c8c1] hover:border-[#727973] hover:bg-[#f4f4ee]"
              }`}
              onClick={() => onSelect(method.id)}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  {/* Custom radio */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      active ? "border-[#032616]" : "border-[#727973]"
                    }`}
                  >
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-2 h-2 rounded-full bg-[#032616]"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm font-[var(--font-work-sans)] text-[#1a1c19]">
                      {method.label}
                    </p>
                    <p className="text-xs text-[#727973] font-[var(--font-work-sans)] mt-0.5">
                      {method.sublabel}
                    </p>
                  </div>
                </div>
                <span className="text-[#424843] shrink-0">{method.icon}</span>
              </div>

              {/* Razorpay trust note */}
              <AnimatePresence initial={false}>
                {active && method.id === "razorpay" && (
                  <motion.div
                    key="razorpay-note"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                    className="overflow-hidden border-t border-[#e3e3dd]"
                  >
                    <div className="px-5 py-3 flex items-center gap-2">
                      <ShieldSmIcon />
                      <p className="text-xs text-[#424843] font-[var(--font-work-sans)]">
                        You'll enter your payment details securely inside the Razorpay checkout.
                        We never store card information.
                      </p>
                    </div>
                  </motion.div>
                )}
                {active && method.id === "cod" && (
                  <motion.div
                    key="cod-note"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                    className="overflow-hidden border-t border-[#e3e3dd]"
                  >
                    <div className="px-5 py-3">
                      <p className="text-xs text-[#424843] font-[var(--font-work-sans)]">
                        Keep exact change ready. Our delivery partner will collect payment on delivery.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ── Icons ──────────────────────────────── */
function WalletIcon() {
  return (
    <svg className="w-5 h-5 text-[#386b00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function RazorpayIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function CodIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function ShieldSmIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-[#386b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
