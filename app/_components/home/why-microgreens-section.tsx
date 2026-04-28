import { FadeIn } from "@/app/_components/animations/fade-in";
import Image from "next/image";
import atOne from "@/assests/at-1-01.png";
import atTwo from "@/assests/at-2-01.png";
import Link from "next/link";

const microgreenBenefits = [
  {
    title: "Nutrient-dense greens harvested young",
  },
  {
    title: "Rich in vitamins, minerals & antioxidants",
  },
  {
    title: "Easy to consume with Indian meals",
  },
  {
    title: "Supports daily wellness & energy",
  },
];

export function WhyMicrogreensSection() {
  return (
    <section className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-[0.9fr_1fr_0.9fr] md:items-center">
        <FadeIn className="space-y-9">
          <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#69ad38]">
            Why Microgreens
          </p>
          <h2 className="max-w-sm font-serif text-5xl font-bold leading-[1.28] text-black md:text-[52px]">
            Why Add Microgreens to Your Daily Diet?
          </h2>
          <Link
            href="/microgreen"
            className="inline-block rounded-sm bg-[#6ead3d] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#5e9d31]"
          >
            Know More
          </Link>
        </FadeIn>

        <FadeIn
          delay={0.12}
          className="relative hidden min-h-[500px] items-center justify-center md:flex"
        >
          <Image
            src={atOne}
            alt=""
            aria-hidden="true"
            placeholder="blur"
            className="absolute top-0 left-1/2 h-auto w-[210px] -translate-x-1/2 object-contain opacity-75"
          />
          <Image
            src={atTwo}
            alt=""
            aria-hidden="true"
            placeholder="blur"
            className="absolute bottom-0 left-1/2 h-auto w-[220px] -translate-x-1/2 object-contain opacity-75"
          />
        </FadeIn>

        <div className="space-y-4 md:pt-10">
          {microgreenBenefits.map((item, index) => (
            <FadeIn
              key={item.title}
              delay={0.12 * (index + 1)}
              className="border-b border-[#69ad38] pb-4"
            >
              <h3 className="text-[22px] font-extrabold leading-snug text-[#69ad38]">
                {index + 1}. {item.title}
              </h3>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
