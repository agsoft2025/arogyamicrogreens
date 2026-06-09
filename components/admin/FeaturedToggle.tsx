"use client";

import { motion } from "framer-motion";

interface FeaturedToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function FeaturedToggle({ enabled, onToggle, disabled = false }: FeaturedToggleProps) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={enabled ? "Remove from featured" : "Mark as featured"}
      onClick={disabled ? undefined : onToggle}
      whileTap={disabled ? {} : { scale: 0.9 }}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#386b00] focus-visible:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${enabled ? "bg-[#386b00]" : "bg-[#c1c8c1]/60"}`}
    >
      <motion.span
        className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 22 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}
