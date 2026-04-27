import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import heroImage from "@/assests/mg-header-01.jpg";
import benefitsImage from "@/assests/seed1.jpg";

const planGroups = ["Single", "Couple", "Family"];

const plans = [
  {
    billing: "Monthly",
    audience: "Single",
    price: "999",
    suffix: "/month",
    accent: "bg-[#c0a58e]",
    bullets: [
      "Fresh weekly deliveries (4/month)",
      "Try different varieties every week",
      "No commitment, pause anytime",
      "Perfect to get started",
    ],
  },
  {
    billing: "Quarterly",
    audience: "Single",
    price: "2,799",
    suffix: "/3 mo",
    accent: "bg-[#8bbf35]",
    featured: true,
    bullets: [
      "12 scheduled deliveries, zero hassle",
      "Priority access to new varieties",
      "Locked pricing for 3 months",
      "Save 7% vs monthly",
    ],
  },
  {
    billing: "Half Yearly",
    audience: "Single",
    price: "4,999",
    suffix: "/6 mo",
    accent: "bg-[#718567]",
    bullets: [
      "26 deliveries with uninterrupted supply",
      "No reordering, fully planned",
      "Access to exclusive recipes",
      "Save 17% vs monthly",
    ],
  },
  {
    billing: "Yearly",
    audience: "Single",
    price: "8,999",
    suffix: "/year",
    accent: "bg-[#62696b]",
    bullets: [
      "52 deliveries across the year",
      "Best value, zero effort subscription",
      "First access to all new launches",
      "Save 25% vs monthly",
    ],
  },
];

const benefits = [
  {
    title: "Fresh microgreens harvested for every delivery",
    description:
      "Cut only after you order to ensure maximum freshness and nutrition.",
    color: "bg-[#c4ab96]",
  },
  {
    title: "Weekly deliveries with flexible varieties",
    description:
      "Enjoy a rotating selection tailored to your preference each week.",
    color: "bg-[#9fc85c]",
  },
  {
    title: "Better value than one-time purchases",
    description:
      "Save more with a subscription compared to individual orders.",
    color: "bg-[#738b6b]",
  },
  {
    title: "No re-ordering or last-minute planning",
    description:
      "Set it once and receive your greens without reminders or follow-ups.",
    color: "bg-[#747474]",
  },
];

export default function SubscriptionPage() {
  return (
    <>
      <section className="relative min-h-[315px] overflow-hidden bg-black">
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.88)_0%,_rgba(0,0,0,0.58)_42%,_rgba(0,0,0,0.12)_100%)]" />

        <div className="relative mx-auto flex min-h-[315px] w-full max-w-5xl items-center px-6 py-16">
          <FadeIn className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7bd54a]">
              Microgreen Subscription Plans
            </p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white md:text-[56px]">
              Fresh Microgreens.
              <br />
              Delivered Consistently.
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-white/82">
              Building a healthy habit is easier when fresh food shows up on
              time.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#f5f5f3] px-6 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-4xl font-bold text-[#241f1c] md:text-[42px]">
              Subscription Plans
            </h2>
            <p className="mt-5 text-sm leading-6 text-[#25352f]/80">
              Our microgreens subscription plans are designed for individuals,
              couples, and families who want fresh, locally grown microgreens
              delivered regularly across Hyderabad. Choose a plan that fits your
              household and let us handle the rest.
            </p>
          </FadeIn>

          <FadeIn delay={0.08} distance={16}>
            <div className="mt-12 overflow-hidden rounded-full bg-[#303030] shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
              <div className="grid min-h-[86px] grid-cols-1 sm:grid-cols-3">
                {planGroups.map((group, index) => (
                  <button
                    key={group}
                    type="button"
                    className={`px-8 py-6 text-center text-3xl font-extrabold uppercase tracking-[0.04em] text-white transition ${
                      index === 0 ? "bg-[#acd6bd]" : "hover:bg-white/5"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="mx-auto mt-12 grid max-w-4xl gap-0 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => (
              <FadeIn
                key={plan.billing}
                delay={0.05 * index}
                distance={20}
                className="h-full"
              >
                <article
                  className={`relative flex h-full min-h-[430px] flex-col overflow-hidden bg-white p-8 shadow-[0_26px_60px_rgba(15,23,42,0.12)] ${
                    index === 0
                      ? "rounded-t-[18px] md:rounded-tr-none lg:rounded-l-[18px]"
                      : ""
                  } ${
                    index === plans.length - 1
                      ? "rounded-b-[18px] md:rounded-bl-none lg:rounded-r-[18px]"
                      : ""
                  } ${plan.featured ? "z-10 lg:-mt-1" : ""}`}
                >
                  {plan.featured ? (
                    <div className="absolute inset-x-0 top-0 h-[74px] bg-[#86bd2f]" />
                  ) : null}

                  <div className="relative">
                    <p
                      className={`font-serif text-sm font-extrabold tracking-[0.06em] ${
                        plan.featured ? "text-white" : "text-[#32231d]"
                      }`}
                    >
                      {plan.billing}
                    </p>
                    <p
                      className={`mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                        plan.featured ? "text-white" : "text-[#32231d]"
                      }`}
                    >
                      {plan.audience}
                    </p>
                  </div>

                  <div className="relative mt-9 flex items-end gap-1 border-b border-black/8 pb-7">
                    <span className="text-4xl font-extrabold text-[#2f3b45]">
                      {"\u20b9"}
                      {plan.price}
                    </span>
                    <span className="pb-1 text-sm font-medium text-[#66717b]">
                      {plan.suffix}
                    </span>
                  </div>

                  <ul className="mt-7 flex flex-1 flex-col gap-5 text-sm leading-5 text-[#27323a]">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7cb84a]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`mt-8 self-center rounded-full px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_12px_20px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 ${plan.accent}`}
                  >
                    Subscribe
                  </button>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#272727]">
        <Image
          src={benefitsImage}
          alt=""
          fill
          aria-hidden="true"
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(38,38,38,0.88)_0%,_rgba(38,38,38,0.78)_34%,_rgba(38,38,38,0.5)_100%)]" />

        <div className="relative mx-auto grid min-h-[720px] w-full max-w-5xl items-center px-6 py-20 md:grid-cols-[0.95fr_1fr] md:py-24">
          <div className="grid gap-y-10 gap-x-14 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <FadeIn
                key={benefit.title}
                delay={0.06 * index}
                distance={22}
                className={index % 2 === 1 ? "sm:translate-y-14" : ""}
              >
                <article className="relative min-h-[200px] w-full overflow-hidden rounded-[12px] bg-white px-8 py-10 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                  <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full border-b border-l border-[#78b944]/25 bg-[radial-gradient(circle_at_80%_20%,_rgba(120,185,68,0.28)_0,_rgba(120,185,68,0.28)_2px,_transparent_3px)] [background-size:14px_14px]" />
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${benefit.color} text-3xl font-bold text-white`}
                    aria-hidden="true"
                  >
                    {"\u2713"}
                  </div>
                  <h3 className="mx-auto mt-8 max-w-[230px] font-serif text-xl font-bold leading-7 text-[#161616]">
                    {benefit.title}
                  </h3>
                  <p className="mx-auto mt-5 max-w-[250px] text-sm font-medium leading-6 text-[#26313c]">
                    {benefit.description}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>

          <div className="hidden md:block" aria-hidden="true" />
        </div>
      </section>
    </>
  );
}
