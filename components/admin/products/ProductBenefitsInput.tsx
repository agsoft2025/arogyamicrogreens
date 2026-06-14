"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductBenefitsInputProps {
  value: string[];
  onChange: (benefits: string[]) => void;
  error?: string;
}

export default function ProductBenefitsInput({
  value,
  onChange,
  error,
}: ProductBenefitsInputProps) {
  const [draft, setDraft] = useState("");

  const addBenefit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  };

  const removeBenefit = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const updateBenefit = (idx: number, text: string) => {
    onChange(value.map((b, i) => (i === idx ? text : b)));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addBenefit(); }
  };

  return (
    <div className="space-y-2">
      {/* Existing items */}
      <AnimatePresence initial={false}>
        {value.map((benefit, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-[#386b00]/10 flex items-center justify-center shrink-0">
              <svg className="w-2.5 h-2.5 text-[#386b00]" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <input
              type="text"
              value={benefit}
              onChange={(e) => updateBenefit(idx, e.target.value)}
              className="flex-1 border border-[#e3e3dd] rounded-lg px-3 py-2 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-white focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors"
              placeholder={`Benefit ${idx + 1}`}
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => removeBenefit(idx)}
              aria-label="Remove benefit"
              className="p-1.5 text-[#9ca8a3] hover:text-[#ba1a1a] hover:bg-[#ffd9d5]/30 rounded-md transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add new */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#e3e3dd] flex items-center justify-center shrink-0">
          <svg className="w-2.5 h-2.5 text-[#9ca8a3]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a benefit and press Enter or click +"
          className="flex-1 border border-[#e3e3dd] border-dashed rounded-lg px-3 py-2 text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-[#fafaf4] focus:outline-none focus:border-[#386b00] focus:ring-1 focus:ring-[#386b00]/30 transition-colors placeholder:text-[#b0b8b0]"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={addBenefit}
          disabled={!draft.trim()}
          aria-label="Add benefit"
          className="p-1.5 text-white bg-[#386b00] hover:bg-[#4a8a00] rounded-md transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.button>
      </div>

      {error && (
        <p className="text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)] mt-1">{error}</p>
      )}
    </div>
  );
}
