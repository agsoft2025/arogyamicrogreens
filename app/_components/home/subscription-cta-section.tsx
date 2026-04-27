import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/app/_components/animations/fade-in";
import subscribeImage from "@/assests/subscribe-01.png";

export function SubscriptionCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#88bd59] py-20 md:py-24">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20px_20px,_rgba(255,255,255,0.4)_1px,_transparent_1px)] [background-size:54px_54px]" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 px-6 md:grid-cols-[0.95fr_1.8fr]">
        <FadeIn className="space-y-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-white">
            Free Home Delivery
          </p>
          <h2 className="max-w-sm font-serif text-5xl font-bold leading-[1.08] text-black md:text-[46px]">
            Build a Daily Greens Habit
          </h2>
          <a
            href="#"
            className="inline-flex rounded-full bg-white px-6 py-3 text-xs font-extrabold uppercase tracking-[0.06em] text-[#0d2235] transition hover:bg-[#f1f5e8]"
          >
            Whatsapp Us
          </a>
        </FadeIn>

        <FadeIn
          delay={0.14}
          className="grid overflow-hidden rounded-3xl bg-white md:grid-cols-[0.9fr_1fr]"
        >
          <div className="flex min-h-[280px] items-center justify-center px-6 py-8">
            <Image
              src={subscribeImage}
              alt="Subscription plan illustration"
              placeholder="blur"
              className="h-auto w-full max-w-[300px] object-contain"
            />
          </div>

          <div className="flex flex-col justify-center px-8 py-10 md:px-10">
            <h3 className="text-2xl font-extrabold text-black">
              Subscription Plans
            </h3>
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.06em] text-black">
              Starts at just
            </p>
            <p className="mt-1 text-3xl font-extrabold text-black">
              ₹ 999/month
            </p>
            <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.08em] text-black">
              Single, couple, or family
            </p>
            <p className="mt-7 text-sm font-medium text-black">
              Choose a plan that fits your lifestyle...
            </p>
            <Link
              href="/subscription"
              className="mt-7 inline-flex w-fit rounded-full bg-[#6ead3d] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.06em] text-white transition hover:bg-[#5e9d31]"
            >
              Subscribe Now
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
