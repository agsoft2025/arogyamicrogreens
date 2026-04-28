import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { FadeIn } from "@/app/_components/animations/fade-in";
import products from "@/app/_data/microseeds-products.json";
import heroImage from "@/assests/mg-header-01.jpg";
import seedImg1 from "@/assests/microgreen1.jpg";
import seedImg2 from "@/assests/microgreen2.jpg";
import seedImg3 from "@/assests/microgreen3.jpg";
import seedImg4 from "@/assests/microgreen4.jpg";
import seedImg5 from "@/assests/microgreen5.jpg";
import seedImg6 from "@/assests/microgreen6.png";
import seedImg7 from "@/assests/microgreen7.jpg";
import seedImg8 from "@/assests/microgreen8.jpg";
import seedImg9 from "@/assests/microgreen9.png";
import seedImg10 from "@/assests/microgreen10.jpg";
import seedImg11 from "@/assests/microgreen11.jpg";
import seedImg12 from "@/assests/microgreen12.png";
import seedImg13 from "@/assests/microgreen13.png";
import seedImg14 from "@/assests/microgreen14.jpg";
import seedImg15 from "@/assests/microgreen15.png";
import seedImg16 from "@/assests/microgreen16.jpg";
import seedImg17 from "@/assests/microgreen17.png";
import seedImg18 from "@/assests/microgreen18.jpg";
import seedImg19 from "@/assests/microgreen19.jpg";
import seedImg20 from "@/assests/microgreen20.png";
import seedImg21 from "@/assests/microgreen21.jpg";
import seedImg22 from "@/assests/microgreen22.jpg";
import seedImg23 from "@/assests/microgreen23.jpg";
import seedImg24 from "@/assests/microgreen24.jpg";
import { MicrogreenProductsClient } from "@/app/_components/microgreen/microgreen-products-client";

const productsPerPage = 18;
const totalPages = Math.ceil(products.length / productsPerPage);

const seedImages: Record<string, StaticImageData> = {
  "seed-1": seedImg1,
  "seed-2": seedImg2,
  "seed-3": seedImg3,
  "seed-4": seedImg4,
  "seed-5": seedImg5,
  "seed-6": seedImg6,
  "seed-7": seedImg7,
  "seed-8": seedImg8,
  "seed-9": seedImg9,
  "seed-10": seedImg10,
  "seed-11": seedImg11,
  "seed-12": seedImg12,
  "seed-13": seedImg13,
  "seed-14": seedImg14,
  "seed-15": seedImg15,
  "seed-16": seedImg16,
  "seed-17": seedImg17,
  "seed-18": seedImg18,
  "seed-19": seedImg19,
  "seed-20": seedImg20,
  "seed-21": seedImg21,
  "seed-22": seedImg22,
  "seed-23": seedImg23,
  "seed-24": seedImg24,
};

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
  const pageProducts = products.slice(
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
        seedImages={seedImages}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
