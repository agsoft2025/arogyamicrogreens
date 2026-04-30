"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MdAdd,
  MdExpandMore,
  MdFavoriteBorder,
  MdLocalDining,
  MdRemove,
  MdRestaurant,
  MdSearch,
} from "react-icons/md";

import { useCart } from "@/app/_components/cart/cart-context";
import {
  type MicrogreenProduct,
  formatMicrogreenPrice,
  microgreenCertifications,
  microgreenImages,
  microgreenProducts,
} from "@/app/_data/microgreen-products";

type MicrogreenProductDetailClientProps = {
  product: MicrogreenProduct;
};

const faqs = [
  "Can microgreens be eaten raw?",
  "Do you use soil?",
  "How much should I consume daily?",
  "How long do they stay fresh?",
  "Are these organic?",
  "When will I get my delivery?",
];

const relatedProductNames = [
  "Green Mustard Microgreens",
  "Radish White Microgreens",
  "Red Cabbage Microgreens",
  "Red Lentil (Masoor) Microgreens",
];

function renderDescription(paragraph: string) {
  if (paragraph.includes("Alfalfa microgreens")) {
    const [before, after] = paragraph.split("Alfalfa microgreens");

    return (
      <>
        {before}
        <strong className="font-extrabold text-[#5f6d88]">
          Alfalfa microgreens
        </strong>
        {after}
      </>
    );
  }

  if (paragraph.includes("vitamins")) {
    const [beforeVitamins, afterVitamins] = paragraph.split("vitamins");
    const [beforeMinerals, afterMinerals] = afterVitamins.split(
      "calcium, potassium, iron, and zinc",
    );

    return (
      <>
        {beforeVitamins}
        <strong className="font-extrabold text-[#5f6d88]">vitamins</strong>
        {beforeMinerals}
        <strong className="font-extrabold text-[#5f6d88]">
          calcium, potassium, iron, and zinc
        </strong>
        {afterMinerals}
      </>
    );
  }

  return paragraph;
}

export function MicrogreenProductDetailClient({
  product,
}: MicrogreenProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageKey, setSelectedImageKey] = useState(product.gallery[0]);
  const { addToCart } = useCart();
  const selectedImage =
    microgreenImages[selectedImageKey] ?? microgreenImages[product.image];
  const relatedProducts = microgreenProducts
    .filter((relatedProduct) => product.details.relatedProducts?.includes(relatedProduct.name))
    .filter((relatedProduct) => relatedProduct.slug !== product.slug);

  const addProductToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart({
        name: product.name,
        price: formatMicrogreenPrice(product.price),
        image: microgreenImages[product.image],
      });
    }
  };

  return (
    <>
      <section className="bg-[#eeeeec] px-5 py-10 md:py-14">
        <div className="mx-auto max-w-5xl rounded-[10px] bg-white px-5 pb-0 pt-6 shadow-[0_24px_80px_rgba(24,28,24,0.09)] md:px-6">
          <div className="mb-6 max-w-[360px] rounded-r-full bg-[#d5e8c6] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1c3723]">
            Home / Microgreens / {product.name}
          </div>

          <div className="grid gap-10 md:grid-cols-[362px_1fr] md:items-start">
            <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#31552b]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 768px) calc(100vw - 64px), 362px"
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Zoom product image"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#161616] shadow-sm"
              >
                <MdSearch className="h-5 w-5" />
              </button>
            </div>

            <div className="pb-2 md:pt-1">
              <h1 className="font-serif text-[40px] font-bold leading-[1.05] text-[#20222a] md:text-[41px]">
                {product.name}
              </h1>

              <div className="mt-7 space-y-5 text-md font-medium leading-6 text-[#697795]">
                {product.description.map((paragraph) => (
                  <p key={paragraph}>{renderDescription(paragraph)}</p>
                ))}
              </div>

              <p className="mt-7 text-[38px] font-extrabold leading-none text-[#62a23f]">
                {formatMicrogreenPrice(product.price)}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((currentQuantity) =>
                      Math.max(1, currentQuantity - 1),
                    )
                  }
                  aria-label="Decrease quantity"
                  className="flex h-6 w-6 items-center justify-center rounded-[2px] bg-[#3e4145] text-white"
                >
                  <MdRemove className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-11 items-center justify-center rounded-[8px] bg-[#f3f3f3] text-xs font-bold text-[#101010]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((currentQuantity) => currentQuantity + 1)
                  }
                  aria-label="Increase quantity"
                  className="flex h-6 w-6 items-center justify-center rounded-[2px] bg-[#3e4145] text-white"
                >
                  <MdAdd className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={addProductToCart}
                  className="ml-2 rounded-full bg-[#73b23f] px-7 py-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_16px_28px_rgba(115,178,63,0.28)] transition hover:bg-[#649d35]"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-9 pb-0 md:translate-y-10">
            {product.gallery.map((imageKey) => {
              const image = microgreenImages[imageKey] ?? microgreenImages["seed-1"];
              const isSelected = imageKey === selectedImageKey;

              return (
                <button
                  key={imageKey}
                  type="button"
                  onClick={() => setSelectedImageKey(imageKey)}
                  aria-label={`Show ${product.name} image`}
                  className={`relative h-[101px] w-[140px] overflow-hidden rounded-[4px] bg-white shadow-[0_18px_30px_rgba(20,20,20,0.16)] transition ${isSelected
                      ? "ring-2 ring-[#73b23f]"
                      : "hover:ring-2 hover:ring-[#d5e8c6]"
                    }`}
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    placeholder="blur"
                    sizes="140px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-28 max-w-5xl rounded-[10px] bg-white px-7 py-6 shadow-[0_24px_80px_rgba(24,28,24,0.09)] md:px-12">
          <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
            {microgreenCertifications.map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#a7d18b] p-3">
                  <Image
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    className="max-h-full w-auto object-contain opacity-70"
                  />
                </div>
                <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#101010]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#aad7be] px-5 pb-12 pt-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.12fr_0.88fr] md:items-start">
          <div className="pt-2 text-[#152516]">
            <h2 className="font-serif text-xl font-semibold leading-tight">
              About {product.name}
            </h2>
            <div className="mt-5 space-y-4 text-black/60 text-md font-semibold leading-5">
              {product.details.about?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <article className="rounded-[7px] bg-white px-7 py-6 text-center shadow-[0_18px_44px_rgba(63,104,74,0.18)] md:col-span-2">
              <div className="mx-auto flex h-20 w-20 items-center justify-center border-b border-[#8fb89b] text-[#5da041]">
                <MdRestaurant className="h-12 w-12" />
              </div>
              <h3 className="mt-5 font-serif text-sm font-bold text-[#152516]">
                Nutritional Profile
              </h3>
              <p className="mt-1 text-[8px] font-semibold text-[#8a6e6e]">
                Plant based goodness
              </p>
              <ul className="mt-3 space-y-1 text-md font-medium leading-4 text-[#313131]">
                <li>{product.details.nutrition}</li>
              </ul>
              <p className="mt-4 text-sm font-semibold leading-4 text-[#6a6a6a]">
                These nutrients contribute to better immunity, digestion,
                metabolism, and overall vitality.
              </p>
            </article>

            <article className="rounded-[7px] bg-white px-7 py-6 text-center shadow-[0_18px_44px_rgba(63,104,74,0.18)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center border-b border-[#8fb89b] text-[#e35f5f]">
                <MdFavoriteBorder className="h-12 w-12" />
              </div>
              <h3 className="mt-5 font-serif text-sm font-bold text-[#152516]">
                Health Benefits
              </h3>
              <ul className="mt-4 space-y-2 text-[12px] font-medium leading-4 text-[#313131]">
                {product.details.healthBenefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-[7px] bg-white px-7 py-6 text-center shadow-[0_18px_44px_rgba(63,104,74,0.18)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center border-b border-[#8fb89b] text-[#5da041]">
                <MdLocalDining className="h-12 w-12" />
              </div>
              <h3 className="mt-5 font-serif text-[15px] font-bold text-[#152516]">
                Culinary Uses
              </h3>
              <ul className="mt-4 space-y-2 text-[12px] font-medium leading-4 text-[#313131]">
                {product.details.culinaryUses.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#eeeeec] px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-[20px] font-semibold text-[#202020]">
            Related Microgreens
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-x-7 gap-y-8 md:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <article key={relatedProduct.slug}>
                <Link href={`/microgreen/${relatedProduct.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-[3px] bg-white shadow-[0_12px_26px_rgba(20,20,20,0.12)]">
                    <Image
                      src={
                        microgreenImages[relatedProduct.image] ??
                        microgreenImages["seed-1"]
                      }
                      alt={relatedProduct.name}
                      fill
                      placeholder="blur"
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-3 min-h-8 text-[10px] font-semibold leading-4 text-[#303030]">
                    {relatedProduct.name}
                  </h3>
                </Link>
                <p className="mt-2 text-md font-bold text-[#70ae3d]">
                  {formatMicrogreenPrice(relatedProduct.price)}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      name: relatedProduct.name,
                      price: formatMicrogreenPrice(relatedProduct.price),
                      image:
                        microgreenImages[relatedProduct.image] ??
                        microgreenImages["seed-1"],
                    })
                  }
                  className="mt-2 h-10 w-full rounded-full bg-[#70ae3d] text-sm font-extrabold uppercase tracking-[0.08em] text-white"
                >
                  Add To Cart
                </button>
              </article>
            ))}
          </div>

          <h2 className="mt-14 text-center font-serif text-[20px] font-semibold text-[#202020]">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 grid gap-3 md:grid-cols-2 md:gap-x-8">
            {faqs.map((faq) => (
              <button
                key={faq}
                type="button"
                className="flex h-8 items-center justify-between border border-[#76bd90] bg-white px-4 text-left text-[10px] font-bold text-[#141414]"
              >
                <span>{faq}</span>
                <MdExpandMore className="h-4 w-4 text-[#76bd90]" />
              </button>
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link
              href="/microgreen"
              className="inline-flex h-7 items-center rounded-full bg-[#70ae3d] px-6 text-[8px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_12px_25px_rgba(112,174,61,0.24)]"
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
