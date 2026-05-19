"use client";

import { motion } from "framer-motion";
import homebg from "../assests/homepagebg.webp";
import Image from "next/image";
import tray from "@/assests/Tray Image.webp"
import MicrogreenTray from "@/components/MicrogreenTray";

const points = [
  "Packed with concentrated nutrients for maximum benefit",
  "Rich in antioxidants that help protect and repair the body",
  "Supports immunity, energy, and overall wellness",
  "Convenient to include in daily meals without extra effort",
  "Freshly harvested for better taste, freshness, and nutrition",
  "Supports a healthy lifestyle with clean and naturally grown greens"
];

export default function Home() {
  return (
    <div>
      <section
        className="relative h-[90vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${homebg.src})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55"></div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 text-center"
        >
          <h1 className="text-3xl max-w-7xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl">
            Fresh Microgreens,
            <span className="text-green-400"> Grown Naturally </span>
            for Your Daily Health
          </h1>
        </motion.div>
      </section>

      {/* WHY MICROGREENS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-primary"
          >
            Why Microgreens
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 mt-4 text-lg"
          >
            Why Include Microgreens in Your Daily Diet?
          </motion.p>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {points.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-white"
              >
                <div className="flex items-start gap-3">
                  <span className="text-primary w-6 text-2xl font-bold leading-7">
                    {index + 1}.
                  </span>

                  <p className="text-gray-700 leading-7 text-left">
                    {item}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Microgreen 40x */}
      <MicrogreenTray />
    </div>
  );
}
