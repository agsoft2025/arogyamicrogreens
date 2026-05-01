"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import {
  MdAdd,
  MdAddCircle,
  MdChevronRight,
  MdLocalFlorist,
  MdRemove,
  MdRemoveCircle,
  MdSearch,
  MdScience,
  MdSpa,
} from "react-icons/md";

// Add custom animation styles
const animationStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
`;

import { useCart } from "@/app/_components/cart/cart-context";
import {
  type SeedInfoSection,
  type SeedProduct,
  formatSeedPrice,
  seedFaqs,
  seedImages,
  seedProducts,
} from "@/app/_data/seeds-products";

type SeedSinglePageViewProps = {
  product: SeedProduct;
};

export function SeedSinglePageView({
  product,
}: SeedSinglePageViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageKey, setSelectedImageKey] = useState(product.gallery[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(1);
  const [openInfoSectionIndex, setOpenInfoSectionIndex] = useState(0);
  const { addToCart } = useCart();
  const relatedProducts = seedProducts.filter((relatedProduct) =>
    product.relatedProducts.includes(relatedProduct.name),
  );
  const selectedImage =
    seedImages[selectedImageKey] ?? seedImages[product.image];

  const addProductToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart({
        name: product.name,
        price: formatSeedPrice(product.price),
        image: seedImages[product.image] ?? seedImages["seed-1"],
      });
    }
  };

  const growingParameters = product.growingParameters;
  const growingSteps = product.growingSteps;

  const faqColumns = seedFaqs.reduce<
    Array<Array<{ question: string; answer: string; index: number }>>
  >(
    (columns, faq, index) => {
      columns[index % 2].push({ ...faq, index });
      return columns;
    },
    [[], []],
  );
  const renderInfoSection = (
    section: SeedInfoSection,
    index: number,
  ) => {
    const isOpen = index === openInfoSectionIndex;

    return (
      <article 
        key={section.title} 
        className="border border-white/15 transition-all duration-300 ease-in-out"
      >
        <button
          type="button"
          onClick={() =>
            setOpenInfoSectionIndex((currentIndex) =>
              currentIndex === index ? -1 : index,
            )
          }
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-all duration-200 hover:bg-white/5"
          aria-expanded={isOpen}
        >
          <h3 className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#a9d8b1]">
            {section.title}
          </h3>
          <span 
            className="text-lg font-bold text-white/90 transition-transform duration-300"
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            +
          </span>
        </button>

        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-white/15 px-5 py-5">
            {section.description ? (
              <p className="text-[15px] font-medium leading-8 text-white/95 animate-fadeIn">
                {section.description}
              </p>
            ) : null}

            {section.leadIn ? (
              <p className="mt-4 text-[15px] font-medium text-white/95 animate-fadeIn">
                {section.leadIn}
              </p>
            ) : null}

            {section.items && section.items.length > 0 ? (
              <ul className="mt-4 space-y-2 text-[15px] font-medium leading-7 text-white/90 animate-fadeIn">
                {section.items.map((item, itemIndex) => (
                  <li 
                    key={item} 
                    className="transform transition-all duration-300"
                    style={{ 
                      transform: `translateX(${isOpen ? '0' : '-20px'})`,
                      opacity: isOpen ? 1 : 0,
                      transitionDelay: `${itemIndex * 50}ms`
                    }}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {section.conclusion ? (
              <p className="mt-5 text-[15px] font-medium leading-8 text-white/95 animate-fadeIn">
                {section.conclusion}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      <style jsx>{animationStyles}</style>
      <section className="bg-[#f5f5f3] px-5 py-10 md:py-14">
        <div className="mx-auto max-w-6xl rounded-[18px] bg-white px-6 py-5 shadow-[0_28px_80px_rgba(24,28,24,0.12)] md:px-8 md:py-6">
          <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-r-[28px] bg-[#d7e6ba] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[#31552b] md:min-w-[385px]">
            <Link href="/" className="transition hover:text-[#223b1f]">
              Home
            </Link>
            <MdChevronRight className="h-4 w-4 text-[#6a8359]" />
            <Link href="/seeds" className="transition hover:text-[#223b1f]">
              Microgreen Seeds
            </Link>
            <MdChevronRight className="h-4 w-4 text-[#6a8359]" />
            <span className="text-[#1c3723]">{product.name}</span>
          </div>

          <div className="mt-6 grid gap-12 md:grid-cols-[420px_minmax(0,1fr)] md:items-start">
            <div className="md:pl-4">
              <div className="relative aspect-square overflow-hidden rounded-[6px] border-[12px] border-[#37582f] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  placeholder="blur"
                  sizes="(max-width: 768px) calc(100vw - 72px), 420px"
                  className="object-cover"
                />
                <button
                  type="button"
                  aria-label="Zoom image"
                  className="absolute right-0 top-0 flex h-9 w-9 -translate-y-1/3 translate-x-1/3 items-center justify-center rounded-full bg-white text-[#161616] shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                >
                  <MdSearch className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-w-[500px] pt-1">
              <h1 className="font-serif text-xl font-bold leading-[1.08] text-[#2c2b31] md:text-[58px] md:tracking-[-0.02em]">
                {product.name}
              </h1>

              <div className="mt-7 space-y-4 text-[18px] font-medium leading-7 text-[#667b9c]">
                {product.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-8 text-3xl font-extrabold leading-none text-[#77b03d]">
                {formatSeedPrice(product.price)}
              </p>
              <p className="mt-2 text-lg italic tracking-[0.02em] text-[#7b6c63]">
                {product.packSizeLabel}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((currentQuantity) =>
                      Math.max(1, currentQuantity - 1),
                    )
                  }
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-[3px] bg-[#3e4145] text-white"
                >
                  <MdRemove className="h-5 w-5" />
                </button>
                <span className="flex h-14 w-16 items-center justify-center rounded-[8px] bg-[#f3f3f3] text-base font-medium text-[#101010]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((currentQuantity) => currentQuantity + 1)
                  }
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-[3px] bg-[#3e4145] text-white"
                >
                  <MdAdd className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={addProductToCart}
                  className="ml-2 rounded-full bg-[#78b33f] px-9 py-5 text-[15px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_18px_30px_rgba(145,95,211,0.14)] transition hover:bg-[#6aa136]"
                >
                  Add To Cart
                </button>
              </div>

              <div className="mt-12 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[6px] bg-[#25d366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.24)]">
                  <BsWhatsapp className="h-8 w-8" />
                </div>
                <div className="pt-1">
                  <p className="text-[16px] font-semibold uppercase tracking-[0.04em] text-[#2f3746]">
                    {product.bulkOrdersTitle}
                  </p>
                  <p className="mt-1 text-[17px] font-medium text-[#2f3746]">
                    {product.bulkOrdersText.split("@")[0].trim()}
                    {" "}
                    <span className="font-bold text-[#24b55d]">
                      @{product.bulkOrdersText.split("@")[1]?.trim()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-10 pb-1 md:gap-12">
            {product.gallery.map((imageKey) => {
              const thumbnailImage =
                seedImages[imageKey] ?? seedImages[product.image];
              const isSelected = imageKey === selectedImageKey;

              return (
                <button
                  key={imageKey}
                  type="button"
                  onClick={() => setSelectedImageKey(imageKey)}
                  aria-label={`Show ${product.name} image`}
                  className={`relative h-[106px] w-[150px] overflow-hidden rounded-[8px] bg-[#37582f] shadow-[0_18px_36px_rgba(0,0,0,0.16)] transition ${
                    isSelected ? "ring-2 ring-[#37582f]" : "hover:ring-2 hover:ring-[#b5d198]"
                  }`}
                >
                  <Image
                    src={thumbnailImage}
                    alt={product.name}
                    fill
                    placeholder="blur"
                    sizes="150px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-[22px] bg-[#3b3838] px-6 py-7 text-white shadow-[0_28px_48px_rgba(0,0,0,0.28)] md:px-12 md:py-12">
          <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
            <div className="space-y-6 text-[16px] font-medium leading-8 text-white">
              {product.description1 && product.description1.length > 0 
                ? product.description1.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))
                : product.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))
              }
            </div>

            <div className="space-y-4">
              {product.infoSections.map(renderInfoSection)}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl px-2 md:px-0">
          <div className="grid gap-12 md:grid-cols-[250px_minmax(0,1fr)] md:gap-14">
            <div>
              <p className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#7bb33b]">
                Step By Step
              </p>
              <h2 className="mt-3 font-serif text-[62px] leading-[0.95] tracking-[-0.04em] text-[#2f2f2f]">
                HOW TO
                <br />
                GROW
              </h2>

              <div className="mt-10">
                <h3 className="text-[18px] font-extrabold uppercase tracking-[0.08em] text-[#1f2430]">
                  Growing Parameters:
                </h3>
                <div className="mt-4 space-y-0">
                  {growingParameters.map((parameter) => (
                    <div
                      key={parameter}
                      className="border-b border-[#b8d7bf] py-5 text-[15px] font-semibold tracking-[0.06em] text-[#243143]"
                    >
                      {parameter}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative border-l border-[#2f2f2f] pl-6 md:pl-8">
              <div className="space-y-10">
                {growingSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative grid gap-4 md:grid-cols-[170px_minmax(0,1fr)] md:gap-10"
                  >
                    <span className="absolute -left-[35px] top-1 h-3 w-3 bg-[#7bb33b]" />
                    <div>
                      <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#7bb33b]">
                        Step {index + 1}
                      </p>
                      <h4 className="mt-2 font-serif text-[18px] font-bold text-[#2f2f2f]">
                        {step.title}
                      </h4>
                    </div>
                    <p className="max-w-[360px] text-[15px] font-medium leading-8 text-[#4c596b]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          <article className="rounded-[10px] bg-white px-6 py-6 shadow-[0_18px_44px_rgba(63,104,74,0.12)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6e7] text-[#5da041]">
              <MdScience className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#152516]">
              Seed Profile
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-[#475569]">
              <div>
                <dt className="font-bold text-[#152516]">Scientific name</dt>
                <dd>{product.scientificName}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#152516]">Flavor profile</dt>
                <dd>{product.flavorProfile}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#152516]">Harvest window</dt>
                <dd>{product.growingTime}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#152516]">Difficulty</dt>
                <dd>{product.difficulty}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[10px] bg-white px-6 py-6 shadow-[0_18px_44px_rgba(63,104,74,0.12)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6e7] text-[#5da041]">
              <MdSpa className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#152516]">
              Growing Notes
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-[#475569]">
              {product.growingNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-[10px] bg-white px-6 py-6 shadow-[0_18px_44px_rgba(63,104,74,0.12)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6e7] text-[#5da041]">
              <MdLocalFlorist className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-serif text-xl font-semibold text-[#152516]">
              Best For
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-[#475569]">
              {product.bestFor.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-[#f5f5f3] px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-[48px] font-semibold leading-none text-[#2c2b31]">
            Frequently Asked Questions
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-10">
            {faqColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-3">
                {column.map((faq) => {
                  const isOpen = openFaqIndex === faq.index;

                  return (
                    <div
                      key={faq.question}
                      className="border border-[#b8e1d0] bg-white px-4 py-4"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqIndex((current) =>
                            current === faq.index ? null : faq.index,
                          )
                        }
                        className="flex w-full items-start justify-between gap-4 text-left"
                      >
                        <span className="text-[16px] font-extrabold text-[#111827]">
                          {faq.question}
                        </span>
                        <span className="pt-0.5 text-[#b8e1d0]">
                          {isOpen ? (
                            <MdRemoveCircle className="h-5 w-5" />
                          ) : (
                            <MdAddCircle className="h-5 w-5" />
                          )}
                        </span>
                      </button>
                      {isOpen ? (
                        <p className="mt-4 max-w-[360px] text-[15px] font-medium leading-7 text-[#6b7280]">
                          {faq.answer}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <h2 className="mt-16 text-center font-serif text-[24px] font-semibold text-[#202020]">
            Related Seeds
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <article key={relatedProduct.slug}>
                <Link href={`/seeds/${relatedProduct.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-[8px] border-[6px] border-[#31552b] bg-white shadow-[0_12px_26px_rgba(20,20,20,0.12)]">
                    <Image
                      src={
                        seedImages[relatedProduct.image] ?? seedImages["seed-1"]
                      }
                      alt={relatedProduct.name}
                      fill
                      placeholder="blur"
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-3 min-h-10 text-sm font-semibold leading-5 text-[#303030]">
                    {relatedProduct.name}
                  </h3>
                </Link>
                <p className="mt-2 text-md font-bold text-[#70ae3d]">
                  {formatSeedPrice(relatedProduct.price)}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      name: relatedProduct.name,
                      price: formatSeedPrice(relatedProduct.price),
                      image:
                        seedImages[relatedProduct.image] ?? seedImages["seed-1"],
                    })
                  }
                  className="mt-3 h-10 w-full rounded-full bg-[#70ae3d] text-xs font-extrabold uppercase tracking-[0.08em] text-white"
                >
                  Add To Cart
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
