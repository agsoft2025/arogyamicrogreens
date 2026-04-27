import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import alfalfaImage from "@/assests/kit1.png";
import amaranthusImage from "@/assests/kit1.png";
import basilImage from "@/assests/kit2.png";
import beetrootImage from "@/assests/kit3.png";
import growKitHero from "@/assests/seed1.jpg";
import seedTwoImage from "@/assests/kit5.png";
import seedThreeImage from "@/assests/kit6.png";

const products = [
  {
    name: "Aliston Atom Weighing Scale (SF-400)",
    price: "₹215.00",
    image: alfalfaImage,
  },
  {
    name: "A2Agro Water Spray Bottle (5 Litres - Pressure Sprayer)",
    price: "₹999.00",
    image: seedTwoImage,
  },
  {
    name: "IFFCO Urban Garden Horti Coir Cocopeat Block (5kg)",
    price: "₹359.00",
    image: seedThreeImage,
  },
  {
    name: "Microgreen Growing Tray With Drain Holes",
    price: "₹249.00",
    image: amaranthusImage,
  },
  {
    name: "Hand Pressure Spray Bottle For Home Gardens",
    price: "₹449.00",
    image: basilImage,
  },
  {
    name: "Digital PH Meter For Hydroponic Growing",
    price: "₹699.00",
    image: beetrootImage,
  },
];

export default function GrowKitPage() {
  return (
    <>
      <section className="relative min-h-[360px] overflow-hidden bg-black">
        <Image
          src={growKitHero}
          alt=""
          fill
          priority
          aria-hidden="true"
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.82)_0%,_rgba(0,0,0,0.58)_38%,_rgba(0,0,0,0.18)_100%)]" />

        <div className="relative mx-auto flex min-h-[360px] w-full max-w-5xl items-center px-6 py-20">
          <FadeIn className="max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7bd54a]">
              Shop
            </p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white md:text-[54px]">
              Grow Kit
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#f5f5f3] py-16 md:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mb-9 flex justify-end">
            <select
              aria-label="Sort products"
              className="h-11 min-w-[190px] border border-black/10 bg-white px-4 text-sm font-medium text-[#334155] outline-none transition focus:border-[#6ead3d]"
              defaultValue="default"
            >
              <option value="default">Default sorting</option>
              <option value="popularity">Sort by popularity</option>
              <option value="latest">Sort by latest</option>
              <option value="low-high">Sort by price: low to high</option>
              <option value="high-low">Sort by price: high to low</option>
            </select>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <FadeIn key={product.name} delay={0.06 * index} distance={18}>
                <article className="group">
                  <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[#31552b] shadow-[0_8px_18px_rgba(15,23,42,0.18)]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      placeholder="blur"
                      sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc((100vw - 80px) / 2), 300px"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h2 className="mt-5 min-h-[56px] font-serif text-xl font-semibold leading-7 text-[#312f2b]">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-xl font-extrabold text-[#69ad38]">
                    {product.price}
                  </p>
                  <button className="mt-3 w-full rounded-full bg-[#6ead3d] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.04em] text-white shadow-[0_10px_18px_rgba(83,145,46,0.24)] transition hover:bg-[#5f9c34]">
                    Add To Cart
                  </button>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
