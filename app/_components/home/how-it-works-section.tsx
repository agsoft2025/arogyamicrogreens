import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import workshopBg from "@/assests/mg-header-01.jpg";

export function HowItWorksSection() {
  return (
    <section className="bg-[#f5f5f3] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[914px] px-6">
        <FadeIn>
          <article className="relative min-h-[360px] overflow-hidden rounded-[18px] bg-white md:min-h-[446px]">
            <Image
              src={workshopBg}
              alt=""
              fill
              aria-hidden="true"
              placeholder="blur"
              sizes="(max-width: 768px) calc(100vw - 48px), 914px"
              className="object-cover object-center md:object-right"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.98)_0%,_rgba(255,255,255,0.9)_38%,_rgba(255,255,255,0.36)_62%,_rgba(255,255,255,0.04)_100%)]" />

            <div className="relative flex min-h-[360px] max-w-[540px] flex-col justify-center px-8 py-12 md:min-h-[446px] md:px-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#69ad38]">
                Workshops
              </p>
              <h2 className="mt-6 max-w-[480px] text-4xl font-extrabold leading-tight text-[#172433] md:text-[33px]">
                Grow Microgreens At Home
              </h2>
              <p className="mt-5 max-w-[510px] text-sm font-medium leading-7 text-[#334155]">
                Learn how to grow fresh, chemical-free microgreens right at
                home. A structured, hands-on microgreens workshop designed for
                beginners. In this hands-on workshop, we guide you step-by-step,
                from sowing to harvesting, so you can confidently grow
                nutrient-dense greens at home.
              </p>
              <a
                href="#"
                className="mt-5 inline-flex w-fit rounded-full bg-[#88c82f] px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.06em] text-white transition hover:bg-[#75b827]"
              >
                Whatsapp Now
              </a>
            </div>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
