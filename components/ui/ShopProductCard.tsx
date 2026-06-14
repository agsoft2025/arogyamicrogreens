"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cartStore";
import { useWishlist } from "@/store/wishlistStore";

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
  /** Backend product _id — required to wire up real Add to Cart / Wishlist */
  productId?: string;
  /** Numeric unit price in INR — required to wire up real Add to Cart */
  numericPrice?: number;
  /** Product slug — used for navigation to /products/[slug] */
  slug?: string;
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
  productId,
  numericPrice,
  slug,
}: ShopProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();
  const { items, addItem, clearError } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = !!productId && isInWishlist(productId);

  const isInCart = !!productId && items.some((i) => i.productId === productId);
  const showActive = isInCart || justAdded;

  /** Navigate to product detail page when the card body is clicked */
  const handleCardClick = () => {
    if (slug) router.push(`/products/${slug}`);
  };

  /** Wishlist — stops click from bubbling to card and triggering navigation */
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId || numericPrice === undefined) return;
    await toggleItem({ productId, name, price: numericPrice, image, slug, description });
  };

  /** Cart — stops click from bubbling to card and triggering navigation */
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId && numericPrice !== undefined) {
      clearError();
      await addItem({ productId, name, price: numericPrice, image });
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.article
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -4 }}
      className="relative bg-white rounded-lg overflow-hidden flex flex-col group cursor-pointer"
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
            className={`absolute top-3 left-3 px-2 py-1 rounded font-bold text-[10px] uppercase tracking-wider font-[var(--font-work-sans)] ${badgeStyles[badgeVariant]}`}
          >
            {badge}
          </span>
        )}
        {productId && (
          <motion.button
            onClick={handleToggleWishlist}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label={inWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-colors ${inWishlist ? "text-[#ba1a1a]" : "text-[#424843]"}`}
              fill={inWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name + Rating */}
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-[var(--font-libre-caslon)] text-xl font-bold text-[#032616] leading-tight pr-2">
            {slug ? (
              <Link
                href={`/products/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline"
              >
                {name}
              </Link>
            ) : (
              name
            )}
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
              showActive
                ? "bg-[#a5f95b] text-[#3b7100]"
                : "bg-[#386b00] text-white hover:bg-[#a5f95b] hover:text-[#3b7100]"
            }`}
          >
            {showActive ? (
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
