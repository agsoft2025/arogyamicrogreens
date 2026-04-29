"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/app/_components/cart/cart-context";
import {
  type GrowKitProduct,
  formatInrPrice,
} from "@/app/_data/grow-kit-products";
import starterKitImage from "@/assests/microgreen24.jpg";

type GrowKitProductDetailClientProps = {
  product: GrowKitProduct;
};

export function GrowKitProductDetailClient({
  product,
}: GrowKitProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [popupImage, setPopupImage] = useState<StaticImageData | null>(null);
  const { addToCart } = useCart();

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = () => {
    for (let count = 0; count < quantity; count += 1) {
      addToCart({
        name: product.name,
        price: formatInrPrice(product.price),
        image: product.image,
      });
    }
  };

  const openImagePopup = (image: StaticImageData) => {
    setPopupImage(image);
  };

  const closeImagePopup = () => {
    setPopupImage(null);
  };

  const shortDescriptionParts = product.shortDescription.split(". ");
  const descriptionLead = shortDescriptionParts[0];
  const descriptionRest = shortDescriptionParts.slice(1).join(". ");

  return (
    <section className="bg-[#f5f5f3] px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl rounded-[28px] bg-white p-6 shadow-[0_24px_90px_rgba(39,58,42,0.12)] md:p-10">
        <div className="mb-8 inline-flex rounded-full bg-[#d9e8c8] px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#31552b]">
          Home / Grow Kit / {product.name}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#31552b]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-contain p-6"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {product.gallery.map((image, index) => {
                return (
                  <button
                    key={`${product.slug}-${index}`}
                    type="button"
                    onClick={() => openImagePopup(image)}
                    className="relative h-24 w-24 overflow-hidden rounded-[14px] border bg-[#f4f6ef] transition border-black/10 hover:border-[#6ead3d]/50 hover:shadow-[0_12px_30px_rgba(110,173,61,0.24)]"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#1f2937] md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-6 text-base leading-8 text-[#5c6b61]">
              <span className="font-bold text-[#4f6f3d]">{descriptionLead}.</span>
              {descriptionRest ? ` ${descriptionRest}` : null}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#5c6b61]">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-[2px] text-[#6ead3d]">+</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-5xl font-extrabold text-[#79b33f]">
              {formatInrPrice(product.price)}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-2xl bg-[#f5f5f3] p-1 shadow-inner">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4b4b4b] text-lg font-bold text-white transition hover:bg-[#333333]"
                >
                  -
                </button>
                <span className="flex h-10 min-w-12 items-center justify-center px-3 text-sm font-bold text-[#2f3a32]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4b4b4b] text-lg font-bold text-white transition hover:bg-[#333333]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="rounded-full bg-[#79b33f] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_18px_35px_rgba(121,179,63,0.32)] transition hover:bg-[#6aa034]"
              >
                Add To Cart
              </button>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-7 text-[#6b7280]">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {(product.featureDetails || product.usageSteps?.length) && (
        <div className="mx-auto mt-12 max-w-4xl rounded-[28px] bg-black/80 px-8 py-10 text-white shadow-[0_28px_50px_rgba(33,33,33,0.28)] md:px-12 md:py-12">
          {product.featureDetails ? (
            <>
              <h2 className="text-3xl font-extrabold text-white">
                {product.featureDetails.title}
              </h2>
              <ul className="mt-6 space-y-5 text-base leading-8 text-white/95">
                {product.featureDetails.items.map((item, index) => (
                  <li key={index} className="flex items-start m-0 gap-2">
                    <span className="pt-1 text-lg text-white">&#8226;</span>
                    <div>
                      <p className="font-bold text-white">{item.heading}</p>
                      <p className="text-white/90">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {product.usageSteps?.length ? (
            <div className="mt-10 border-t border-white/50 pt-10">
              <div className="border border-[#b9d7c2] px-6 py-5 md:px-8 md:py-6">
                <h3 className="text-2xl font-extrabold text-white">
                  How to Use:
                </h3>
                <ol className="mt-5 space-y-2 text-base font-medium text-white/95">
                  {product.usageSteps.map((step, index) => (
                    <li key={step}>
                      {index + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="mx-auto mt-12 max-w-4xl bg-[#ffdc9a] p-8 shadow-[0_18px_40px_rgba(173,134,52,0.18)] md:p-12">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={starterKitImage}
            alt="Microgreens starter kit preparation"
            fill
            placeholder="blur"
            sizes="(max-width: 896px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-8 max-w-2xl">
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Start Growing the Right Way
          </h2>
          <p className="mt-4 text-lg font-medium leading-9 text-white/95">
            If you&apos;re just getting started, our Microgreens Starter Kit
            removes the guesswork. It includes the essential tools and growing
            supplies so you can confidently grow healthy, vibrant microgreens
            from day one. No confusion. No trial and error. Just a smooth
            start.
          </p>
          <Link
            href="/grow-kit"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-4 text-xs font-extrabold uppercase tracking-[0.14em] text-[#111111] transition hover:bg-[#f6f4ef]"
          >
            Shop Starter Kit
          </Link>
        </div>
      </div>

      {/* Image Popup Modal */}
      {popupImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeImagePopup}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImagePopup}
              className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors"
              aria-label="Close image"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Large Image */}
            <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
              <Image
                src={popupImage}
                alt={`${product.name} large view`}
                width={800}
                height={800}
                placeholder="blur"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
