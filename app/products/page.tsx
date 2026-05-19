"use client";

import { products } from "@/data/products";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductPage() {
  return (
    <section className="pb-20 bg-gray-50 min-h-screen relative overflow-hidden">

      {/* decorative background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

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
