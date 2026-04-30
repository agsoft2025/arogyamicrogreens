import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import { MicrogreenProductsClient } from "@/app/_components/microgreen/microgreen-products-client";
import {
  microgreenImages,
  microgreenProducts,
} from "@/app/_data/microgreen-products";
import heroImage from "@/assests/mg-header-01.jpg";

const productsPerPage = 18;
const totalPages = Math.ceil(microgreenProducts.length / productsPerPage);

type MicrogreenPageProps = {
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

export default async function MicrogreenPage({
  searchParams,
}: MicrogreenPageProps) {
  const { page } = await searchParams;
  const currentPage = getPageNumber(page);
  const pageProducts = microgreenProducts.slice(
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
              Microgreen
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold uppercase leading-7 tracking-[0.12em] text-white/80">
              Harvested on order. Never pre-cut. Never stored.
            </p>
          </FadeIn>
        </div>
      </section>

      <MicrogreenProductsClient
        pageProducts={pageProducts}
        seedImages={microgreenImages}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
