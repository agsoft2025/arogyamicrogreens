"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductTagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function ProductTagsInput({ value, onChange }: ProductTagsInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className="flex flex-wrap gap-2 items-center min-h-[44px] border border-[#e3e3dd] rounded-lg px-3 py-2 bg-white focus-within:border-[#386b00] focus-within:ring-1 focus-within:ring-[#386b00]/30 transition-colors cursor-text"
      onClick={(e) => {
        (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus();
      }}
    >
      <AnimatePresence initial={false}>
        {value.map((tag) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1 bg-[#386b00]/10 text-[#386b00] text-[11px] font-bold font-[var(--font-work-sans)] tracking-wide rounded-full px-2.5 py-1"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              className="hover:text-[#ba1a1a] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.span>
        ))}
      </AnimatePresence>

      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (draft.trim()) addTag(draft); }}
        placeholder={value.length === 0 ? "Type a tag and press Enter or comma…" : "Add more tags…"}
        className="flex-1 min-w-[140px] text-sm text-[#1a1c19] font-[var(--font-work-sans)] bg-transparent outline-none placeholder:text-[#b0b8b0]"
      />
    </div>
  );
}
