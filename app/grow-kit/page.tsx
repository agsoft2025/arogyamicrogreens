import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { GrowKitProductsClient } from "@/app/_components/grow-kit/grow-kit-products-client";
import { growKitProducts } from "@/app/_data/grow-kit-products";
import growKitHero from "@/assests/seed1.jpg";

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

      <GrowKitProductsClient products={growKitProducts} />
    </>
  );
}
