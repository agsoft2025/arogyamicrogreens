import Image, { type StaticImageData } from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import alfalfaImage from "@/assests/Alfalfa-Microgreen-3-300x300.jpg";
import amaranthusImage from "@/assests/Amaranthus-Microgreen-1-1-300x300.jpg";
import basilImage from "@/assests/Basil-Microgreen-4-300x300.jpg";
import beetrootImage from "@/assests/Beetroot-Microgreen-1-300x300.jpg";

const products = [
  {
    name: "Alfalfa Microgreens",
    price: "₹249.00",
    action: "Add To Cart",
    image: alfalfaImage,
  },
  {
    name: "Amaranthus Microgreens",
    price: "₹249.00",
    action: "Add To Cart",
    image: amaranthusImage,
  },
  {
    name: "Basil Microgreens",
    price: "₹249.00",
    action: "Read More",
    image: basilImage,
  },
  {
    name: "Beetroot Microgreens",
    price: "₹299.00",
    action: "Read More",
    image: beetrootImage,
  },
];

type Product = {
  name: string;
  price: string;
  action: string;
  image: StaticImageData;
};

export function SeasonalItemsSection() {
  return (
    <section className="bg-[#f7f6f1] py-20 md:py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <FadeIn className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#69ad38]">
              Microgreens
            </p>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight text-[#142331] md:text-[42px]">
              Hot Seasonal Items
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex w-fit rounded-full bg-[#6ead3d] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.05em] text-white transition hover:bg-[#5e9d31]"
          >
            Browse All Products
          </a>
        </FadeIn>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <FadeIn delay={0.08 * (index + 1)} distance={18}>
      <article>
        <div className="overflow-hidden rounded-lg bg-white">
          <Image
            src={product.image}
            alt={product.name}
            placeholder="blur"
            className="aspect-square h-auto w-full object-cover"
          />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-[#363636]">
          {product.name}
        </h3>
        <p className="mt-8 text-sm font-medium text-[#ff6b35]">
          {product.price}
        </p>
        <a
          href="#"
          className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[#6ead3d] px-5 text-xs font-extrabold uppercase tracking-[0.03em] text-white shadow-[0_10px_18px_rgba(105,173,56,0.2)] transition hover:bg-[#5e9d31]"
        >
          {product.action}
        </a>
      </article>
    </FadeIn>
  );
}
