"use client";

import { motion } from "framer-motion";
import breakfast from "@/assests/Breakfast.png"
import lunch from "@/assests/Lunch.png"
import dinner from "@/assests/Dinner.png"
import Image from "next/image";

const mealPlan = [
  {
    time: "Breakfast",
    items: [
      "Mixed Vegetable Juice or Nutri mix Malt",
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
      "Fresh fruit juice or Flavored Butter Milk",
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

const foodContainer = [
  {
    name: "Breakfast",
    image: breakfast
  },
  {
    name: "Lunch",
    image: lunch
  },
  {
    name: "Dinner",
    image: dinner
  }
]

export default function MealPlan() {
  return (
    <div>

      {/* Header */}
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

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-14">
        {mealPlan.map((meal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -10, scale: 1.03 }}
            className="rounded-2xl border border-white bg-white/92 p-8 shadow-xl"
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

      {/* Food Container */}
      <div className="grid md:grid-cols-3 gap-8 mt-14">
        {foodContainer.map((food, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.15
            }}
            whileHover={{
              y: -12,
              scale: 1.03
            }}
            className="group relative overflow-hidden rounded-4xl shadow-2xl"
          >
            {/* Image */}
            <div className="relative h-125 overflow-hidden bg-white">
              <Image
                src={food.image}
                alt={food.name}
                fill
                className="object-contain transition duration-700 group-hover:scale-105"
              />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            {/* Floating Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-xl transition duration-700 group-hover:bg-primary/30" />

            {/* Content */}
            <div className="absolute top-0 left-0 p-2 text-primary">

              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                {food.name}
              </h2>

              {/* Animated Line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "70px" }}
                transition={{
                  delay: 0.4 + index * 0.2,
                  duration: 0.6
                }}
                className="mt-5 h-1 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
