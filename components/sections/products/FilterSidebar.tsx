"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FilterSidebarProps {
  onFiltersChange?: (filters: {
    categories: string[];
    stage: string;
    maxPrice: number;
  }) => void;
}

const categories = ["Fresh Greens", "Seeds & Spores", "Growing Kits"];
const stages = ["All Stages", "Ready to Eat", "Germinating"];

export default function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Fresh Greens"]);
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [maxPrice, setMaxPrice] = useState(100);

  const toggleCategory = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    onFiltersChange?.({ categories: updated, stage: selectedStage, maxPrice });
  };

  const handleStage = (stage: string) => {
    setSelectedStage(stage);
    onFiltersChange?.({ categories: selectedCategories, stage, maxPrice });
  };

  const handlePrice = (val: number) => {
    setMaxPrice(val);
    onFiltersChange?.({ categories: selectedCategories, stage: selectedStage, maxPrice: val });
  };

  const resetFilters = () => {
    setSelectedCategories(["Fresh Greens"]);
    setSelectedStage("All Stages");
    setMaxPrice(100);
    onFiltersChange?.({ categories: ["Fresh Greens"], stage: "All Stages", maxPrice: 100 });
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
      className="w-full md:w-56 lg:w-64 shrink-0 space-y-8"
    >
      {/* Category */}
      <div>
        <h3 className="font-bold text-[10px] tracking-widest uppercase text-[#032616] font-[var(--font-work-sans)] mb-4">
          Category
        </h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggleCategory(cat)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  selectedCategories.includes(cat)
                    ? "bg-[#386b00] border-[#386b00]"
                    : "border-[#727973] group-hover:border-[#386b00]"
                }`}
              >
                {selectedCategories.includes(cat) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleCategory(cat)}
                className="text-sm text-[#1a1c19] group-hover:text-[#386b00] transition-colors font-[var(--font-work-sans)] cursor-pointer select-none"
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Growth Stage */}
      <div>
        <h3 className="font-bold text-[10px] tracking-widest uppercase text-[#032616] font-[var(--font-work-sans)] mb-4">
          Growth Stage
        </h3>
        <div className="space-y-2.5">
          {stages.map((stage) => (
            <label key={stage} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => handleStage(stage)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  selectedStage === stage
                    ? "border-[#386b00]"
                    : "border-[#727973] group-hover:border-[#386b00]"
                }`}
              >
                {selectedStage === stage && (
                  <div className="w-2 h-2 rounded-full bg-[#386b00]" />
                )}
              </div>
              <span
                onClick={() => handleStage(stage)}
                className="text-sm text-[#1a1c19] font-[var(--font-work-sans)] cursor-pointer select-none"
              >
                {stage}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-[10px] tracking-widest uppercase text-[#032616] font-[var(--font-work-sans)] mb-4">
          Price Range
        </h3>
        <input
          type="range"
          min={0}
          max={100}
          value={maxPrice}
          onChange={(e) => handlePrice(Number(e.target.value))}
          className="w-full accent-[#386b00] cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-[#424843] font-[var(--font-work-sans)]">$0</span>
          <span className="text-[11px] text-[#424843] font-[var(--font-work-sans)]">$100+</span>
        </div>
      </div>

      {/* Reset */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={resetFilters}
        className="w-full py-3 border border-[#032616] text-[#032616] font-bold text-[11px] tracking-widest uppercase rounded-lg hover:bg-[#032616] hover:text-white transition-colors font-[var(--font-work-sans)]"
      >
        Reset All Filters
      </motion.button>
    </motion.aside>
  );
}
