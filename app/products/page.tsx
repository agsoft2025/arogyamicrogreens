"use client";

import { products } from "@/data/products";
import { motion } from "framer-motion";
import Image from "next/image";

const mealPlan = [
  {
    time: "Breakfast",
    items: [
      "Mixed Vegetable Juice",
      "Salad with Microgreens",
      "4 varieties of Dry fruits",
      "Soaked Greens",
      "Dates or Nutri Laddu",
      "Fresh seasonal Fruit juice",
      "Weekly thrice millet or oats Pongal",
    ],
  },
  {
    time: "Lunch",
    items: [
      "Fresh fruit juice / Flavored Butter Milk / Multigrain Java",
      "2 Curries and Chutney",
      "Brown Rice with healthy snack",
      "Curd rice",
      "Boiled Egg (Optional)",
    ],
  },
  {
    time: "Dinner",
    items: ["Mixed Fruit Bowl", "2 Curries", "Multigrain Pulka"],
  },
];

export default function ProductPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen relative overflow-hidden">

      {/* decorative background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ===== MEAL PLAN SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Meal Plan
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            A balanced nutrition plan designed with microgreens, fruits, grains and healthy combinations for daily wellness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {mealPlan.map((meal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-8"
            >
              <h2 className="text-2xl font-bold text-center text-primary mb-6">
                {meal.time}
              </h2>

              <ul className="space-y-3">
                {meal.items.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ===== PRODUCTS SECTION ===== */}
        <div className="pt-20">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Products
            </h1>

            <p className="text-gray-600 mt-4">
              Fresh microgreens with natural nutrition and premium quality
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-14">
            {products.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-2xl transition"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="font-bold text-gray-800">
                    {item.title}
                  </h2>

                  <p className="text-yellow-500 text-sm mt-1">
                    ⭐ {item.rating}
                  </p>

                  <p className="text-primary font-bold mt-2 text-lg">
                    ₹{item.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}