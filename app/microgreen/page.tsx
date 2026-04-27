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
                      src={seedImages[product.image] ?? seedImg1}
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
                  <button className="mt-3 w-full rounded-full bg-[#6ead3d] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.04em] text-white shadow-[0_10px_18px_rgba(83,145,46,0.24)] transition hover:bg-[#5f9c34]">
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
                  href={`/microgreen?page=${pageNumber}`}
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
