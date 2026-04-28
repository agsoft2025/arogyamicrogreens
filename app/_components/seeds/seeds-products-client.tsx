"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { useCart } from "@/app/_components/cart/cart-context";

type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type SeedsProductsClientProps = {
  pageProducts: Product[];
  seedImages: Record<string, StaticImageData>;
  currentPage: number;
  totalPages: number;
};

export function SeedsProductsClient({ 
  pageProducts, 
  seedImages, 
  currentPage, 
  totalPages 
}: SeedsProductsClientProps) {
  const { addToCart } = useCart();

  return (
    <>
      <section className="bg-[#f5f5f3] py-16 md:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mb-9 flex justify-end">
            <select
              aria-label="Sort seeds"
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
            {pageProducts.map((product, index) => (
              <FadeIn
                key={product.id}
                delay={0.035 * (index % 6)}
                distance={18}
              >
                <article className="group">
                  <div className="relative aspect-square overflow-hidden rounded-[10px] border-[8px] border-[#31552b] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.18)]">
                    <Image
                      src={seedImages[product.image] ?? seedImages["seed-1"]}
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
                    {"\u20b9"}
                    {product.price}
                  </p>
                  <button
                    onClick={() =>
                      addToCart({
                        name: product.name,
                        price: `₹${product.price}`,
                        image: seedImages[product.image] ?? seedImages["seed-1"],
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

          <nav
            aria-label="Seeds pagination"
            className="mt-12 flex items-center justify-center gap-3"
          >
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === currentPage;

              return (
                <Link
                  key={pageNumber}
                  href={`/seeds?page=${pageNumber}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold transition ${isActive
                    ? "bg-[#31552b] text-white"
                    : "bg-white text-[#31552b] hover:bg-[#6ead3d] hover:text-white"
                    }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
    </>
  );
}
