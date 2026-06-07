"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PaymentOption = "card" | "upi" | "netbanking";

export interface CardData {
  number: string;
  expiry: string;
  cvv: string;
}

export interface CardErrors {
  number?: string;
  expiry?: string;
  cvv?: string;
}

interface PaymentMethodProps {
  selected: PaymentOption;
  cardData: CardData;
  cardErrors: CardErrors;
  onSelect: (opt: PaymentOption) => void;
  onCardChange: (field: keyof CardData, value: string) => void;
}

const METHODS = [
  {
    id: "card" as PaymentOption,
    label: "Credit / Debit Card",
    icon: <CardIcon />,
  },
  {
    id: "upi" as PaymentOption,
    label: "UPI (Google Pay, PhonePe, BHIM)",
    icon: <QRIcon />,
  },
  {
    id: "netbanking" as PaymentOption,
    label: "Net Banking",
    icon: <BankIcon />,
  },
];

export default function PaymentMethod({
  selected,
  cardData,
  cardErrors,
  onSelect,
  onCardChange,
}: PaymentMethodProps) {
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

      <div className="flex flex-col gap-4">
        {METHODS.map((method) => {
          const active = selected === method.id;
          return (
            <div key={method.id}>
              {/* Method row */}
              <motion.div
                className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-colors ${
                  active
                    ? "border-[#032616]"
                    : "border-[#c1c8c1] hover:border-[#727973]"
                }`}
                onClick={() => onSelect(method.id)}
              >
                <div
                  className={`flex items-center justify-between px-4 py-4 ${
                    active ? "bg-[#032616]/5" : "hover:bg-[#f4f4ee]"
                  } transition-colors`}
                >
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
                    <span className="font-bold text-sm font-[var(--font-work-sans)] text-[#1a1c19]">
                      {method.label}
                    </span>
                  </div>
                  <span className="text-[#424843]">{method.icon}</span>
                </div>

                {/* Expandable card form */}
                <AnimatePresence initial={false}>
                  {active && method.id === "card" && (
                    <motion.div
                      key="card-form"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-4 border-t border-[#e3e3dd]">
                        {/* Card number */}
                        <div className="col-span-2 flex flex-col gap-1.5">
                          <label className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843]">
                            Card Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardData.number}
                              onChange={(e) =>
                                onCardChange(
                                  "number",
                                  formatCardNumber(e.target.value)
                                )
                              }
                              maxLength={19}
                              placeholder="XXXX XXXX XXXX XXXX"
                              className={`w-full border rounded-lg px-3 py-3 pr-10 bg-transparent text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#c1c8c1] outline-none transition-colors ${
                                cardErrors.number
                                  ? "border-[#ba1a1a]"
                                  : "border-[#c1c8c1] focus:border-[#032616]"
                              }`}
                            />
                            <span className="absolute right-3 top-3 text-[#424843]">
                              <LockSmIcon />
                            </span>
                          </div>
                          {cardErrors.number && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[#ba1a1a] text-xs font-[var(--font-work-sans)]"
                            >
                              {cardErrors.number}
                            </motion.p>
                          )}
                        </div>

                        {/* Expiry */}
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843]">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) =>
                              onCardChange(
                                "expiry",
                                formatExpiry(e.target.value)
                              )
                            }
                            maxLength={5}
                            placeholder="MM / YY"
                            className={`border rounded-lg px-3 py-3 bg-transparent text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#c1c8c1] outline-none transition-colors ${
                              cardErrors.expiry
                                ? "border-[#ba1a1a]"
                                : "border-[#c1c8c1] focus:border-[#032616]"
                            }`}
                          />
                          {cardErrors.expiry && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[#ba1a1a] text-xs font-[var(--font-work-sans)]"
                            >
                              {cardErrors.expiry}
                            </motion.p>
                          )}
                        </div>

                        {/* CVV */}
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843]">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) =>
                              onCardChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                            }
                            placeholder="***"
                            className={`border rounded-lg px-3 py-3 bg-transparent text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#c1c8c1] outline-none transition-colors ${
                              cardErrors.cvv
                                ? "border-[#ba1a1a]"
                                : "border-[#c1c8c1] focus:border-[#032616]"
                            }`}
                          />
                          {cardErrors.cvv && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[#ba1a1a] text-xs font-[var(--font-work-sans)]"
                            >
                              {cardErrors.cvv}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* UPI placeholder */}
                  {active && method.id === "upi" && (
                    <motion.div
                      key="upi-form"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                      className="overflow-hidden border-t border-[#e3e3dd]"
                    >
                      <div className="px-6 py-5 flex flex-col gap-1.5">
                        <label className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843]">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          className="border border-[#c1c8c1] rounded-lg px-3 py-3 bg-transparent text-sm font-[var(--font-work-sans)] text-[#1a1c19] placeholder:text-[#c1c8c1] outline-none focus:border-[#032616] transition-colors"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Net Banking placeholder */}
                  {active && method.id === "netbanking" && (
                    <motion.div
                      key="netbanking-form"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                      className="overflow-hidden border-t border-[#e3e3dd]"
                    >
                      <div className="px-6 py-5 flex flex-col gap-1.5">
                        <label className="font-bold text-[10px] tracking-widest uppercase font-[var(--font-work-sans)] text-[#424843]">
                          Select Bank
                        </label>
                        <select className="border border-[#c1c8c1] rounded-lg px-3 py-3 bg-transparent text-sm font-[var(--font-work-sans)] text-[#1a1c19] outline-none focus:border-[#032616] transition-colors">
                          <option value="">Choose your bank</option>
                          <option>Chase</option>
                          <option>Bank of America</option>
                          <option>Wells Fargo</option>
                          <option>Citibank</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ── Formatters ─────────────────────────── */
function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
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

function CardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

function LockSmIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
