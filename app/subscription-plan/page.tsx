"use client";

import MealPlan from "@/components/MealPlan";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  {
    title: "Weekly Plan",
    price: "₹4,999 / Week",
    desc: "Best for flexible users who want to try fresh microgreens.",
    type: "weekly",
  },
  {
    title: "Monthly Plan",
    price: "₹18,000 / Month",
    desc: "Most popular choice - balanced nutrition & consistent delivery.",
    type: "monthly",
    popular: true,
  },
  {
    title: "Quarterly Plan",
    price: "₹30,000 / Quarter",
    desc: "Best value plan for long-term health and maximum savings.",
    type: "quarterly",
  },
];

const planStyles = {
  weekly: {
    ring: "border-emerald-900/10",
    accent: "from-emerald-500 to-green-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  monthly: {
    ring: "border-emerald-500",
    accent: "from-lime-400 via-emerald-500 to-green-700",
    button: "bg-primary hover:opacity-90",
  },
  quarterly: {
    ring: "border-lime-700/20",
    accent: "from-lime-500 to-emerald-700",
    button: "bg-lime-700 hover:bg-lime-800",
  },
};

export default function SubscriptionPlanPage() {
  const router = useRouter();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-[#f7fbf0] py-10 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(52,211,153,0.22),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(190,242,100,0.26),transparent_32%),linear-gradient(180deg,#f7fee7_0%,#f8faf3_46%,#ecfdf5_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(22,101,52,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(22,101,52,0.24)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 md:text-6xl">
            Subscription Plans
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
            Our microgreen subscription plans are designed for every household,
            combining locally grown microgreens with thoughtfully curated meal
            plans and regular deliveries across Hyderabad.
          </p>
        </motion.div>

        <div className="mb-12 mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const style = planStyles[plan.type as keyof typeof planStyles];

            return (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease }}
                whileHover={{ y: -8 }}
                onClick={() => router.push("/contact-us")}
                className={`group relative cursor-pointer overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-[0_18px_60px_rgba(22,101,52,0.08)] transition duration-300 hover:shadow-[0_28px_90px_rgba(22,101,52,0.18)] ${style.ring} ${
                  plan.popular ? "md:-translate-y-3" : ""
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-2 bg-linear-to-r ${style.accent}`}
                />
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-lime-200/36 blur-xl transition duration-500 group-hover:bg-emerald-200/50" />

                {plan.popular && (
                  <div className="absolute right-5 top-5 rounded-full bg-emerald-950 px-4 py-1.5 text-xs font-semibold text-lime-100 shadow-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className="relative pt-4">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-900/8 transition duration-300 group-hover:bg-emerald-700 group-hover:text-white">
                    <CheckCircle2 size={22} />
                  </div>

                  <h2 className="text-2xl font-semibold text-emerald-950">
                    {plan.title}
                  </h2>

                  <p className="mt-4 text-3xl font-semibold tracking-tight text-primary">
                    {plan.price}
                  </p>

                  <p className="mt-4 min-h-16 text-sm leading-7 text-stone-600">
                    {plan.desc}
                  </p>

                  <button
                    type="button"
                    className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 ${style.button}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push("/contact-us");
                    }}
                  >
                    Subscribe Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="rounded-[2rem] border border-emerald-950/8 bg-white/74 p-5 shadow-[0_24px_80px_rgba(22,101,52,0.1)] md:p-8">
          <MealPlan />
        </div>
      </div>
    </section>
  );
}
