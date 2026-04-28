import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { FadeIn } from "@/app/_components/animations/fade-in";
import products from "@/app/_data/seeds-products.json";
import heroImage from "@/assests/mg-header-01.jpg";
import seedImg1 from "@/assests/mcseed1.png";
import seedImg2 from "@/assests/mcseed2.png";
import seedImg3 from "@/assests/mcseed3.png";
import seedImg4 from "@/assests/mcseed4.png";
import seedImg5 from "@/assests/mcseed5.png";
import seedImg6 from "@/assests/mcseed6.png";
import seedImg7 from "@/assests/mcseed7.png";
import seedImg8 from "@/assests/mcseed8.png";
import seedImg9 from "@/assests/mcseed9.png";
import seedImg10 from "@/assests/mcseed10.png";
import seedImg11 from "@/assests/mcseed11.png";
import seedImg12 from "@/assests/mcseed12.png";
import seedImg13 from "@/assests/mcseed13.png";
import seedImg14 from "@/assests/mcseed14.png";
import seedImg15 from "@/assests/mcseed15.png";
import seedImg16 from "@/assests/mcseed16.png";
import seedImg17 from "@/assests/mcseed17.png";
import seedImg18 from "@/assests/mcseed18.png";
import seedImg19 from "@/assests/mcseed19.png";
import seedImg20 from "@/assests/mcseed20.png";
import seedImg21 from "@/assests/mcseed21.png";
import seedImg22 from "@/assests/mcseed22.png";
import seedImg23 from "@/assests/mcseed23.png";
import seedImg24 from "@/assests/mcseed24.png";
import seedImg25 from "@/assests/mcseed25.png";
import seedImg26 from "@/assests/mcseed26.png";
import seedImg27 from "@/assests/mcseed27.png";
import seedImg28 from "@/assests/mcseed28.png";
import seedImg29 from "@/assests/mcseed29.png";
import seedImg30 from "@/assests/mcseed30.png";
import seedImg31 from "@/assests/mcseed31.png";
import seedImg32 from "@/assests/mcseed32.png";
import seedImg33 from "@/assests/mcseed33.png";
import seedImg34 from "@/assests/mcseed34.png";
import seedImg35 from "@/assests/mcseed35.png";
import seedImg36 from "@/assests/mcseed36.png";
import seedImg37 from "@/assests/mcseed37.png";
import seedImg38 from "@/assests/mcseed38.png";
import seedImg39 from "@/assests/mcseed39.png";
import seedImg40 from "@/assests/mcseed40.png";
import seedImg41 from "@/assests/mcseed41.png";
import seedImg42 from "@/assests/mcseed42.png";
import seedImg43 from "@/assests/mcseed43.png";
import seedImg44 from "@/assests/mcseed44.png";
import seedImg45 from "@/assests/mcseed45.png";
import seedImg46 from "@/assests/mcseed46.png";
import seedImg47 from "@/assests/mcseed47.png";
import seedImg48 from "@/assests/mcseed48.png";
import seedImg49 from "@/assests/mcseed49.png";
import seedImg50 from "@/assests/mcseed50.png";
import seedImg51 from "@/assests/mcseed51.png";
import seedImg52 from "@/assests/mcseed52.png";
import { SeedsProductsClient } from "@/app/_components/seeds/seeds-products-client";

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
  "seed-25": seedImg25,
  "seed-26": seedImg26,
  "seed-27": seedImg27,
  "seed-28": seedImg28,
  "seed-29": seedImg29,
  "seed-30": seedImg30,
  "seed-31": seedImg31,
  "seed-32": seedImg32,
  "seed-33": seedImg33,
  "seed-34": seedImg34,
  "seed-35": seedImg35,
  "seed-36": seedImg36,
  "seed-37": seedImg37,
  "seed-38": seedImg38,
  "seed-39": seedImg39,
  "seed-40": seedImg40,
  "seed-41": seedImg41,
  "seed-42": seedImg42,
  "seed-43": seedImg43,
  "seed-44": seedImg44,
  "seed-45": seedImg45,
  "seed-46": seedImg46,
  "seed-47": seedImg47,
  "seed-48": seedImg48,
  "seed-49": seedImg49,
  "seed-50": seedImg50,
  "seed-51": seedImg51,
  "seed-52": seedImg52,
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
