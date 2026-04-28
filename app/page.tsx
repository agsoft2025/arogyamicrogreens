import { FadeIn } from "@/app/_components/animations/fade-in";
import { HowItWorksSection } from "@/app/_components/home/how-it-works-section";
import { SeasonalItemsSection } from "@/app/_components/home/seasonal-items-section";
import { SubscriptionCtaSection } from "@/app/_components/home/subscription-cta-section";
import { WhatWeOfferSection } from "@/app/_components/home/what-we-offer-section";
import { WhyMicrogreensSection } from "@/app/_components/home/why-microgreens-section";
import { FarmHome } from "@/app/_components/home/farm-home";
import Image from "next/image";
import homeImg from "@/assests/mg-header-01.jpg";
import fssai from "@/assests/fssai-n.png";
import msme from "@/assests/msme-1-01.png";
import gmo from "@/assests/non-gmo.png";
import organic from "@/assests/organic.png";
import { HomeImgContainer } from "./_components/home/home-img-container";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.3),_transparent_45%),linear-gradient(180deg,_#f7fff8_0%,_#edf7ef_100%)]">
        <div className="mx-auto grid w-full max-w-7xl items-center grid-cols-[60%_40%]">
          <div className="flex flex-col gap-10 px-6 py-24 md:py-32">
            <FadeIn className="max-w-3xl space-y-6">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-700">
                Microgreens de Manikonda
              </p>
              <h1 className="max-w-2xl font-serif text-5xl font-semibold tracking-tight text-balance text-emerald-950 md:text-6xl">
                Fresh, Farm-Grown Microgreens for Everyday Nutrition.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-emerald-950/70">
                Locally grown. Naturally nutrient-dense. Delivered fresh to your
                doorstep in Hyderabad.
              </p>

              <div className="flex gap-4">
                <Link href="/subscription">
                  <button className="rounded-sm bg-[#71AC43] px-6 py-4 font-bold text-white uppercase">
                    Start A Subscription
                  </button>
                </Link>

                <Link href="/microgreen">
                  <button className="rounded-sm border-b-2 px-6 py-4 font-bold text-black uppercase hover:border-b-[#71AC43] hover:text-[#71AC43]">
                    Shop Microgreens
                  </button>
                </Link>
              </div>

              <FadeIn className="flex items-center gap-8">
                <Image
                  src={organic}
                  alt="Organic"
                  className="h-32 w-auto object-contain"
                />
                <Image
                  src={gmo}
                  alt="GMO"
                  className="h-30 mb-2 w-auto object-contain"
                />
                <Image
                  src={fssai}
                  alt="FSSAI"
                  className="h-32 w-auto object-contain"
                />
                <Image
                  src={msme}
                  alt="MSME"
                  className="h-32 w-auto object-contain"
                />
              </FadeIn>
            </FadeIn>
          </div>
          <FadeIn className="w-full">
            <Image
              src={homeImg}
              alt="Microgreens logo"
              priority
              className="ml-auto w-2/3"
            />
          </FadeIn>
        </div>
      </section>

      <HomeImgContainer />
      <WhyMicrogreensSection />
      <WhatWeOfferSection />
      <FarmHome />
      <SubscriptionCtaSection />
      <SeasonalItemsSection />
      <HowItWorksSection />
    </>
  );
}
