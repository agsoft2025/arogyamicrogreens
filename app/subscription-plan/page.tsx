"use client";

import MealPlan from "@/components/MealPlan";
import { motion } from "framer-motion";
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
    desc: "Most popular choice — balanced nutrition & consistent delivery.",
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

export default function SubscriptionPlanPage() {
  const router = useRouter();

  return (
    <section className="py-20 bg-gray-50 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Subscription Plans
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our microgreen subscription plans are designed for every household, combining locally grown microgreens with thoughtfully curated meal plans and regular deliveries across Hyderabad.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-14 mb-10">

          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/contact-us")}
              className={`
                relative bg-white rounded-2xl p-8 cursor-pointer transition
                shadow-lg border
                ${plan.popular ? "border-green-500 scale-105 shadow-2xl" : "border-gray-100"}
              `}
            >

              {/* Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-4 py-1 rounded-full font-semibold">
                  MOST POPULAR
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                {plan.title}
              </h2>

              {/* Price */}
              <p className="text-center text-primary text-xl font-bold mt-4">
                {plan.price}
              </p>

              {/* Description */}
              <p className="text-center text-gray-600 mt-4 text-sm leading-relaxed">
                {plan.desc}
              </p>

              {/* Button */}
              <div className="flex justify-center">
                <button
                  className={`
                    mt-6 px-6 py-3 rounded-full font-medium transition duration-300
                    ${plan.type === "weekly"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : plan.type === "monthly"
                        ? "bg-primary text-white hover:opacity-90"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }
                  `}
                >
                  Subscribe Now
                </button>
              </div>

            </motion.div>
          ))}

        </div>
        <MealPlan />
      </div>
    </section>
  );
}