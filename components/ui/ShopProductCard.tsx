"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ShopProductCardProps {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: string;
  badge?: string;
  badgeVariant?: "popular" | "sale" | "new";
  image: string;
  index?: number;
}

const badgeStyles: Record<string, string> = {
  popular: "bg-[#a5f95b] text-[#3b7100]",
  sale: "bg-[#ba1a1a] text-white",
  new: "bg-[#032616] text-white",
};

export default function ShopProductCard({
  name,
  description,
  price,
  originalPrice,
  rating,
  badge,
  badgeVariant = "popular",
  image,
  index = 0,
}: ShopProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg overflow-hidden flex flex-col group cursor-pointer"
      style={{ boxShadow: "0 4px 12px rgba(27,60,42,0.10)", transition: "box-shadow 0.3s ease" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(27,60,42,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(27,60,42,0.10)";
      }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#eeeee9] overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {badge && (
          <span
            className={`absolute top-3 ${badgeVariant === "sale" ? "right-3" : "left-3"} px-2 py-1 rounded font-bold text-[10px] uppercase tracking-wider font-[var(--font-work-sans)] ${badgeStyles[badgeVariant]}`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name + Rating */}
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616] leading-tight pr-2">
            {name}
          </h4>
          <div className="flex items-center gap-1 shrink-0 text-[#386b00]">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-bold text-[11px] tracking-wide font-[var(--font-work-sans)]">
              {rating}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#424843] mb-4 flex-grow leading-relaxed font-[var(--font-work-sans)]">
          {description}
        </p>

        {/* Price + Cart */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616]">
              {price}
            </span>
            {originalPrice && (
              <span className="block text-xs text-[#727973] line-through font-[var(--font-work-sans)]">
                {originalPrice}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              added
                ? "bg-[#a5f95b] text-[#3b7100]"
                : "bg-[#386b00] text-white hover:bg-[#a5f95b] hover:text-[#3b7100]"
            }`}
          >
            {added ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="m5 13 4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
