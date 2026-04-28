import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { GrowKitProductsClient } from "@/app/_components/grow-kit/grow-kit-products-client";
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

      <GrowKitProductsClient products={products} />
    </>
  );
}
