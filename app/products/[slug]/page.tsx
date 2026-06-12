"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct, getEffectivePrice } from "@/hooks/useProducts";
import { useCart } from "@/store/cartStore";
import { useWishlist } from "@/store/wishlistStore";
import { formatCurrencyInt } from "@/lib/currency";
import { getProductImageUrl } from "@/lib/imageUtils";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatFAB from "@/components/ui/ChatFAB";
import PageTransition from "@/components/animations/PageTransition";
import type { Product } from "@/types/product.types";

/* ── Page ────────────────────────────────────────────────────── */

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 15+ passes params as a Promise — unwrap with React.use()
  const { slug } = use(params);
  const { product, loading, error, refetch } = useProduct({ slug });

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        {loading ? (
          <ProductDetailSkeleton />
        ) : error || !product ? (
          <ProductDetailError error={error} onRetry={refetch} />
        ) : (
          <ProductDetail product={product} />
        )}
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}

/* ── Detail view ─────────────────────────────────────────────── */

function ProductDetail({ product }: { product: Product }) {
  const effectivePrice = getEffectivePrice(product);
  const hasDiscount =
    product.salePrice !== undefined && product.salePrice < product.price;

  const images = [
    product.featuredImage,
    ...product.images.filter((img) => img !== product.featuredImage),
  ].filter(Boolean) as string[];

  const [activeImg, setActiveImg] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const { items, addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const inCart = items.some((i) => i.productId === product._id);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async () => {
    await addItem({
      productId: product._id,
      name: product.name,
      price: effectivePrice,
      image: getProductImageUrl(product.featuredImage ?? product.images[0]),
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = async () => {
    await toggleItem({
      productId: product._id,
      name: product.name,
      price: effectivePrice,
      image: getProductImageUrl(product.featuredImage ?? product.images[0]),
      slug: product.slug,
      description: product.shortDescription,
    });
  };

  return (
    <main className="min-h-screen bg-[#fafaf4]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10">

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#727973] mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#032616] transition-colors">Home</Link>
          <ChevronRight />
          <Link href="/products" className="hover:text-[#032616] transition-colors">Products</Link>
          <ChevronRight />
          <span className="text-[#032616] truncate max-w-[180px]">{product.name}</span>
        </motion.nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Left: Image Gallery ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="space-y-4"
          >
            {/* Main image */}
            <div className="relative aspect-square bg-[#eeeee9] rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images.length > 0 ? getProductImageUrl(images[activeImg]) : "/images/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>

              {/* Wishlist button */}
              <motion.button
                onClick={handleToggleWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <svg
                  className={`w-5 h-5 transition-all duration-200 ${
                    inWishlist ? "text-[#ba1a1a] scale-110" : "text-[#424843]"
                  }`}
                  fill={inWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.button>

              {/* Sale badge */}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-[#ba1a1a] text-white text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-3 py-1.5 rounded-full">
                  Sale
                </span>
              )}

              {/* Featured badge */}
              {product.isFeatured && !hasDiscount && (
                <span className="absolute top-4 left-4 bg-[#a5f95b] text-[#3b7100] text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-3 py-1.5 rounded-full">
                  Featured
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? "border-[#032616]"
                        : "border-[#e3e3dd] hover:border-[#386b00]"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={getProductImageUrl(img)}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right: Product Info ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col"
          >
            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#f4f4ee] text-[#424843] text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] px-3 py-1 rounded-full border border-[#e3e3dd]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Name */}
            <h1 className="font-[var(--font-libre-caslon)] text-3xl md:text-4xl font-bold text-[#032616] leading-tight mb-4">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="text-[10px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#9ca8a3] mb-4">
              SKU: {product.sku}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-[var(--font-libre-caslon)] text-3xl font-bold text-[#386b00]">
                {formatCurrencyInt(effectivePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="font-[var(--font-work-sans)] text-lg text-[#727973] line-through">
                    {formatCurrencyInt(product.price)}
                  </span>
                  <span className="bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold tracking-wider uppercase font-[var(--font-work-sans)] px-2 py-0.5 rounded">
                    {Math.round((1 - effectivePrice / product.price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <div className="h-px bg-[#e3e3dd] mb-6" />

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-[#424843] font-[var(--font-work-sans)] text-base leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-[var(--font-work-sans)] text-[10px] font-bold tracking-widest uppercase text-[#727973] mb-3">
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      className="flex items-start gap-2.5 text-sm text-[#1a1c19] font-[var(--font-work-sans)]"
                    >
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[#a5f95b] flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-[#3b7100]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      </span>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weight */}
            {product.weight && (
              <p className="text-sm font-[var(--font-work-sans)] text-[#424843] mb-6">
                <span className="font-bold">Weight:</span> {product.weight}{product.weightUnit ?? "g"}
              </p>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-8">
              {product.stock > 10 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#386b00]" />
                  <span className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#386b00]">
                    In Stock
                  </span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#f4a800]" />
                  <span className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#f4a800]">
                    Only {product.stock} left
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  <span className="text-[11px] font-bold tracking-widest uppercase font-[var(--font-work-sans)] text-[#ba1a1a]">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
                whileTap={product.stock > 0 ? { scale: 0.97 } : {}}
                aria-label={`Add ${product.name} to cart`}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] transition-all ${
                  product.stock === 0
                    ? "bg-[#e3e3dd] text-[#9ca8a3] cursor-not-allowed"
                    : inCart || justAdded
                    ? "bg-[#032616] text-white"
                    : "bg-[#386b00] text-white hover:bg-[#032616]"
                }`}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                      Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      {inCart ? "In Cart" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={handleToggleWishlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all ${
                  inWishlist
                    ? "border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a]"
                    : "border-[#c1c8c1] bg-white text-[#424843] hover:border-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#ba1a1a]"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${inWishlist ? "scale-110" : ""}`}
                  fill={inWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.button>
            </div>

            {/* Wishlist label */}
            <AnimatePresence>
              {inWishlist && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[11px] font-bold text-[#ba1a1a] font-[var(--font-work-sans)] tracking-wide mt-2 text-right"
                >
                  ♥ Saved to your wishlist
                </motion.p>
              )}
            </AnimatePresence>

            {/* Long description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t border-[#e3e3dd]">
                <h3 className="font-[var(--font-work-sans)] text-[10px] font-bold tracking-widest uppercase text-[#727973] mb-3">
                  Description
                </h3>
                <p className="text-[#424843] font-[var(--font-work-sans)] text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

/* ── Loading skeleton ────────────────────────────────────────── */

function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#fafaf4]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10">
        <div className="w-48 h-4 bg-[#e3e3dd] rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-[#e3e3dd] animate-pulse" />
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-[#e3e3dd] animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="h-4 w-32 bg-[#e3e3dd] rounded animate-pulse" />
            <div className="h-10 bg-[#e3e3dd] rounded animate-pulse w-4/5" />
            <div className="h-4 w-24 bg-[#e3e3dd] rounded animate-pulse" />
            <div className="h-8 bg-[#e3e3dd] rounded animate-pulse w-1/3" />
            <div className="h-px bg-[#e3e3dd]" />
            <div className="space-y-2">
              <div className="h-4 bg-[#e3e3dd] rounded animate-pulse w-full" />
              <div className="h-4 bg-[#e3e3dd] rounded animate-pulse w-5/6" />
              <div className="h-4 bg-[#e3e3dd] rounded animate-pulse w-4/6" />
            </div>
            <div className="flex gap-3 mt-8">
              <div className="h-14 flex-1 rounded-xl bg-[#e3e3dd] animate-pulse" />
              <div className="w-14 h-14 rounded-xl bg-[#e3e3dd] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── Error state ─────────────────────────────────────────────── */

function ProductDetailError({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#fafaf4] flex items-center justify-center">
      <div className="text-center px-5 space-y-6 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-[#ba1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <div>
          <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] mb-2">
            Product not found
          </h2>
          <p className="text-[#424843] font-[var(--font-work-sans)] text-sm">
            {error ?? "This product doesn&apos;t exist or has been removed."}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetry}
            className="w-full bg-[#032616] text-white font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3 rounded-xl hover:bg-[#386b00] transition-colors"
          >
            Try Again
          </motion.button>
          <Link href="/products">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="block w-full border border-[#c1c8c1] text-[#424843] font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] py-3 rounded-xl text-center hover:border-[#032616] hover:text-[#032616] transition-colors cursor-pointer"
            >
              Back to Products
            </motion.span>
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ── Icon ────────────────────────────────────────────────────── */

function ChevronRight() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
