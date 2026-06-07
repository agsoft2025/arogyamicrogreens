"use client";

import { motion } from "framer-motion";

interface ProductCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  image: string;
}

export default function ProductCard({ name, price, originalPrice, badge, image }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="min-w-[260px] md:min-w-[280px] bg-white rounded-xl overflow-hidden shrink-0"
      style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.1)" }}
    >
      <div className="relative bg-[#f4f4ee] h-48 overflow-hidden">
        {badge && (
          <span className="absolute top-3 left-3 bg-[#a5f95b] text-[#3b7100] text-[10px] font-bold px-2 py-1 rounded z-10">
            {badge}
          </span>
        )}
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xs tracking-wider uppercase text-[#032616] mb-1 font-[var(--font-work-sans)]">{name}</h3>
        <div className="flex items-center justify-between mt-4">
          <p className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
            {price}
            {originalPrice && (
              <span className="text-sm text-[#c1c8c1] line-through ml-2 font-[var(--font-work-sans)] font-normal">
                {originalPrice}
              </span>
            )}
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#386b00] text-white p-2.5 rounded-lg hover:bg-[#032616] transition-colors"
            aria-label={`Add ${name} to cart`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
