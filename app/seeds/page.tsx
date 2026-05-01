import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { SeedsProductsClient } from "@/app/_components/seeds/seeds-products-client";
import { seedImages, seedProducts } from "@/app/_data/seeds-products";
import heroImage from "@/assests/mg-header-01.jpg";

const productsPerPage = 18;
const totalPages = Math.ceil(seedProducts.length / productsPerPage);

type SeedsPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function getPageNumber(pageParam: string | string[] | undefined) {
  const rawPage = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const pageNumber = Number(rawPage ?? "1");

  if (!Number.isInteger(pageNumber)) {
    return 1;
  }

  return Math.min(Math.max(pageNumber, 1), totalPages);
}

export default async function SeedsPage({ searchParams }: SeedsPageProps) {
  const { page } = await searchParams;
  const currentPage = getPageNumber(page);
  const pageProducts = seedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  return (
    <>
      <section className="relative min-h-[312px] overflow-hidden bg-black">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          aria-hidden="true"
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.84)_0%,_rgba(0,0,0,0.58)_42%,_rgba(0,0,0,0.14)_100%)]" />

        <div className="relative mx-auto flex min-h-[312px] w-full max-w-5xl items-center px-6 py-16">
          <FadeIn className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7bd54a]">
              Shop
            </p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white md:text-[54px]">
              Microgreen Seeds
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold uppercase leading-7 tracking-[0.12em] text-white/80">
              Grow fresh microgreens at home with our high-quality, non-GMO
              microgreen seeds - suitable for beginners and experienced growers.
            </p>
          </FadeIn>
        </div>
      </section>

      <SeedsProductsClient
        pageProducts={pageProducts}
        seedImages={seedImages}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
