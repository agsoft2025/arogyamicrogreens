"use client";

import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { useCart } from "@/app/_components/cart/cart-context";

type Product = {
  name: string;
  price: string;
  image: any;
};

type GrowKitProductsClientProps = {
  products: Product[];
};

export function GrowKitProductsClient({ products }: GrowKitProductsClientProps) {
  const { addToCart } = useCart();

  return (
    <section className="bg-[#f5f5f3] py-16 md:py-20">
      <div className="mx-auto w-full max-w-5xl px-6">
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
                <button
                  onClick={() =>
                    addToCart({
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className="mt-3 w-full rounded-full bg-[#6ead3d] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.04em] text-white shadow-[0_10px_18px_rgba(83,145,46,0.24)] transition hover:bg-[#5f9c34]"
                >
                  Add To Cart
                </button>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
