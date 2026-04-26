import Image, { type StaticImageData } from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import dummyImage from "@/assests/mg-header-01.jpg";
import seed1 from "@/assests/seed1.jpg";
import seed2 from "@/assests/seed2.jpg";
import seed3 from "@/assests/seed3.jpg";

const offerCards = [
  {
    title: "Fresh Microgreens",
    subtitle: "For Daily Consumption",
    action: "Shop Now",
    image: seed1,
    variant: "split",
  },
  {
    title: "Microgreen Seeds",
    subtitle: "For Home Growing",
    action: "Shop Now",
    image: seed2,
    variant: "overlay",
  },
  {
    title: "Subscription Plans",
    subtitle: "Build a daily greens habit",
    action: "Subscribe Now",
    image: seed3,
    variant: "wide",
  },
  {
    title: "Workshops",
    subtitle: "Join a community of like-minded people",
    action: "Know More",
    image: dummyImage,
    variant: "overlay",
  },
] as const;

type OfferCard = {
  title: string;
  subtitle: string;
  action: string;
  image: StaticImageData;
  variant: "split" | "overlay" | "wide";
};

export function WhatWeOfferSection() {
  return (
    <section className="bg-[#f4f4f2] py-20 md:py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <FadeIn className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#69ad38]">
            Earth-Friendly Choices
          </p>
          <h2 className="mt-5 font-serif text-5xl font-bold leading-tight text-[#25252a] md:text-[52px]">
            What we offer
          </h2>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-[2fr_0.95fr]">
          <div className="grid gap-6">
            <OfferCard card={offerCards[0]} />
            <OfferCard card={offerCards[2]} />
          </div>

          <div className="grid gap-6">
            <OfferCard card={offerCards[1]} />
            <OfferCard card={offerCards[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ card }: { card: OfferCard }) {
  if (card.variant === "split") {
    return (
      <FadeIn className="grid min-h-[210px] overflow-hidden bg-white md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-start justify-center p-5 md:p-7">
          <ZigZag className="text-[#c5db72]" />
          <h3 className="mt-5 font-serif text-3xl font-bold leading-none text-[#25252a]">
            {card.title}
          </h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.04em] text-[#25252a]">
            {card.subtitle}
          </p>
          <a
            href="#"
            className="mt-5 rounded-full bg-[#6ead3d] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.05em] text-white transition hover:bg-[#5e9d31]"
          >
            {card.action}
          </a>
        </div>
        <Image
          src={card.image}
          alt=""
          placeholder="blur"
          className="h-full min-h-[210px] w-full object-cover"
        />
      </FadeIn>
    );
  }

  const isWide = card.variant === "wide";

  return (
    <FadeIn
      className={
        isWide
          ? "relative min-h-[410px] overflow-hidden"
          : "relative min-h-[210px] overflow-hidden md:min-h-[410px]"
      }
    >
      <Image
        src={card.image}
        alt=""
        placeholder="blur"
        fill
        sizes={isWide ? "(max-width: 768px) 100vw, 640px" : "320px"}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/42" />
      <div className="absolute inset-x-5 bottom-7 z-10 text-white">
        <ZigZag className={isWide ? "text-white/75" : "text-[#d7b342]"} />
        <h3 className="mt-4 font-serif text-4xl font-bold leading-none md:text-[44px]">
          {card.title}
        </h3>
        <p className="mt-3 max-w-sm text-sm font-bold uppercase leading-5 tracking-[0.02em]">
          {card.subtitle}
        </p>
        <a
          href="#"
          className="mt-5 inline-flex rounded-full bg-white/55 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.05em] text-black transition hover:bg-[#e2bd76]"
        >
          {card.action}
        </a>
      </div>
    </FadeIn>
  );
}

function ZigZag({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-14 ${className}`}
      viewBox="0 0 54 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 9L9 2L18 10L27 2L36 10L45 2L53 9"
        stroke="currentColor"
        strokeWidth="5"
      />
    </svg>
  );
}
