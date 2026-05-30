"use client";

import { products } from "@/data/products";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ProductPage() {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7fbf0] py-10 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(52,211,153,0.2),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(190,242,100,0.25),transparent_30%),linear-gradient(180deg,#f7fee7_0%,#fbfcf8_50%,#ecfdf5_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(22,101,52,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(22,101,52,0.24)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 md:text-6xl">
            Products
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
            Fresh microgreens with natural nutrition and premium quality
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.32 }}
              transition={{ duration: 0.52, delay: index * 0.05, ease }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-emerald-950/8 bg-white shadow-[0_18px_60px_rgba(22,101,52,0.08)] transition duration-300 hover:shadow-[0_28px_90px_rgba(22,101,52,0.16)]"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-emerald-600 via-lime-500 to-emerald-700" />

              <div className="relative h-56 w-full overflow-hidden bg-emerald-50">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-emerald-950/16 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              </div>

              <div className="relative p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-snug text-emerald-950">
                    {item.title.trim()}
                  </h2>

                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-600 ring-1 ring-amber-200/70">
                    <Star size={14} fill="currentColor" />
                    {item.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-emerald-900/8 pt-4">
                  <p className="text-xl font-semibold text-primary">
                    ₹{item.price}
                  </p>

                  <motion.span
                    aria-hidden
                    initial={{ width: 28 }}
                    whileHover={{ width: 44 }}
                    className="h-1 rounded-full bg-linear-to-r from-emerald-600 to-lime-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
