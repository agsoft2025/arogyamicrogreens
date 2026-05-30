"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { highlightWords } from "@/data/highlightwords";
import { microgreens } from "@/data/microgreens";

export default function MicrogreenPage() {
  const ease = [0.22, 1, 0.36, 1] as const;

  const highlightText = (text: string) => {
    const regex = new RegExp(`(${highlightWords.join("|")})`, "gi");

    return text.split(regex).map((part, i) =>
      highlightWords.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
        <span key={i} className="font-semibold text-emerald-950">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#f7fbf0] py-10 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(52,211,153,0.22),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(190,242,100,0.26),transparent_30%),linear-gradient(180deg,#f7fee7_0%,#f8faf3_48%,#ecfdf5_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(22,101,52,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(22,101,52,0.28)_1px,transparent_1px)] [background-size:68px_68px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 md:text-6xl">
            Microgreens Collection
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
            Explore our nutrient-rich microgreens and their health benefits
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {microgreens.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 34, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.52, delay: index * 0.04, ease }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-emerald-950/8 bg-white shadow-[0_18px_60px_rgba(22,101,52,0.08)] transition duration-300 hover:shadow-[0_26px_80px_rgba(22,101,52,0.16)]"
            >
              <div className="relative h-56 w-full overflow-hidden bg-emerald-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-emerald-950/42 via-emerald-950/4 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-left text-2xl font-semibold leading-tight text-white drop-shadow-sm">
                    {item.title}
                  </h2>
                </div>
              </div>

              <div className="relative p-5">
                <div className="absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-emerald-600/22 to-transparent" />
                <div className="space-y-3">
                  {item.benefits.map((benefit, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.32, delay: 0.1 + i * 0.025, ease }}
                      className="flex gap-3 text-left text-sm leading-6 text-stone-600"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-900/8">
                        <Leaf size={12} />
                      </span>
                      <span>{highlightText(benefit)}</span>
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
