"use client";

import { motion } from "framer-motion";

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

    </div>
  );
}